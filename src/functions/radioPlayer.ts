import { Howl } from "howler"
import { Station, getStreamUrl } from "./radioSearch"
import { saveLastPlayedStation } from "./lastPlayed"

export type StatusCallback = (status:string, detail?:string)=>any

export class LoadError extends Error{
    constructor(message:string) {
        super(message)
        this.name = "LoadError"
    }
}

export default class RadioPlayer {
    player:Howl|undefined
    station:Station|undefined
    private statusEmitter:StatusCallback[] = []
    private loading:Promise<void>|undefined

    async setStation(station:Station) {
        // stop old player
        if (this.player) {
            this.player.off() // remove old events, and stop
            this.player.stop()
            this.player.unload()
            this.player = undefined
        }
        this.fireStatusChange("load", "station")
        this.station = station
        
        saveLastPlayedStation(station)
        // will save loading promise, as users may use play while station url is loading
        // in these cases play should progress as well (see play)
        this.loading = this.loadPlayer(station)
        return this.loading
    }

    private async loadPlayer(station:Station) {
        // get station url ...
        let url = await getStreamUrl(station)
        this.loading = undefined
        if (!url) {
            this.fireStatusChange("error", "cannot resolve station url")
            throw new LoadError("cannot resolve station url")
        } 
        if (this.station?.id == station.id) { // haven't changed stations meanwhile
            if (this.player) {
                this.player.off()
                this.player.unload() // if somehow an old player gets stuck, unload it
            }
            this.player = new Howl({src: url, autoplay: false, html5: true, preload: false})
            this.fireStatusChange("stop")
            this.player.on('load', ()=> this.fireStatusChange("load", "start playing"))
            this.player.on('play', ()=> this.fireStatusChange("play") )
            this.player.on('stop', ()=> this.fireStatusChange("stop") )
            this.player.on('pause', ()=> this.fireStatusChange("stop") )

            // NOTE: howl will fire load errors for radio streams, without extension, if you call the `load()` method
            //       this is probably a bug? (as play will report no errors)
            this.player.on('loaderror', (_, error)=> this.fireStatusChange("error", "loading the stream failed: " + error))
            this.player.on('playerror', (_, error)=> this.fireStatusChange("error", "playback error: " + error))
        } else {
            throw new LoadError("changed stations while loading")
        }
    }

    async play() {
        try {
            if (this.loading)
                await this.loading
        } catch (err) {
            if (err instanceof LoadError)
                return; // can't play this stream
            else throw err // rethrow other errors
        }
        
        if (this.player && !this.player.playing()) {
            // when not loaded
            if (this.player.state() == "unloaded") {
                this.fireStatusChange("load", "stream")
                // no need to use `load`, see the loadError remark. play will load the stream
            }
            this.player.play()
        }
    }

    stop() {
        if (this.player) {
            this.player.stop()
            this.player.unload() // preserve battery
        }
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