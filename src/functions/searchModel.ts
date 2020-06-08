import { RadioSearch } from "./radioApi";
import { SubscriptionRepository, Subscription } from "../models/base";


export default class Search  {
    private subs = new SubscriptionRepository()
    private searchTimer
    private currentSearch:RadioSearch|undefined

    get searchText() {
        return this.currentSearch ? this.currentSearch.query.name : ""
    }

    async scheduleSearch(query:string, timeout = 400) {
        this.searchTimer = clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(async () => {
            let search = new RadioSearch({name: query})
            this.currentSearch = search
            this.subs.notifyFor("searching", true)
            await search.search()
            this.subs.notifyFor("query", undefined) // search query changed
            this.subs.notifyFor("searching", false)
            this.subs.notifyFor("results", search.results)
        }, timeout)
    }

    async loadMoreResults() {
        if (this.currentSearch && this.currentSearch.hasMoreResults) {
            this.subs.notifyFor("searching", true)
            await this.currentSearch.search()
            this.subs.notifyFor("searching", false)
            this.subs.notifyFor("results", this.currentSearch.results)
        }
    }

    subscribe(prop: "searching" | "results" | "query", changeFunc:(newVal:any) => void):Subscription {
        return this.subs.add(prop, changeFunc)
    }
}