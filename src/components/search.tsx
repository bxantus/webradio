import React from 'react';
import { SearchResults, Station } from '../functions/radioApi';
import SearchModel from '../functions/searchModel'
import StationList from './stationList';

interface SearchState {
    results: SearchResults | undefined
    searching:boolean
}

interface SearchProps {
    onStationSelected?:(station:Station)=> any
    className?: string
    search:SearchModel
}

export default class Search extends React.Component<SearchProps, SearchState> {
    constructor(props) {
        super(props)
        this.state = {
            results: undefined, // todo: get current results from SearchModel
            searching: false
        }
    }

    componentWillMount() {
        const search = this.props.search
        search.subscribe("searching", (searching:boolean)=> {
            this.setState({searching: searching})
        })
        search.subscribe("results", (res:SearchResults)=> {
            this.setState({results: res})
        })
        search.subscribe("query", ()=> {
            if (document.scrollingElement)
                document.scrollingElement.scrollTop = 0
        })
    }

    render() {
        const results = this.state.results
        
        const errorBox = <div className="error-popup flexible horizontal" >
                              <img src="/webradio/icons/info.svg"></img>
                              <span className="flex1">{results?.error}</span>
                         </div>
        
        // NOTE: based on `this.state.searching` we could present some searching progress
        
        return (
            <div className={"search flexible vertical " + (this.props.className ?? "")}>
                {results?.error 
                    ?  errorBox
                    : <div className="results">
                        <StationList stations={results?.stations} 
                                    onStationSelected={this.props?.onStationSelected} 
                                    emptyText={this.state.searching ? "" : "No results"}>
                        </StationList>
                    </div>
                }
            </div>
        )
    }
}