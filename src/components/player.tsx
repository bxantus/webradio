import React from "react"
import { Station } from "../functions/radioSearch"

interface PlayerProps {
    station:Station|undefined
    className:string
}

export default class Player extends React.Component<PlayerProps, {}> {


    render() {
        const station = this.props.station;
        if (!station) return null
        return <div className={this.props.className}>
                    <h2>{station.name}</h2>
                    <p>in: {station.country}</p>
                    <p>tags: {station.tags}</p>
                    <div>
                        <button>Play</button> {/* toggle pause */}
                    </div>
                    <div>
                        <button>Add to favorites</button>
                        <button>Vote!</button>
                    </div>
               </div>
    }
}