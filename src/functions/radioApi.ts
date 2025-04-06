
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
    // fields below are added to v1
    codec:string,              
    bitrate:number,            
}

/// station format from api.radio-browser
interface RadioStation { 
    /** A globally unique identifier for the change of the station information */
    changeuuid:string,         
    /**A globally unique identifier for the station */
    stationuuid:string,        
    /**  The name of the station */
    name:string, 	           
    /**  URL (HTTP/HTTPS) 	The stream URL provided by the user*/
    url:string,                
    /** URL (HTTP/HTTPS) 	An automatically "resolved" stream URL. Things resolved are playlists (M3U/PLS/ASX...), HTTP redirects (Code 301/302). This link is especially usefull if you use this API from a platform that is not able to do a resolve on its own (e.g. JavaScript in browser) or you just don't want to invest the time in decoding playlists yourself. */
    url_resolved:string,       
    /** URL (HTTP/HTTPS) 	URL to the homepage of the stream, so you can direct the user to a page with more information about the stream. */
    homepage:string,           
    /**  URL (HTTP/HTTPS) 	URL to an icon or picture that represents the stream. (PNG, JPG)*/
    favicon:string,            
    /** multivalue, split by comma 	Tags of the stream with more information about it */
    tags:string,               
    /** DEPRECATED: use countrycode instead, full name of the country */ 
    country:string             
    /** 2 letters, uppercase 	Official countrycodes as in ISO 3166-1 alpha-2 */
    countrycode:string,        
    /**  Full name of the entity where the station is located inside the country*/
    state:string,              
    /** multivalue, split by comma 	Languages that are spoken in this stream. */
    language:string,           
    /** integer 	Number of votes for this station. This number is by server and only ever increases. It will never be reset to 0. */
    votes:number,              
    /** datetime, YYYY-MM-DD HH:mm:ss 	Last time when the stream information was changed in the database */
    lastchangetime:string,     
    /** The codec of this stream recorded at the last check. */
    codec:string,              
    /** integer, bps 	The bitrate of this stream recorded at the last check. */
    bitrate:number,            
    /** 0 or 1 	Mark if this stream is using HLS distribution or non-HLS. */
    hls:number,                
    /** 0 or 1 	The current online/offline state of this stream. This is a value calculated from multiple measure points in the internet. 
     * The test servers are located in different countries. It is a majority vote. */
    lastcheckok: number        
    /** datetime, YYYY-MM-DD HH:mm:ss 	The last time when any radio-browser server checked the online state of this stream */
    lastchecktime:string,      
    /** datetime, YYYY-MM-DD HH:mm:ss 	The last time when the stream was checked for the online status with a positive result */
    lastcheckoktime:string,    
    /** datetime, YYYY-MM-DD HH:mm:ss 	The last time when this server checked the online state and the metadata of this stream */
    lastlocalchecktime:string, 
    /** datetime, YYYY-MM-DD HH:mm:ss 	The time of the last click recorded for this stream */
    clicktimestamp:string,     
    /** integer 	Clicks within the last 24 hours */
    clickcount:number,         
    /** integer 	The difference of the clickcounts within the last 2 days. Posivite values mean an increase, negative a decrease of clicks. */
    clicktrend:number,         
}

function toStation(r:RadioStation):Station {
    return {  name: r.name,
              id: r.stationuuid,
              tags: r.tags,
              country: r.country,
              language: r.language,
              icon: r.favicon,
              votes: r.votes,
              codec: r.codec,
              bitrate: r.bitrate
    }
}

export interface SearchResults {
    stations: Station[] 
    error:string|undefined
}

// api docs at: https://api.radio-browser.info/
// and https://de1.api.radio-browser.info/#Advanced_station_search
export class RadioSearch {
    public query: Query
    private offset = 0
    private _hasMoreResults = false

    results:SearchResults = { 
        stations: [], 
        error: undefined 
    }
    constructor(query: Query) {
        this.query = query
        if (this.query.limit == undefined)
            this.query.limit = 20
    }

    /// @return with the number of stations found
    async search() {
        try {
            const apiUrl = await getApiUrl()
            // compute url
            let url = `${apiUrl}/stations/search?name=${this.query.name}&order=votes&reverse=true&limit=${this.query.limit}&offset=${this.offset}`
            // do the stuff
            let results = await fetch(url).then(res => res.json())
            let res:Station[] = results.map(toStation)
            this.results.stations.push(...res)
            this.offset = this.results.stations.length
            this._hasMoreResults = res.length == this.query.limit // when fever results are returned, then no more results are available
        } catch (err) {
            this.results.error = (err as Error).message 
            this.results.stations = []
        }
    }

    get hasMoreResults() { return this._hasMoreResults }
}

export async function getStreamUrl(station:Station) {
    const apiUrl = await getApiUrl()
    var url = `${apiUrl}/url/${station.id}`;
    var res = await fetch(url).then(res=>res.json())
    if (res && res.url)
        return res.url as string;
    else return undefined;
}

export async function refreshStation(station:Station) {
    const apiUrl = await getApiUrl()
    var url = `${apiUrl}/stations/byuuid/${station.id}` // get info for this station only
    var res = await fetch(url).then(res=>res.json())
    // will return an array with one item
    if (res && res[0]) {
        return toStation(res[0])
    }
}

export async function voteForStation(station:Station) {
    const apiUrl = await getApiUrl()
    var url = `${apiUrl}/vote/${station.id}`; 
    // will return status of vote (in the ok field)
    try {
        var res = await fetch(url)
        if (res.ok) {
            res = await res.json()
            return res.ok
        } else return false
    } catch (err) {
        return false
    }
}

interface BaseUrl {
    ip: string
    name: string
}

function apiUrlFetcher() {
    let apiUrl:string|Promise<string>|undefined;
    
    const doFetch = async () => {
        const baseUrls = (await fetch("https://all.api.radio-browser.info/json/servers")
                         .then(res => res.json())) as BaseUrl[];
        // filter the baseUrls array with unique names
        const uniqueUrls = baseUrls.filter((url, index, self) =>
            index === self.findIndex((u) => u.name === url.name)
        );
        // pick one randomly
        const randomIndex = Math.floor(Math.random() * uniqueUrls.length);
        const url = uniqueUrls[randomIndex].name 
        return url.startsWith("http://") || url.startsWith("https://") 
                    ? `${url}/json` 
                    : `https://${url}/json` 
    }    
    return async () => {
        if (!apiUrl) 
            apiUrl = doFetch()
        return apiUrl
    }
}

export const getApiUrl = apiUrlFetcher()

export function needsUpgrade(station:Station) {
    // from v0 to v1 (codec and bitrate added)
    return station.codec == undefined || station.bitrate == undefined;
}

export async function upgradeStation(station:Station) {
    let refreshed = await refreshStation(station)
    if (refreshed) {
        station.codec = refreshed.codec;
        station.bitrate = refreshed.bitrate;
        // could refresh all fields but only these have been added
        return true
    }
    return false
}