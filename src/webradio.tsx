import React from 'react';
import RadioSearch from './components/search'
import RadioPlayerUI, { radioPlayer } from './components/player'
import { Station } from './functions/radioApi';
import About from './components/about';
import StationList from './components/stationList';
import { favorites } from './functions/favorites';
import { getLastPlayedStation } from './functions/lastPlayed';

interface RadioState {
    selectedTab:string
    selectedStation?:Station
}

interface Tab {
    title: string
    content: (cls:string) => JSX.Element
}

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
            //{ title: "Search", content: (cls:string) => <RadioSearch className={cls} onStationSelected={station=> this.stationSelected(station)}>Search content</RadioSearch> },
        ]
    }

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
        this.changeTab(this.tabs[2], /*userSelect*/false)  
    }

    render() {
        const tabs = this.tabs
        const selectedTabName = this.state.selectedTab
        const selectedTab = tabs.find(tab => tab.title === selectedTabName)
        const headerContent = tabs.map(tab => {
                    let selection = (selectedTab == tab) ? <span className="selection"></span> : undefined
                    return <div className="tab flexible vertical"
                               key={tab.title} onClick={e=>this.changeTab(tab)} >
                                    <span className="title">{tab.title}</span>
                                    {selection}
                           </div> 
        })
        const tabElements = tabs.map(tab => tab.content(tab == selectedTab ? "visible" : "hidden"))
        
        return (
            <div className="radio-App flexible vertical">
                <div className="header flexible horizontal">
                    <img className="logo" src="webradio/logo.svg"></img>
                    {/*todo: here should be a choice depending on search screen activated or not*/}
                    <span className="currently-playing">{radioPlayer.station?.name}</span>
                </div>
                <div className="tabs flexible horizontal">{headerContent}</div>
                {tabElements}
            </div>
        )
    }
}
