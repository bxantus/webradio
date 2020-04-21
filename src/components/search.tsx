import React from 'react';
import { RadioSearch } from '../functions/radioSearch';

interface SearchState {
    search: RadioSearch|undefined
}

let currentSearch:RadioSearch|undefined // only one search active at a time

export default class Search extends React.Component<{}, SearchState> {
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
        let results:JSX.Element[] = []
        if (radioSearch) {
            results = radioSearch.results.map(station => <div>
                                                 <h3>{station.name}</h3>
                                                 <div>{station.country}</div>
                                                 <hr></hr>
                                               </div> )
        }
        return (
            <div className="search">
                <input defaultValue={radioSearch ? radioSearch.query.name : ""} 
                      onInput={ (e) => { this.searchTextChanged(e) } }></input>
                <div className="results" >
                    Search results {/* todo: replace with StationList  */}
                    {results}
                </div>  
            </div>
        )
    }
}