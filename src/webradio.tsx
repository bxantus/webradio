import React from 'react';
import RadioSearch from './components/search'
import RadioPlayerUI, { radioPlayer } from './components/player'
import { Station } from './functions/radioApi';
import About from './components/about';
import StationList from './components/stationList';
import { favorites } from './functions/favorites';
import { getLastPlayedStation } from './functions/lastPlayed';
import SearchModel from './functions/searchModel'

interface RadioState {
    selectedTab:Tab
    selectedStation?:Station
}

interface Tab {
    title: string
    content: (cls:string) => JSX.Element
    scrollOffset?:number
}

let currentSearch= new SearchModel

export default class WebradioApp extends React.Component<{}, RadioState> {
    state:RadioState 

    constructor(props) {
        super(props);
        this.state = {
            selectedTab: this.searchTab, // todo: by default we could start with the about (help) tab
        }
        favorites.load();
    }

    async componentDidMount() {
        favorites.onUpdated(() => {
            this.setState({}) // update
        })
        radioPlayer.subscribe("station", (station:Station) => {
            this.setState({}) // update display of currently playing station
        })
        const lastPlayed = await getLastPlayedStation()
        if (lastPlayed) {
            radioPlayer.setStation(lastPlayed)
            this.stationSelected(lastPlayed) // switch to play tab
        }
    }

    tabs = [
        { title: "Favorites", content: (cls:string) => <div className={cls}><StationList stations={favorites.list} onStationSelected={station=> this.stationSelected(station)} ></StationList></div> },
        { title: "Playing", content: (cls:string) => <RadioPlayerUI className={cls} station={this.state.selectedStation}></RadioPlayerUI> },
        { title: "About", content: (cls:string) => <About className={cls} ></About>},
    ]
    

    private searchTab:Tab = { 
                              title: "Search", 
                              content: (cls:string) => <RadioSearch className={cls} search={currentSearch} onStationSelected={station=> this.stationSelected(station)}>Search content</RadioSearch>,
                              scrollOffset: 0
                            }


    changeTab(tab:Tab, userSelect=true)  {
        this.state.selectedTab.scrollOffset = document.scrollingElement?.scrollTop ?? 0 // save scroll offset
        this.setState({
            selectedTab: tab
        })
        if (userSelect) {
            this.setState({
                selectedStation: radioPlayer.station
            })
        }
    }

    stationSelected(station:Station) {
        this.setState({
            selectedStation: station
        })
        // todo: should use rather tab id
        this.changeTab(this.tabs[1], /*userSelect*/false)  
    }

    searchTextChanged(e) {
        const query = e.target.value;
        currentSearch.scheduleSearch(query)
    }

    private searchInput = React.createRef<HTMLInputElement>()
    private focusOnSearch = false
    selectSearch() {
        this.changeTab(this.searchTab)
        this.focusOnSearch = true
    }

    componentDidUpdate() {
        if (this.focusOnSearch && this.searchInput.current) {
            this.searchInput.current.focus()
            this.focusOnSearch = false
        }
        if (document.scrollingElement) {
            if (this.state.selectedTab == this.searchTab) {
                document.scrollingElement.scrollTop = this.searchTab.scrollOffset ?? 0 // preserve search scroll
            } else document.scrollingElement.scrollTop = 0 // on other views reset scroll
        }
    }

    render() {
        const tabs = this.tabs
        const selectedTab = this.state.selectedTab
        
        const tabTitles = tabs.map(tab => {
                    let selection = (selectedTab == tab) ? <span className="selection"></span> : undefined
                    return <div className="tab flexible vertical"
                               key={tab.title} onClick={e=>this.changeTab(tab)} >
                                    <span className="title">{tab.title}</span>
                                    {selection}
                           </div> 
        })
        const allTabs = [this.searchTab].concat(tabs)
        const tabContent = allTabs.map(tab => tab.content(tab == selectedTab ? "visible" : "hidden"))
        const searchSelected = this.searchTab == selectedTab;
        
        return (
            <div className="radio-App">
                <div id="top" className="flexible vertical radio">
                    <div className="header flexible horizontal">
                        <img className="logo" src="/webradio/logo.svg"></img>
                        <span className={`divider ${searchSelected ? "blinking" : "static"}`}></span>
                        <span className={`currently-playing ${searchSelected ? "hidden" : "visible"}`}>
                            {radioPlayer.station?.name}
                        </span>
                        <input className={`search flex1 ${searchSelected ? "visible" : "hidden"}`} 
                            ref={this.searchInput}
                            defaultValue={currentSearch.searchText} 
                            onInput={ (e) => { this.searchTextChanged(e) } }>
                        </input>
                    </div>
                    <div className="tabs flexible horizontal">
                        <span className="flex1"></span>
                        {tabTitles}
                        <span className="flex1"></span>
                        <a className="search-tab" onClick={e=> this.selectSearch()}>
                            <img className="icon search" src="/webradio/icons/search.svg"></img>
                        </a>
                    </div>
                </div>
                <div id="content" className="radio flexible vertical">
                    {tabContent}
                </div>
            </div>
        )
    }
}
