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
            let results = stations.map(station => <div>
                                                 <h3>{station.name}</h3>
                                                 <div>{station.country}</div>
                                                 <hr></hr>
                                               </div> )
            return results
        } else return null
    }
}