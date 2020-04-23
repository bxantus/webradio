import { Howl } from "howler"
import { Station, getStreamUrl } from "./radioSearch"

export type StatusCallback = (status:string, detail?:string)=>any

export default class RadioPlayer {
    player:Howl|undefined
    station:Station|undefined
    private statusEmitter:StatusCallback[] = []

    async setStation(station:Station) {
        // stop old player
        if (this.player) {
            this.player.off(); // remove old events, and stop
            this.player.stop();
            this.player.unload();
        }
        this.fireStatusChange("load", "station")
        this.station = station
        // get station url ...
        let url:string|undefined = await getStreamUrl(station)
        if (!url) {
            this.fireStatusChange("error", "cannot resolve station url")
        } else {

            this.player = new Howl({src: url, autoplay: false, html5: true})
            this.fireStatusChange("load", "stream")
            this.player.on('load', ()=> this.fireStatusChange("load", "start playing"))
            this.player.on('play', ()=> this.fireStatusChange("play") )
            this.player.on('stop', ()=> this.fireStatusChange("stop") )
            this.player.on('pause', ()=> this.fireStatusChange("stop") )

            this.player.on('loaderror', ()=> this.fireStatusChange("error", "loading the stream failed"))
            this.player.on('playerror', ()=> this.fireStatusChange("error", "playback error"))
        }
    }

    play() {
        this?.player?.play()
    }

    pause() {
        this?.player?.pause()
    }

    private fireStatusChange(newStatus:string, detail?:string) {
        for (let cb of this.statusEmitter) {
            cb(newStatus, detail)
        }
    }

    onStatusChanged(cb: StatusCallback) {
        this.statusEmitter.push(cb)
        return cb
    }

    offStatusChanged(cb:StatusCallback) {
        const idx = this.statusEmitter.findIndex(val => cb == val)
        if (idx >= 0)
            this.statusEmitter.splice(idx, 1)
    }
}