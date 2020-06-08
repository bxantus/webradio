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
    selectedTab:string
    selectedStation?:Station
}

interface Tab {
    title: string
    content: (cls:string) => JSX.Element
}

let currentSearch= new SearchModel

export default class WebradioApp extends React.Component<{}, RadioState> {
    state:RadioState = {
        selectedTab: "Search",
    }

    constructor(props) {
        super(props);
        favorites.load();
    }

    async componentDidMount() {
        favorites.onUpdated(() => {
            this.setState({}) // update
        })
        const lastPlayed = await getLastPlayedStation()
        if (lastPlayed) {
            radioPlayer.setStation(lastPlayed)
            this.stationSelected(lastPlayed) // switch to play tab
        }
    }

    get tabs() {
        return [
            { title: "Favorites", content: (cls:string) => <div className={"scrollable " + cls}><StationList stations={favorites.list} onStationSelected={station=> this.stationSelected(station)} ></StationList></div> },
            { title: "Now playing", content: (cls:string) => <RadioPlayerUI className={cls} station={this.state.selectedStation}></RadioPlayerUI> },
            { title: "About", content: (cls:string) => <About className={cls} ></About>},
        ]
    }

    private searchTab:Tab = { title: "Search", content: (cls:string) => <RadioSearch className={cls} search={currentSearch} onStationSelected={station=> this.stationSelected(station)}>Search content</RadioSearch> }

    changeTab(tab:Tab, userSelect=true)  {
        this.setState({
            selectedTab: tab.title
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

    render() {
        const tabs = this.tabs
        const selectedTabName = this.state.selectedTab
        const selectedTab = tabs.find(tab => tab.title === selectedTabName) || this.searchTab
        
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
            <div className="radio-App flexible vertical">
                <div className="header flexible horizontal">
                    <img className="logo" src="webradio/logo.svg"></img>
                    {/*todo: here should be a choice depending on search screen activated or not*/}
                    <span className={`currently-playing ${searchSelected ? "hidden" : "visible"}`}>
                        {radioPlayer.station?.name}
                    </span>
                    <input className={`search flex1 ${searchSelected ? "visible" : "hidden"}`} 
                           defaultValue={currentSearch.searchText} 
                           onInput={ (e) => { this.searchTextChanged(e) } }>
                    </input>
                </div>
                <div className="tabs flexible horizontal">
                    {tabTitles}
                    <span className="flex1"></span>
                    <a className="search-tab" onClick={e=> this.changeTab(this.searchTab)}>
                        <img className="icon search" src="webradio/icons/search.svg"></img>
                    </a>
                </div>
                {tabContent}
            </div>
        )
    }
}
