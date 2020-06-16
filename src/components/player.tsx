import React from "react"
import { Station, voteForStation, refreshStation } from "../functions/radioApi"
import RadioPlayer, {StatusCallback, LoadError} from "../functions/radioPlayer"
import { favorites } from "../functions/favorites"
import { Slider } from "./slider"
import { RangeModel } from "../models/range"

export let radioPlayer = new RadioPlayer()

interface PlayerProps {
    station:Station|undefined
    className:string
}

interface PlayerState {
    status: string
    detail?: string 
    voting: boolean
}

export default class Player extends React.Component<PlayerProps, PlayerState> {
    state:PlayerState = {
        status : "stop",
        voting: false
    }

    private statusChangeId:StatusCallback|undefined
    private volume = new RangeModel()
    componentDidMount() {
        this.statusChangeId = radioPlayer.onStatusChanged((status, detail) => {
            if (radioPlayer.station && this.props.station?.id == radioPlayer.station.id) // only change state, if we display details for the station playing
                this.setState({
                    status,
                    detail
                })
        });

        this.volume.val = 75; // // todo: should use persisted value and set to radio player
        this.volume.subscribe("value", vol => radioPlayer.volume = vol)
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
            try {
                this.setState({status:"load", detail: undefined})
                if (radioPlayer.station?.id != this.props.station.id)
                    await radioPlayer.setStation(this.props.station)
                radioPlayer.play()
            } catch (loadErr) {
                if (!(loadErr instanceof LoadError)) // no playback when loading fails. status change takes care of notifying the user
                    throw loadErr
            }
        } else {
            radioPlayer.stop()
        }
    }

    getPlayStatus() {
        let status = this.state.status // this can contain the last status updated by the player
        if (this.props.station && this.props.station.id != radioPlayer.station?.id) {
            status = "stop" // this stream hasn't been started
        }
        return status
    }

    getPlayDetail() {
        if (this.props.station && this.props.station.id != radioPlayer.station?.id) 
            return undefined
        else return this.state.detail
    }

    toggleFavorite() {
        const station = this.props.station;
        if (station) {
            if (favorites.isFavorite(station)) favorites.remove(station)
            else favorites.add(station)
            this.setState({}) // needs update
        }
    }

    async vote() {
        if (!this.props.station) return
        this.setState({voting: true})
        const succ = await voteForStation(this.props.station)
        
        const refreshed = await refreshStation(this.props.station)
        if (refreshed) {
            this.props.station.votes = refreshed.votes
        }
        
        this.setState({voting: false}) 
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
        const detail = this.getPlayDetail()
        if (detail) {
            detailText = <span>{detail}</span>
        }

        const isFavorite = favorites.isFavorite(station)
        const favoriteHeader = isFavorite
                                    ? (<span>
                                          <img className="small-ico like" src="webradio/icons/like.svg"></img>
                                          Favorite
                                       </span>
                                      )
                                    : undefined;

        return <div className={this.props.className + " flexible vertical"}>
                    <div className="player-header flexible horizontal">
                        <span>{station.country}</span>
                        <span>
                            <img className="small-ico" src="webradio/icons/votes.svg"></img>
                            {station.votes}
                        </span>
                        {favoriteHeader}
                    </div>
                    <h2 className="title">{station.name}</h2>
                    <p className="tags">{station.tags}</p>
                    <button className="favorite-toggle" onClick={()=> this.toggleFavorite()} >
                        <img className="small-ico like" src={isFavorite ? "webradio/icons/unlike.svg" : "webradio/icons/like.svg"}></img>
                        {isFavorite ? "Remove Favorite" : "Add as Favorite"}
                    </button>
                    <div className="play-area">
                        <button className="play" onClick={e => this.togglePlayback()} >
                            <img className="play-ico" src="webradio/icons/play.svg"></img>
                        </button> 
                        {detailText}
                    </div>
                    <div className="flexible horizontal play-footer">
                        <span className="flex1">{station.codec} - {station.bitrate} kbps</span>
                        <button className="vote" onClick={()=> this.vote() }disabled={this.state.voting} >
                            <img className="small-ico" src="webradio/icons/votes.svg"></img>
                            Vote
                        </button>
                    </div>
                    
                    <Slider model={this.volume} ></Slider>
               </div>
    }
}