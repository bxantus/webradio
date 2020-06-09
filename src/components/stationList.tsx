import React from "react"
import { Station } from "../functions/radioApi";

interface StationsProps {
    stations?: Station[]
    onStationSelected?: (station:Station) => any
}

// tags are retrieved in a format split by commas, but no preceding space
function formatTags(tags:string) {
    return tags.replace(/,(?=[^\s])/g, ", ")
}

function formatCountry(country:string) {
    return country.length > 0 ? country : "Unknown"
}

export default class StationList extends React.Component<StationsProps, {}> {
    render() {
        const stations = this.props.stations;
        if (stations) {
            let results = stations.map(station => 
                <div className="clickable station" onClick={ () => this.props?.onStationSelected?.(station) } key={station.id}>
                    <h3>{station.name}</h3>
                    <div className="tags">{formatTags(station.tags)}</div>
                    <div className="flexible horizontal details">
                        <span className="country">{formatCountry(station.country)}</span>
                        <img className="votes" src="webradio/icons/votes.svg"></img>
                        <span className="flex1">{station.votes}</span>
                        <span className="codec">{station.codec} - {station.bitrate} kbps</span>
                    </div>
                    <hr></hr>
                </div> )
            return results
        } else return null
    }
}