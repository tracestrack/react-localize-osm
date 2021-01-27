import {Fragment, Component} from "react";
import Container from 'react-bootstrap/Container';
import Card from "react-bootstrap/Card";
import Map from "./components/Map";
import NotLoggedInGreeting from "./components/NotLoggedInGreeting";
import ItemsFilters from "./components/ItemsFilters";
import ItemsTable from "./components/ItemsTable";
import AppNavbar from "./components/AppNavbar";
import OSMApi from "./api/OSM";
import CookieManager from "./utils/CookieManager";
import UpdatesStorage from "./utils/UpdatesStorage";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import authConfig from "./config/auth";
import {languagesList, tagsList} from "./config/interface";
import history from "history/browser";

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
            }
        };
    }
    parseURLPath() {
        let zoom = 6;
        let center = [0, 0];
        const hash = history.location.hash.replace("#/", "");
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
            hideFilled: false
        };
        const search = history.location.search.replace("?", "");
        if(search) {
            const params = Object.fromEntries(
                search.split("&")
                .map(e => e.split("="))
            );
            if(params.tags) {               
                const cleanedTags = params.tags.split(",")
                    .filter(t => tagsList.find(t1 => t1.key === t));
                if(cleanedTags.length)
                    filters.tags = cleanedTags;
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
    updateLocation() {
        const {
            zoom, 
            center: [lat, lng], 
            filters: {tags, limit, hideFilled}
        } = this.state;

        const hash = ["/#", zoom, lat.toFixed(4), lng.toFixed(4)].join("/");
        const searchParts = [`tags=${tags.join(",")}`];        
        if(limit) 
            searchParts.push(`limit=${limit}`);
        if(hideFilled)
            searchParts.push(`hide_filled=1`);
        const search = "?" + searchParts.join("&");
        
        history.push({search, hash});

    }
    componentDidMount() {
        if(this.osmApi.authenticated()) {
            this.getUser(); 
        }
    }
    setServerMsg(serverMsg) {
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
                }
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
            () => this.updateLocation());
        this.bbox = bbox;
    }
    updateBbox({bbox}) {
        this.bbox = bbox; 
    }
    updateItem(item, lang, value) {
        item.tags[`name:${lang}`] = value;
        this.setState({itemsToUpdate: {
            ...this.state.itemsToUpdate,
            [item.id]: item
        }});
    }
    setFilter(updates) {
        this.setState({
            filters: {
                ...this.state.filters,
                ...updates
            }
        }, () => this.updateLocation());
    }
    updateItems() {
        this.setState({
            loading: {
                ...this.state.loading,
                updates: true
            }
        });
        this.osmApi.updateElements(this.state.itemsToUpdate)
        .then(diff => {
            console.log(diff)
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
        } else this.setState({
            focusedItem: itemId
        });
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
        const hasItemsToUpdate = !!Object.keys(this.state.itemsToUpdate).length;
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
                                hasItemsToUpdate={hasItemsToUpdate}
                                updateItems={this.updateItems.bind(this)}
                            /> 
                            <div className={this.state.serverMsg.error ? "text-danger" : "text-success"}>
                                {this.state.serverMsg.text}
                            </div> 
                        </Card.Header>
                        <Card.Body>
                            <ItemsTable 
                                loading={this.state.loading.items}
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
            </Container>
        );
    }
}

export default App;
