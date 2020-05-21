import React from "react"
import { Station } from "../functions/radioApi";

interface StationsProps {
    stations?: Station[]
    onStationSelected?: (station:Station) => any
}

export default class StationList extends React.Component<StationsProps, {}> {
    render() {
        const stations = this.props.stations;
        if (stations) {
            let results = stations.map(station => 
                                               <div className="clickable" onClick={ () => this.props?.onStationSelected?.(station) } key={station.id}>
                                                 <div className="flexible horizontal station-header">
                                                    <h3>{station.name}</h3>
                                                    <span>{station.votes}</span>
                                                 </div>
                                                 <div>{station.tags}</div>
                                                 <div className="flexible horizontal">
                                                     <span className="flex1">{station.country}</span>
                                                     <span className="bold codec">{station.codec} </span>
                                                     <span>{station.bitrate} kbps</span>
                                                 </div>
                                                 <hr></hr>
                                               </div> )
            return results
        } else return null
    }
}