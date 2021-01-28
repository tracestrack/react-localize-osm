const defaultApiUrl = "https://overpass-api.de/api/interpreter";

export default class Overpass {
    constructor(config = {}) {
        this.apiUrl = config.apiUrl || defaultApiUrl;
    }
    query({bbox, zoom, center, filters, languages}) {
        const baseEls = filters.tags.map(t => `nwr["${t}"]["name"]`);
        const radius = 75000;
        const area = zoom > 10 ?
            `(${bbox.join(",")})`
            : `(around:${radius},${center.join(",")})`;


        const elementsQuery = (filters.hideFilled ? 
            baseEls.map(base => 
                languages.map(l => `${base}[!"name:${l}"]${area}`)
                .join(";\n")
            )
            : baseEls.map(base => base + area))
            .join(";\n");

        const outTypes = "qt body meta center"; //we need meta for "version" field 
        const limit = filters.limit ? " " + filters.limit : "";
        const query = 
            `[out:json][timeout:25];
            (
                ${elementsQuery};
            );
            out ${outTypes} ${limit};`;

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
}