
export interface Query {
    name: string;
    tags?: string;
    limit?: number;
}

export interface Station {
    name: string
    id: number,
    tags: string,
    country: string,
    language: string,
    icon: string,
}

// api docs at: https://www.radio-browser.info/webservice#General
export class RadioSearch {
    private query: Query
    private offset = 0

    results:Station[] = []
    constructor(query: Query) {
        this.query = query
        if (this.query.limit == undefined)
            this.query.limit = 20
    }

    async search() {
        // compute url
        let url = `https://www.radio-browser.info/webservice/json/stations/search?name=${this.query.name}&order=votes&reverse=true&limit=${this.query.limit}&offset=${this.offset}`
        // do the stuff
        let results = await fetch(url).then(res => res.json())
        let res:Station[] = results.map(r =>({  name: r.name,
                                                id: r.id,
                                                tags: r.tags,
                                                country: r.country,
                                                language: r.language,
                                                icon: r.favicon,
                                            }))
        this.results.push(...res)
    }
}

export async function getStreamUrl(station:Station) {
    var url = "https://www.radio-browser.info/webservice/v2/json/url/" + station.id;
    var res = await fetch(url).then(res=>res.json())
    if (res && res.ok)
        return res.url;
    else return false;
}
