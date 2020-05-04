import React from "react"
import { Station } from "../functions/radioSearch";

interface StationsProps {
    stations?: Station[]
    onStationSelected?: (station:Station) => any
}

export default class StationList extends React.Component<StationsProps, {}> {
    render() {
        const stations = this.props.stations;
        if (stations) {
            let results = stations.map(station => 
                                               <div onClick={ () => this.props?.onStationSelected?.(station) } key={station.id}>
                                                 <div className="flexible horizontal station-header">
                                                    <h3>{station.name}</h3>
                                                    <span>{station.votes}</span>
                                                 </div>
                                                 <div>{station.tags}</div>
                                                 <div>{station.country}</div>
                                                 <hr></hr>
                                               </div> )
            return results
        } else return null
    }
}