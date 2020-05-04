import React from 'react';
import { RadioSearch, Station } from '../functions/radioSearch';
import StationList from './stationList';

interface SearchState {
    search: RadioSearch|undefined
    searching:boolean
}

interface SearchProps {
    onStationSelected?:(station:Station)=> any
    className?: string
}

let currentSearch:RadioSearch|undefined // only one search active at a time

export default class Search extends React.Component<SearchProps, SearchState> {
    constructor(props) {
        super(props)
        this.state = {
            search: currentSearch,
            searching: false
        }
        this.searchList = React.createRef<HTMLDivElement>()
    }

    async searchTextChanged(e) {
        const query = e.target.value;
        this.scheduleSearch(query)
    }

    private searchTimer
    private searchList:React.RefObject<HTMLDivElement>

    async scheduleSearch(query:string) {
        this.searchTimer = clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(async () => {
            let search = new RadioSearch({name: query})
            currentSearch = search
            this.setState({searching: true})
            await search.search()
            // reset scroll
            if (this.searchList.current) this.searchList.current.scrollTop = 0
            this.setState({
                search,
                searching: false
            })
        }, 400)
    }

    render() {
        const radioSearch = this.state.search; 
        let results:Station[]|undefined 
        if (radioSearch) {
            results = radioSearch.results
        }
        let searching = this.state.searching ? <span className="loading">Searching...</span> : undefined
        return (
            <div className={"search flexible vertical " + (this.props.className ?? "")}>
                <div className="flexible horizontal">
                    <input className="flex1" defaultValue={radioSearch ? radioSearch.query.name : ""} 
                      onInput={ (e) => { this.searchTextChanged(e) } }></input>
                    {searching}
                </div>
                
                <div ref={this.searchList} className="results scrollable">
                    <StationList stations={results} onStationSelected={this.props?.onStationSelected}></StationList>
                </div>
                
            </div>
        )
    }
}