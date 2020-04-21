import React from 'react';
import { RadioSearch, Station } from '../functions/radioSearch';
import StationList from './stationList';

interface SearchState {
    search: RadioSearch|undefined
}

interface SearchProps {
    onStationSelected?:(station:Station)=> any
}

let currentSearch:RadioSearch|undefined // only one search active at a time

export default class Search extends React.Component<SearchProps, SearchState> {
    constructor(props) {
        super(props)
        this.state = {
            search: currentSearch
        }
    }

    async searchTextChanged(e) {
        const query = e.target.value;
        this.scheduleSearch(query)
    }

    private searchTimer
    async scheduleSearch(query:string) {
        this.searchTimer = clearTimeout(this.searchTimer)
        this.searchTimer = setTimeout(async () => {
            let search = new RadioSearch({name: query})
            currentSearch = search
            await search.search()
            this.setState({
                search
            })
        }, 400)
    }

    render() {
        const radioSearch = this.state.search; 
        let results:Station[]|undefined 
        if (radioSearch) {
            results = radioSearch.results
        }
        return (
            <div className="search">
                <input defaultValue={radioSearch ? radioSearch.query.name : ""} 
                      onInput={ (e) => { this.searchTextChanged(e) } }></input>
                <div className="results" >
                    Search results
                    <StationList stations={results} onStationSelected={this.props?.onStationSelected}></StationList>
                </div>  
            </div>
        )
    }
}