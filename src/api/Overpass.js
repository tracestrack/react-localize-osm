const defaultApiUrl = "https://overpass-api.de/api/interpreter";

const outTypes = "qt body meta center"; //we need meta for "version" field

export default class Overpass {
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || defaultApiUrl;
    }
    request(query) {
        const data = new FormData();
        data.append("data", query);
        const reqId = performance.now();
        this.reqId = reqId;
        return new Promise((resolve, reject) => {
            fetch(this.apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
                },
                body: new URLSearchParams(data)
            })
            .then(response => response.ok ?
                response.json()
                .then(({elements, remark}) => {
                    if(this.reqId !== reqId)
                        reject();
                    else {
                        if(remark && remark.indexOf("error") !== -1) {
                            reject(remark);
                        }
                        resolve(elements);
                    }
                }) :
                response.text()
                .then(reject)

                )
            .catch(err => reject(err));
        })
    }
    getTwins(el, tags) {
        const tagsStr = tags.filter(t => el.tags[t])
                            .map(t => `["${t}"="${el.tags[t]}"]`);
        const query =
            `[out:json][timeout:25];
            ${el.type}(${el.id});
            complete(100) {
                nwr(around:500)${tagsStr}["name"="${el.tags.name}"];
            }
            out ${outTypes};`

        return this.request(query);
    }
    query({bbox, zoom, center, filters, languages}) {
        const baseEls = filters.tags.map(t => `nwr["${t}"]["name"]`);
        const elementsQuery = filters.hideFilled ?
            baseEls.map(base =>
                languages.map(l => `${base}[!"name:${l}"]`)
                .join(";\n")
            )
            : baseEls.join(";\n");


        const limit = filters.limit ? " " + filters.limit : "";
        const query =
            `[out:json][timeout:25][bbox:${bbox.join(",")}];
            (
                ${elementsQuery};
            );
            out ${outTypes} ${limit};`;

        return this.request(query);
    }
    getById(typesIds) {
        const elementsQuery = typesIds.map(
                                ([type, id]) => `${type}(${id})`).join(";");
        const query =
        `[out:json][timeout:25];
        (
            ${elementsQuery};
        );
        out ${outTypes};`;

    return this.request(query);
    }
}