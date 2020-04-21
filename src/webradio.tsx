import React from 'react';
import RadioSearch from './components/search'
import RadioPlayer from './components/player'
import { Station } from './functions/radioSearch';

interface RadioState {
    selectedTab:string
    selectedStation:Station|undefined
}

interface Tab {
    title: string
    content: JSX.Element
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
            { title: "Search", content: <RadioSearch onStationSelected={station=> this.stationSelected(station)}>Search content</RadioSearch> },
            { title: "Favorites", content: <div>My favorites</div> },
            { title: "Play", content: <RadioPlayer station={this.state.selectedStation}></RadioPlayer> },
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

        return (
            <div className="radio-App">
                <div className="tabs">{headerContent}</div>
                {selectedTab?.content}
            </div>
        )
    }
}
