import { RadioSearch } from "./radioApi";
import { SubscriptionRepository, Subscription } from "../models/base";


export default class Search  {
    private subs = new SubscriptionRepository()
    private searchTimer
    private currentSearch:RadioSearch|undefined
    private _searching = false

    /** @returns true if at least one search qyery was performed */
    get activated() { return this.currentSearch != undefined }

    get searching() { return this._searching }
    private setSearching(searching:boolean) {
        if (this._searching != searching) {
            this.subs.notifyFor("searching", searching)
            this._searching = searching
        }
    }
    
    get searchText() {
        return this.currentSearch ? this.currentSearch.query.name : ""
    }

    async scheduleSearch(query:string, timeout = 400) {
        this.searchTimer = clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(async () => {
            let search = new RadioSearch({name: query})
            this.currentSearch = search
            this.setSearching(true)
            await search.search()
            this.subs.notifyFor("query", undefined) // search query changed
            this.setSearching(false)
            this.subs.notifyFor("results", search.results)
        }, timeout)
    }

    get hasMoreResults() { return this.currentSearch ? this.currentSearch.hasMoreResults : false }

    async loadMoreResults() {
        if (this.currentSearch && this.currentSearch.hasMoreResults) {
            this.setSearching(true)
            await this.currentSearch.search()
            this.setSearching(false)
            this.subs.notifyFor("results", this.currentSearch.results)
        }
    }

    subscribe(prop: "searching" | "results" | "query", changeFunc:(newVal:any) => void):Subscription {
        return this.subs.add(prop, changeFunc)
    }
}