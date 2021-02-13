const apiUrl = "https://nominatim.openstreetmap.org";
const apiElemLimit = 50;



export default class NominatimAPI {
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || apiUrl;
    }
    query({bbox, filters}, excludeIds=[]) {
        const searchQuery = filters.searchMode === "simple" ?
            ["q=" + filters.search.q]
            : Object.entries(filters.search)
                .filter(([k,val]) => k !== "q" && !!val)
                .map(([k, val]) => `${k}=${val}`)
        const params = [
            ...searchQuery,
            "limit=" + Math.min(filters.limit, apiElemLimit),
            "viewbox=" + bbox.map(c => c.reverse().join(",")).join(","),
            "format=json",
            "bounded=1",
            "dedupe=1"
        ];
        if(excludeIds.length) {
            params.push("exclude_place_ids=" + excludeIds.join(","));
        }
        const reqId = performance.now();
        this.reqId = reqId;
        return new Promise((resolve, reject) => {
            fetch(this.apiUrl + "/search?" + params.join("&"))
            .then(response => response.ok ?
                response.json()
                .then((resp) => {
                    if(resp.error)
                        reject(resp);
                    if(this.reqId !== reqId)
                        reject();
                    else {
                        resolve(resp);
                    }
                }) :
                response.text()
                .then(reject)

                )
            .catch(err => reject(err));
        })
    }
}