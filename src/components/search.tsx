import React from 'react';
import { Station } from '../functions/radioApi';
import SearchModel from '../functions/searchModel'
import StationList from './stationList';

interface SearchState {
    results: Station[] | undefined
    searching:boolean
}

interface SearchProps {
    onStationSelected?:(station:Station)=> any
    className?: string
}

let currentSearch= new SearchModel

export default class Search extends React.Component<SearchProps, SearchState> {
    constructor(props) {
        super(props)
        this.state = {
            results: undefined,
            searching: false
        }
        this.searchList = React.createRef<HTMLDivElement>()
    }

    componentWillMount() {
        currentSearch.subscribe("searching", (searching:boolean)=> {
            this.setState({searching: searching})
        })
        currentSearch.subscribe("results", (res:Station[])=> {
            this.setState({results: res})
        })
        currentSearch.subscribe("query", ()=> {
            if (this.searchList.current) this.searchList.current.scrollTop = 0
        })
    }

    async searchTextChanged(e) {
        const query = e.target.value;
        currentSearch.scheduleSearch(query)
    }

    private searchList:React.RefObject<HTMLDivElement>

    render() {
        const results = this.state.results
        
        let searching = this.state.searching ? <span className="loading">Searching...</span> : undefined
        return (
            <div className={"search flexible vertical " + (this.props.className ?? "")}>
                <div className="flexible horizontal">
                    <input className="flex1" defaultValue={currentSearch.searchText} 
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