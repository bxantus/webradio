
export interface Query {
    name: string;
    tags?: string;
    limit?: number;
}

export interface Station {
    name: string
    id: string,
    tags: string,
    country: string,
    language: string,
    icon: string,
    votes: number,
}

// api docs at: https://api.radio-browser.info/
// and https://de1.api.radio-browser.info/#Advanced_station_search
export class RadioSearch {
    public query: Query
    private offset = 0

    results:Station[] = []
    constructor(query: Query) {
        this.query = query
        if (this.query.limit == undefined)
            this.query.limit = 20
    }

    async search() {
        // compute url
        let url = `${apiUrl}/stations/search?name=${this.query.name}&order=votes&reverse=true&limit=${this.query.limit}&offset=${this.offset}`
        // do the stuff
        let results = await fetch(url).then(res => res.json())
        let res:Station[] = results.map(r =>({  name: r.name,
                                                id: r.stationuuid,
                                                tags: r.tags,
                                                country: r.country,
                                                language: r.language,
                                                icon: r.favicon,
                                                votes: r.votes,
                                            }))
        this.results.push(...res)
    }
}

export async function getStreamUrl(station:Station) {
    var url = `${apiUrl}/url/${station.id}`;
    var res = await fetch(url).then(res=>res.json())
    if (res && res.ok)
        return res.url as string;
    else return undefined;
}

export async function refreshStation(station:Station) {
    var url = `${apiUrl}/stations/byuuid/${station.id}`; // get info for this station only
    // will return an array with one item
    // todo: process station
}

export async function voteForStation(station:Station) {
    var url = `${apiUrl}/vote${station.id}`; // get info for this station only
    // will return status of vote (in the ok field)
    // todo: process and return result
}

const apiUrl = "https://de1.api.radio-browser.info/json" // todo: should do dns lookup as the docs ask