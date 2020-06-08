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
    search:SearchModel
}

export default class Search extends React.Component<SearchProps, SearchState> {
    constructor(props) {
        super(props)
        this.state = {
            results: undefined, // todo: get current results from SearchModel
            searching: false
        }
        this.searchList = React.createRef<HTMLDivElement>()
    }

    componentWillMount() {
        const search = this.props.search
        search.subscribe("searching", (searching:boolean)=> {
            this.setState({searching: searching})
        })
        search.subscribe("results", (res:Station[])=> {
            this.setState({results: res})
        })
        search.subscribe("query", ()=> {
            if (this.searchList.current) this.searchList.current.scrollTop = 0
        })
    }

    private searchList:React.RefObject<HTMLDivElement>

    render() {
        const results = this.state.results
        
        // NOTE: based on `this.state.searching` we could present some searching progress
        
        return (
            <div className={"search flexible vertical " + (this.props.className ?? "")}>
                
                <div ref={this.searchList} className="results scrollable">
                    <StationList stations={results} onStationSelected={this.props?.onStationSelected}></StationList>
                </div>
                
            </div>
        )
    }
}