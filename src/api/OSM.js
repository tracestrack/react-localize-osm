import osmAuth from "osm-auth";
import Overpass from "./Overpass";

// tag to identify changesets created by app
const appTag = "OSM-Localization-Web";

function json2xml(json) {
    return Object.entries(json)
    .map(([k, v]) => {
        let attrs = [];
        let children = "";
        Object.entries(v)
        .forEach(([k1, v1]) => {
            if(Array.isArray(v1)) {
                const k11 = k1.replace(/s$/, "");
                children += v1.map(obj => json2xml({[k11]: obj}))
                            .join("");
            } else if(typeof(v1) === "object") {
                children += json2xml({[k1]: v1});
            } else {
                attrs.push([k1, v1]);
            }
        });
        const attrsStr = attrs.map(([k1, v1]) => `${k1}="${v1}"`).join(" ");
        return children ? 
        `<${k} ${attrsStr}>${children}</${k}>`
        : `<${k} ${attrsStr}/>`;
    })
    .join("");
}

function createChangeset() {
    return json2xml({
        osm: {
            changeset: [
                {tag: {k: "created_by", v: appTag}},
                {tag: {k: "comment",    v: ""}}
            ]
        }
    });
}
function createOsm(changeset) {
    return json2xml({
        osm: {
            changeset: {
                tags:  Object.entries(changeset.tags)
                .map(([k, v]) => ({k, v}))            
            }
        }
    });
}

function createOsmChange(updates, changesetId) {
    return json2xml({
        osmChange: {
            version: "0.6",
            generator: appTag,
            modify: Object.values(updates)
                    .map(({type, tags, nodes, members, ...attrs}) => ({
                        [type]: {
                            ...attrs,
                            changeset: changesetId,
                            tags: Object.entries(tags)
                                    .map(([k, v]) => ({k, v})),
                            // way
                            ...(nodes ? {nd: nodes.map(id => ({ref: id}))} : {}),
                            // relation
                            ...(members ? {members} : {})
                        }
                    }))               
        }
    });
}


export default class OSMApi {
    constructor(config) {
        this.config = config;
        this.auth = osmAuth({
            ...config
        });
        this.overpass = new Overpass({
            apiUrl: config.overpassApiUrl
        });
        this.apiRoute = "/api/0.6";
        this.currentChangeset = config.changeset || false;
    }
    fetch(route, options = {}) {
        // wrapper for osm-auth and underlying ohauth to provide
        // more fetch-alike interface        
        const {method, body, headers = {}, ...opts} = options;
        return new Promise((resolve, reject) => 
            this.auth.xhr({
                method: method || 'GET',
                path: this.apiRoute + route,
                content: body,
                options: {
                    header: headers,
                    ...opts
                }
            }, function(err, res) {
                if(!err) {
                    resolve(res);
                } else {
                    reject(err);
                }                
            })
        );    
    }
    fetchJson(route, options) {
        return this.fetch(route, options)
                .then(res => JSON.parse(res));
    }
    authenticated() {
        return this.auth.authenticated();
    }
    login() {
        return new Promise(resolve => 
            this.auth.authenticate(res => {
                resolve(res);
            })
        );
    }
    logout() {
        this.auth.logout();
    }
    getUser() {
        return this.fetchJson("/user/details.json");            
    }
    getElements(opts) {
        return this.overpass.query(opts);
    }
    getTwins(el, tags) {
        return this.overpass.getTwins(el, tags);
    }

    updateElements(updates) {
        if(!this.currentChangeset) {
            return this.createChangeset()
            .then(() => this.updateChangeset(updates));
        }
        return this.checkChangesetOpen()
        .then(open => {
            if(!open) {
                return this.createChangeset()
                .then(() => this.updateChangeset(updates));
            }
            return this.updateChangeset(updates);
        });
    }
    getChangesets() {
        return this.fetch("/changesets");
    }
    getCurrentChangeset() {
        return this.checkChangesetOpen()
        .then(open => {
            if(!open) {
                return this.createChangeset()
                .then(() => this._getCurrentChangeset());
            }
            return this._getCurrentChangeset();
        })
    }
    _getCurrentChangeset() {
        return this.fetchJson(`/changeset/${this.currentChangeset}.json`)
        .then(res => res.elements[0]);
    }
    createChangeset() {
        return this.fetch("/changeset/create", {
            method: "PUT",
            body: createChangeset(),
            headers: {
                'Content-Type': "text/plain"
            }       
        }).then(createdId => {
            this.currentChangeset = createdId;
        });        
    }
    checkChangesetOpen() {
        return this.fetchJson(`/changeset/${this.currentChangeset}.json`)
        .then(res => {
            return res.elements?.pop().open;
        })
    }
    updateChangesetTags(changeset) {
        return this.fetch(`/changeset/${this.currentChangeset}`, {
            method: "PUT",
            body: createOsm(changeset),
            headers: {
                'Content-Type': "text/plain"
            }   
        });
    }
    closeChangeset() {
        return this.fetch(`/changeset/${this.currentChangeset}/close`, {
            method: "PUT"
        }).then(() => {
            this.currentChangeset = false;
        })
    }
    updateChangeset(updates) {
        return this.fetch(`/changeset/${this.currentChangeset}/upload`, {
            method: "POST",
            body: createOsmChange(updates, this.currentChangeset),
            headers: {
                'Content-Type': "text/plain"
            }   
        })
        .then(diffRes => {
            // the format of responce is xml document like:
            //
            // <diffResult generator="OpenStreetMap Server" version="0.6">
	        //     <node|way|relation old_id="#" new_id="#" new_version="#"/>
            //  </diffResult>
            //
            // old_id == new_id, because we apply only modify             

            return Object.fromEntries(
                Array.from(diffRes.children[0].children)
                .map(el => [
                    el.getAttribute("new_id"), {
                        version: +el.getAttribute("new_version")
                    }]));
        });
    }

}