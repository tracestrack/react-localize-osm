import {Fragment, Component} from "react";
import Container from 'react-bootstrap/Container';
import Card from "react-bootstrap/Card";
import Map from "./components/Map";
import NotLoggedInGreeting from "./components/NotLoggedInGreeting";
import ItemsFilters from "./components/ItemsFilters";
import ItemsTable from "./components/ItemsTable";
import AppNavbar from "./components/AppNavbar";
import ChangesetSettings from "./components/ChangesetSettings";
import OSMApi from "./api/OSM";
import CookieManager from "./utils/CookieManager";
import UpdatesStorage from "./utils/UpdatesStorage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import authConfig from "./config/auth";
import {languagesList, tagsList} from "./config/interface";

const cookieKeys = {
    languages: "_osm-localization_languages",
    changeset: "_osm-locatization_changeset"
};

const itemCenter = item => item.center ?
                            [item.center.lat, item.center.lon]
                          : [item.lat, item.lon];
const itemMinZoom = 14;

class App extends Component {
    constructor(props) {
        super(props);
        this.cookieManager = new CookieManager();
        this.osmApi = new OSMApi({
            ...authConfig,
            changeset: this.cookieManager.get(cookieKeys.changeset)
        });
        this.updatesStorage = new UpdatesStorage();
        this.updatesStorage.load();
        const {zoom, center} = this.parseURLPath();
        const filters = this.parseURLQuery();

        this.bbox = [];
        this.state = {
            user: {
                loggedIn: false
            },
            center,
            zoom,
            filters,
            items: [],
            itemsToUpdate: {},
            focusedItem: false,
            watchFocus: false, // center map on focused item
            loading: {
                items: false,
                updates: false,
                auth: false
            },
            serverMsg: {
                error: false,
                text: ""
            },
            changeset: null,
            lastReqTags: []
        };
    }
    parseURLPath() {
        let zoom = 6;
        let center = [0, 0];
        const hash = window.location.hash.replace("#/", "");
        if (hash) {
            const [z, lat, lng] = hash.split("/");
            zoom = +z;
            center = [+lat, +lng];
        }

        return {zoom, center};
    }
    parseURLQuery() {
        const filters = {
            tags: ["place"],
            limit: 100,
            hideFilled: false,
            search: {
                q: "",
                street:  "",
                city: "",
                county: "",
                state: "",
                country: "",
                postalcode: ""
            },
            searchMode: "simple",
            mode: "tags"
        };
        const search = window.location.search.replace("?", "");
        if(search) {
            const params = Object.fromEntries(
                search.split("&")
                .map(e => e.split("="))
            );
            if(params.tags) {
                  filters.tags = decodeURIComponent(params.tags);
            }
            if(params.search) {
                try {
                    const searchParams = JSON.parse(decodeURI(params.search));
                    for(let k in filters.search) {
                        filters.search[k] = searchParams[k] || filters.search[k];
                        if(k !== "q" && !!searchParams[k])
                            filters.searchMode = "structured";
                    }
                    if(!params.tags) {
                        filters.mode = "search";
                    }
                } catch (e) {

                }
            }
            if(params.limit) {
                const n = parseInt(params.limit);
                if(!isNaN(n))
                    filters.limit = n;
            }
            if(params.hide_filled) {
                filters.hideFilled = params.hide_filled &&
                                    +params.hide_filled !== 0;
            }
        }
        return filters;
    }
    loadChangeset() {
        if(this.osmApi.currentChangeset) {
            this.osmApi.getCurrentChangeset()
            .then(changeset => {
                console.log(changeset)
                this.setState({changeset});
            })
        }
    }

    closeChangeset({comment}) {
      let changeset = {
                ...this.state.changeset,
                tags: {
                    ...this.state.changeset.tags,
                    comment
                }
      };

      if (changeset.tags.comment === "") {
        alert("Please add a commit message first.");
      }

      console.log(changeset);

      let _t = this;
      this.osmApi.closeChangeset(changeset, () => {
        //_t.setState({changeset: null});
        _t.cookieManager.write({
          "lastComment": comment
        });
        window.location.reload();
      }
      );
    }

