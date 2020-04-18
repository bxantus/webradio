import React from 'react';
import RadioSearch from './components/search'

interface RadioState {
    selectedTab:string
}

interface Tab {
    title: string
    content: JSX.Element
}

export default class WebradioApp extends React.Component<{}, RadioState> {
    state:RadioState = {
        selectedTab: "Search"
    }

    get tabs() {
        return [
            { title: "Search", content: <RadioSearch>Search content</RadioSearch> },
            { title: "Favorites", content: <div>My favorites</div> },
            { title: "Play", content: <div>Play Z station</div> },
        ]
    }

    changeTab(tab:Tab, e)  {
        this.setState({
            selectedTab: tab.title
        })
    }

    render() {
        const tabs = this.tabs
        const selectedTabName = this.state.selectedTab
        const selectedTab = tabs.find(tab => tab.title === selectedTabName)
        const headerContent = tabs.map(tab => <span className={tab === selectedTab ? "tab selected" : "tab"} 
                                                    key={tab.title} onClick={e=>this.changeTab(tab,e)} >{tab.title}</span> )

        return (
            <div className="radio-App">
                <div className="tabs">{headerContent}</div>
                {selectedTab?.content}
            </div>
        )
    }
}
