import React from "react"
import { Station } from "../functions/radioSearch"
import RadioPlayer, {StatusCallback} from "../functions/radioPlayer"

export let radioPlayer = new RadioPlayer()

interface PlayerProps {
    station:Station|undefined
    className:string
}

interface PlayerState {
    status: string
    detail?: string 
}

export default class Player extends React.Component<PlayerProps, PlayerState> {
    state:PlayerState = {
        status : "stop",
        
    }

    private statusChangeId:StatusCallback|undefined
    componentDidMount() {
        this.statusChangeId = radioPlayer.onStatusChanged((status, detail) => {
            if (radioPlayer.station && this.props.station?.id == radioPlayer.station.id) // only change state, if we display details for the station playing
                this.setState({
                    status,
                    detail
                })
        })
    }

    componentWillUnmount() {
        if (this.statusChangeId)
            radioPlayer.offStatusChanged(this.statusChangeId)
    }

    async togglePlayback() {
        if (!this.props.station)
            return
        const stat = this.getPlayStatus()
        if (stat != "play") {
            if (radioPlayer.station?.id != this.props.station.id)
                await radioPlayer.setStation(this.props.station)
            radioPlayer.play()
        } else {
            radioPlayer.pause()
        }
    }

    getPlayStatus() {
        let status = this.state.status // this can contain the last status updated by the player
        if (this.props.station && this.props.station.id != radioPlayer.station?.id) {
            status = "stop" // this stream hasn't been started
        }
        return status
    }

    render() {
        const station = this.props.station;
        if (!station) return null
        let status = this.getPlayStatus()
        
        const buttonTextByStatus = {
            play: "Stop",
            stop: "Play",
            load: "Loading",
            error: `Error ${this.state.detail ?? ""}`
        }
        let playButtonText = buttonTextByStatus[status] ?? "Error"
        let detailText:JSX.Element | undefined
        if (this.state.detail) {
        detailText = <span>{this.state.detail}</span>
        }

        return <div className={this.props.className}>
                    <h2>{station.name}</h2>
                    <p>in: {station.country}</p>
                    <p>tags: {station.tags}</p>
                    <div>
                        <button onClick={e => this.togglePlayback()} >{playButtonText}</button> {/* toggle pause */}
                        {detailText}
                    </div>
                    <div>
                        <button>Add to favorites</button>
                        <button>Vote!</button>
                    </div>
               </div>
    }
}