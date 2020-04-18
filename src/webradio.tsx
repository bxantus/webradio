import React from 'react';

interface RadioState {
    selectedTab:string
}

export default class WebradioApp extends React.Component<{}, RadioState> {
    constructor(params:any) {
        super(params)
        // todo: setup state when needed
    }

    get tabs() {
        return [
            { title: "Search", content: <div>Search content</div> },
            { title: "Favorites", content: <div>My favorites</div> },
            { title: "Play", content: <div>Play Z station</div> },
        ]
    }

    render() {
        const tabs = this.tabs
        const selectedTabName ="Search" //"Favorites"
        const selectedTab = tabs.find(tab => tab.title === selectedTabName)
        const headerContent = tabs.map(tab => <span className={tab === selectedTab ? "tab selected" : "tab"} key={tab.title} >{tab.title}</span> )

        return (
            <div className="radio-App">
                <div className="tabs">{headerContent}</div>
                {selectedTab?.content}
            </div>
        )
    }
}
