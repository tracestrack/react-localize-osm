// helper class to sync results from overpass api with latest updates

const hasEmpty = (item, langs) => langs.find(l => !(item.tags[`name:${l}`]));


export default class UpdatesStorage {
    updates = {};
    storageKey = "osm-localizer_updated-items";
    load() {
        if(window.localStorage) {
            const data = localStorage.getItem(this.storageKey);
            if(data) {
                this.updates = JSON.parse(data);
            }
        }
    }
    store() {
        if(window.localStorage) {
            localStorage.setItem(this.storageKey, JSON.stringify(this.updates));
        }
    }
    patchAndStore(items, diff) {
        for(let id in diff) {
            if(items[id]) {
                items[id] = {...items[id], ...diff[id]};
                this.updates[id] = items[id];
            }
        }
        this.store();
    }
    sync(items, hideFilled, langs) {
        const itemsSync = [];
        for(let i = 0, n = items.length; i < n; i++) {
            const id = items[i].id;
            if(this.updates[id]) {
                if(this.updates[id].version > items[i].version) {
                    // if hideFilled = true, then we need manually filter out
                    // items with filled fields, which operass doesn't know
                    // about yet.
                    if(!hideFilled || hasEmpty(this.updates[id], langs))
                        itemsSync.push(this.updates[id]);
                } else {
                    delete this.updates[id];
                    itemsSync.push(items[i]);
                }
            } else {
                itemsSync.push(items[i]);
            }
        }
        this.store();
        return itemsSync;
    }
}