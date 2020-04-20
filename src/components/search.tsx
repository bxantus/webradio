import React from 'react';
import { RadioSearch } from '../functions/radioSearch';

interface SearchState {
    search: RadioSearch|undefined
}

export default class Search extends React.Component<{}, SearchState> {
    constructor(props) {
        super(props)
        this.state = {
            search: undefined
        }
    }

    async searchTextChanged(e) {
        const query = e.target.value;
        console.log("Search: ", query)
        
    }

    private searchTimer
    async scheduleSearch(query:string) {
        this.searchTimer = setInterval(async ()=> {
            let search = new RadioSearch({name: query})
            await search.search()
            this.setState({
                search
            })
        })
    }

    render() {
        return (
            <div className="search">
                <input defaultValue="" onInput={ (e) => { this.searchTextChanged(e) } }></input>
                <div className="results" >
                    Search results {/* todo: replace with StationList  */}
                </div>  
            </div>
        )
    }
}