    updateLocation(replace=false) {
        const {
            zoom,
            center: [lat, lng],
            filters: {tags, limit, hideFilled, search, mode, searchMode}
        } = this.state;

        const hash = ["/#", zoom, lat.toFixed(4), lng.toFixed(4)].join("/");
        const searchParts = [];
        if(mode === "search") {
            const {q, ...structured} = search;
            const searchObj = (searchMode === "simple") ?
                               {q}
                              : structured;

            searchParts.push(`search=${JSON.stringify(searchObj)}`);
        }
        else {
            searchParts.push(`tags=${encodeURIComponent(tags)}`);
            if(hideFilled)
                searchParts.push(`hide_filled=1`);
        }
        if(limit)
            searchParts.push(`limit=${limit}`);

        const searchQ = "?" + searchParts.join("&");

        let url = window.location.protocol + "//" + window.location.host + window.location.pathname + searchQ + hash;

        if(replace)
            window.history.replaceState({searchQ, hash}, '', url);
        else
            window.history.pushState({searchQ, hash}, '', url);
    }
    componentDidMount() {
        if(this.osmApi.authenticated()) {
            this.getUser();
        }
    }
  setServerMsg(serverMsg) {
    console.log(serverMsg);
        this.setState({serverMsg});
        const fn = () => {
            document.removeEventListener("click", fn);
            this.setState({serverMsg: {
                error: false,
                text: ""
            }});
        }
        document.addEventListener("click", fn);
    }
    login() {
        this.setState({
            loading: {
                ...this.state.loading,
                auth: true
            }
        });
        this.osmApi.login()
        .then(() => {
            this.getUser();
        });
    }
    getLanguages() {
        const str = this.cookieManager.get(cookieKeys.languages);
        return str ? str.split("+") : false;
    }
    setLanguages(languages) {
        this.setState({
            user: {
                ...this.state.user,
                languages
            }
        });
        this.storeLanguages(languages);
    }
    storeLanguages(languages) {
        this.cookieManager.write({
            [cookieKeys.languages]: languages.join("+")
        });
    }
    getUser() {
        this.osmApi.getUser()
        .then(res => {
            let languages = this.getLanguages() ||
                            res.user.languages.filter(l =>
                                languagesList.find(({key}) => key === l)
                            );
            this.setState({
                loading: {
                    ...this.state.loading,
                    auth: false
                },
                user: {
                    loggedIn: true,
                    ...res.user,
                    languages
                }
            });
            this.storeLanguages(languages);
            this.loadChangeset();
        });
    }
    logout() {
        this.osmApi.logout();
        this.setState({
            user: {
                loggedIn: false
            }
        });
    }
  getItems() {
        this.setState({
            loading: {
                ...this.state.loading,
                items: true
            }
        });
        this.osmApi.getElements({
            center: this.state.center,
            zoom: this.state.zoom,
            bbox: this.bbox,
            filters: this.state.filters,
            languages: this.state.user.languages
        })
        .then(items => {
            this.setState({
                items: this.updatesStorage.sync(items,
                                                this.state.filters.hideFilled,
                                                this.state.user.languages),
                itemsToUpdate: {},
                loading: {
                    ...this.state.loading,
                    items: false
                },
                lastReqTags: this.state.filters.mode === "search" ?
                                  tagsList.map(t => t.key)
                                : this.state.filters.tags.slice()
            });
        })
        .catch(err => {
            console.log(err)
            this.setState({
                loading: {
                    ...this.state.loading,
                    items: false
                }
            });
            this.setServerMsg({
                text: err,
                error: true
            });
        });
    }
    updatePosition({bbox, center, zoom}) {
        this.setState(
            {center, zoom},
            () => this.updateLocation(true));
        this.bbox = bbox;
    }
    updateBbox({bbox}) {
        this.bbox = bbox;
    }
    updateItem(item, lang, value) {
      item.tags[`name:${lang}`] = value;
      /*
        if(!item.twins) {
            // get all the items with the same name and tags
            item.twins = [];
            this.osmApi.getTwins(item, this.state.filters.tags)
            .then(twins => {
                item.twins = twins;
                item.twins.forEach(i => {
                    i.tags[`name:${lang}`] = value;
                });
            });
        } else {
            item.twins.forEach(i => {
                i.tags[`name:${lang}`] = value;
            });
        }*/
        this.setState({itemsToUpdate: {
            ...this.state.itemsToUpdate,
            [item.id]: item
        }});
    }
  setFilter(updates, doneCb) {
    console.log(updates);
        this.setState({
            filters: {
                ...this.state.filters,
              ...{tags: updates}
            }
        }, () => {this.updateLocation();
                  if (doneCb) doneCb();
                 });
    }
    updateItems() {
        this.setState({
            loading: {
                ...this.state.loading,
                updates: true
            }
        });
      let items = this.state.itemsToUpdate;
/*        Object.values(this.state.itemsToUpdate)
            .forEach(i => {
            let {twins, ...self} = i;
            items[self.id] = self;
            twins.forEach(t => {
                items[t.id] = t;
            });
            }); */
      console.log(items);
        this.osmApi.updateElements(items)
        .then(diff => {
            this.updatesStorage.patchAndStore(
                this.state.itemsToUpdate, diff
            );
            this.cookieManager.write({
                [cookieKeys.changeset]: this.osmApi.currentChangeset
            });

            this.setServerMsg({
                text: "Items are successfully updated.",
                error: false
            });

            this.setState({
                itemsToUpdate: {},
                loading: {
                    ...this.state.loading,
                    updates: false
                }
            });
            this.loadChangeset();
        })
        .catch(err => {
            this.setServerMsg({
                text: String.toString(err),
                error: true
            });

            this.setState({
                loading: {
                    ...this.state.loading,
                    updates: false
                }
            });
        });
    }
    focusItem(itemId) {
        if(this.state.watchFocus) {
            const item = this.state.items.find(i => i.id === itemId);
            this.setState({
                center: itemCenter(item),
                focusedItem: itemId
            });
        } else {
            this.setState({
                focusedItem: itemId
            });
        }
    }
    blurItem() {
        this.setState({
            focusedItem: false
        });
    }
    centerItem(item) {
        this.setState({
            center: itemCenter(item),
            zoom: Math.max(this.state.zoom, itemMinZoom)
        });
    }
    render() {
        const btnsDisabled = {
            // query for a large bbox is too slow and won't work
            // also don't load new items till updates are not done and synced
            items: this.state.loading.updates ||
                (this.state.filters.mode === "tags" ?
                    this.state.zoom < 10
                    :  !(this.state.filters.searchMode === "simple" ?
                            this.state.filters.search.q
                            : Object.entries(this.state.filters.search)
                                .find(([k,v]) => k !== "q" && !!v)
                )),
            // nothing to update
            updates: !Object.keys(this.state.itemsToUpdate).length
        };
        const touchedItems  = Object.keys(this.state.itemsToUpdate).map(s => +s);
        const mapHandlers = {
            onLoad:      this.updateBbox.bind(this),
            onMove:      this.updatePosition.bind(this),
            onClickItem: this.focusItem.bind(this),
            onClickMap:  this.blurItem.bind(this),
        };

        const itemHandlers = {
            onFocus:     this.focusItem.bind(this),
            onBlur:      this.blurItem.bind(this),
            onChange:    this.updateItem.bind(this),
            onIconClick: this.centerItem.bind(this)
        };
        const changesetHandlers = {
            onClose:    this.closeChangeset.bind(this)
        };

        const lang = this.state.user.languages ?
            this.state.user.languages[0]
            : "en";

        const tags = tagsList.map(t => t.key);
        return (
            <Container className="App" fluid>
                <AppNavbar
                    login={this.login.bind(this)}
                    logout={this.logout.bind(this)}
                    user={this.state.user}
                    loading={this.state.loading.auth}
                />
                <Map
                    zoom={this.state.zoom}
                    center={this.state.center}
                    items={this.state.items}
                    lang={lang}
                    touched={touchedItems}
                    focused={this.state.focusedItem}
                    watchFocus={this.state.watchFocus}
                    handlers={mapHandlers}
                />
                <Card
                    className="card-items card p-1"
                >{
                this.state.user.loggedIn ?
                    <Fragment>
                        <Card.Header>
                            <ItemsFilters
                                filters={this.state.filters}
                                setFilter={this.setFilter.bind(this)}
                                tagsList={tagsList}
                                loading={this.state.loading}
                                languages={this.state.user.languages||[]}
                                languagesList={languagesList}
                                setLanguages={this.setLanguages.bind(this)}
                                items={this.state.items}
                                getItems={this.getItems.bind(this)}
                                disabled={btnsDisabled}
                                updateItems={this.updateItems.bind(this)}
                            />
                            <div className={this.state.serverMsg.error ?
                                              "text-danger"
                                            : "text-success"}>
                                {this.state.serverMsg.text}
                            </div>
                        </Card.Header>
                        <Card.Body
                            className={this.state.loading.items ?
                                      "items-loading"
                                      : ""}
                        >
                            <ItemsTable
                                categories={tags}
                                languages={this.state.user.languages||[]}
                                items={this.state.items}
                                focused={this.state.focusedItem}
                                handlers={itemHandlers}
                            />

                        </Card.Body>
                    </Fragment>
                    :  <Card.Body className="d-flex align-items-center justify-content-center">
                            <NotLoggedInGreeting />
                        </Card.Body>
                }</Card>
                <ChangesetSettings
                    changeset={this.state.changeset}
                    handlers={changesetHandlers}
                />
            </Container>
        );
    }
}

export default App;
