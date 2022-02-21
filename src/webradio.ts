// import RadioSearch from './components/search.tsx'
const radioPlayer:any = {}
// import RadioPlayerUI, { radioPlayer } from './components/player.tsx'
// import About from './components/about.tsx';
// import StationList from './components/stationList.tsx';
import { Station } from './functions/radioApi.ts';
import { favorites } from './functions/favorites.ts';
import { getLastPlayedStation } from './functions/lastPlayed.ts';
import SearchModel from './functions/searchModel.ts'
import { el, div, span, img } from "xdom.ts"
import { binding, SubscriptionRepository, triggered } from "binding.ts"

interface Tab {
    title: string
    content: (cls:string) => HTMLElement|undefined
    scrollOffset?:number
}

let currentSearch= new SearchModel

export default class WebradioApp {
    selectedTab:Tab
    selectedStation?:Station
    element:HTMLElement
    subRepo = new SubscriptionRepository<"selectedTab">()
    get $changes() { return this.subRepo.changes }

    constructor() {
        favorites.load();

        this.selectedTab = this.aboutTab
        this.element = this.render()
    }

    async componentDidMount() {
        favorites.onUpdated(() => {
            // todo: update
        })
        radioPlayer.subscribe("station", (station:Station) => {
            // todo: update
            document.title = `Webradio (${station.name})`
        })
        const lastPlayed = await getLastPlayedStation()
        if (lastPlayed) {
            radioPlayer.setStation(lastPlayed)
            this.stationSelected(lastPlayed) // switch to play tab
        }

        // check scroll state when on search screen, and load more results if necessary
        if (document.scrollingElement) {
            const scrollingElement = document.scrollingElement as HTMLElement
            window.onscroll = (e) => {
                if (scrollingElement.scrollTop + 80 > scrollingElement.scrollHeight - scrollingElement.clientHeight) { // 80px is about one items height
                    if (this.selectedTab == this.searchTab && currentSearch.hasMoreResults && !currentSearch.searching) {
                        currentSearch.loadMoreResults()
                    }
                }
            }
        }
    }

    private favoritesTab:Tab = { title: "Favorites", content: (cls:string) => undefined /* <div className={cls}><StationList 
                                                                                                     stations={favorites.list} onStationSelected={station=> this.stationSelected(station)} 
                                                                                                     emptyText="No favorites yet"
                                                                                                    > 

                                                                                            </StationList></div> */ 
}
    private playingTab:Tab = { title: "Playing", content: (cls:string) => undefined/* <RadioPlayerUI className={cls} station={this.state.selectedStation}></RadioPlayerUI> */ }
    private aboutTab:Tab = { title: "About", content: (cls:string) => undefined/* <About className={cls} ></About> */}

    tabs = [
        this.favoritesTab,
        this.playingTab,
        this.aboutTab,
    ]
    

    private searchTab:Tab = { 
                              title: "Search", 
                              content: (cls:string) => undefined /* <RadioSearch className={cls} search={currentSearch} onStationSelected={station=> this.stationSelected(station)} key="search">Search content</RadioSearch> */,
                              scrollOffset: 0
                            }


    changeTab(tab:Tab, userSelect=true)  {
        const changed = this.selectedTab != tab 
        this.selectedTab.scrollOffset = document.scrollingElement?.scrollTop ?? 0 // save scroll offset
        this.selectedTab = tab
        if (userSelect) {
            this.selectedStation = radioPlayer.station
        }
        if (changed)
            this.subRepo.notifyFor("selectedTab")
        this.tabChanged = changed
    }

    stationSelected(station:Station) {
        this.selectedStation = station
        this.changeTab(this.playingTab, /*userSelect*/false)  
    }

    searchTextChanged(e:Event) {
        const query = (e.target as HTMLInputElement).value;
        currentSearch.scheduleSearch(query)
    }

    private searchInput:HTMLInputElement|undefined 
    private focusOnSearch = false
    private tabChanged = false
    selectSearch() {
        this.changeTab(this.searchTab)
        this.focusOnSearch = true
        if (!currentSearch.activated)
            currentSearch.scheduleSearch("", 0) // fill search results with top stations, if not activated previously 
    }

    componentDidUpdate() {
        if (this.focusOnSearch && this.searchInput) {
            this.searchInput.focus()
            this.focusOnSearch = false
        }
        if (document.scrollingElement) {
            if (this.selectedTab == this.searchTab) {
                document.scrollingElement.scrollTop = this.searchTab.scrollOffset ?? 0 // preserve search scroll
            } else if (this.tabChanged) {
                document.scrollingElement.scrollTop = 0 // on other views reset scroll
            }
        }
        this.tabChanged = false
    }

    get searchSelected() { return this.searchTab == this.selectedTab }

    private render() {
        const tabs = this.tabs
        const tabTitles = tabs.map(tab => div({class:"tab flexible vertical", onClick:()=>this.changeTab(tab)},
                                            span({class:"title", innerText: tab.title})
        ))
        // const allTabs = [this.searchTab].concat(tabs)
        // const tabContent = allTabs.map(tab => tab.content(tab == selectedTab ? "visible" : "hidden"))

        const rootElement = div({class:"radio-App"},
            div({id:"top", class:"flexible vertical radio"},
                div({class:"header flexible horizontal"}, 
                    img({class:"logo", src:"/logo.svg"}),
                    span({class:`divider static`}),
                    span({
                        class:binding(()=>`currently-playing ${this.searchSelected ? "hidden" : "visible"}`, this.$changes.selectedTab),
                        innerText: binding(()=>radioPlayer.station?.name, /* reeval on station change */)
                    }),
                    this.searchInput = el("input", {
                        class: binding(()=>`search flex1 ${this.searchSelected ? "visible" : "hidden"}`, this.$changes.selectedTab)
                    }
                    ) as HTMLInputElement

                    // todo: onInput
        //                 <input className={`search flex1 ${searchSelected ? "visible" : "hidden"}`} 
        //                     defaultValue={currentSearch.searchText} 
        //                     onInput={ (e) => { this.searchTextChanged(e) } }>
        //                 </input>

                ),
                div({class:"tabs flexible horizontal"},
                    span({class:"flex1"}),
                    ...tabTitles,
                    span({class:"flex1"}),
                    el("a", {class:"search-tab", onClick:()=> this.selectSearch()},
                        img({class:"icon search", src:"/icons/search.svg"})
                    )
                ),
                div({id:"content", class:"radio flexible vertical"},
                    // tabs
                )
            )
        )

        this.searchInput.placeholder = "Search"
        this.searchInput.oninput = e => this.searchTextChanged(e)

        const selection = span({class:"selection"})
        this.$changes.selectedTab.subscribe(triggered( ()=> {
            const idx = this.tabs.indexOf(this.selectedTab)
            // on tab change reparent selection span
            selection.remove()
            // idx is -1 in case of search tab, we won't add selection
            tabTitles[idx]?.append(selection)
        }))
        return rootElement
    }
}
