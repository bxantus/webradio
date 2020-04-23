import React from 'react';
import RadioSearch from './components/search'
import RadioPlayer from './components/player'
import { Station } from './functions/radioSearch';
import About from './components/about';

interface RadioState {
    selectedTab:string
    selectedStation:Station|undefined
}

interface Tab {
    title: string
    content: (cls:string) => JSX.Element
}

export default class WebradioApp extends React.Component<{}, RadioState> {
    state:RadioState = {
        selectedTab: "Search",
        selectedStation: {
            id: 1,
            name: "X-id",
            tags: "alternative, rock",
            country: "iceland",
            language: "",
            icon: ""
        }
    }

    get tabs() {
        return [
            { title: "Search", content: (cls:string) => <RadioSearch className={cls} onStationSelected={station=> this.stationSelected(station)}>Search content</RadioSearch> },
            { title: "Favorites", content: (cls:string) => <div className={cls}>My favorites</div> },
            { title: "Play", content: (cls:string) => <RadioPlayer className={cls} station={this.state.selectedStation}></RadioPlayer> },
            { title: "About", content: (cls:string) => <About className={cls} ></About>}
        ]
    }

    changeTab(tab:Tab)  {
        this.setState({
            selectedTab: tab.title
        })
    }

    stationSelected(station:Station) {
        this.setState({
            selectedStation: station
        })
        this.changeTab(this.tabs[2])  
    }

    render() {
        const tabs = this.tabs
        const selectedTabName = this.state.selectedTab
        const selectedTab = tabs.find(tab => tab.title === selectedTabName)
        const headerContent = tabs.map(tab => <span className={tab === selectedTab ? "tab selected" : "tab"}
                                                    key={tab.title} onClick={e=>this.changeTab(tab)} >{tab.title}</span> )
        const tabElements = tabs.map(tab => tab.content(tab == selectedTab ? "visible" : "hidden"))
        
        return (
            <div className="radio-App flexible vertical">
                <div className="tabs">{headerContent}</div>
                {tabElements}
            </div>
        )
    }
}
