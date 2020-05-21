import { Station } from "./radioApi";

export type UpdateCallback = () => any

// uses localStorage to keep a list of favorite stations
class Favorites {
    private stations:Station[] = []
    
    add(station:Station) {
        if (!this.isFavorite(station)) {
            this.stations.push(station)
            this.save()
        }
    }

    remove(station:Station) {
        const idx = this.stations.findIndex(val => val.id == station.id)
        if (idx >= 0) {
            this.stations.splice(idx, 1)
            this.save()
        }
    }

    isFavorite(station:Station):boolean {
        const stat = this.stations.find(val => val.id == station.id)
        return stat != undefined
    }

    get list() {
        return this.stations
    }

    private save() { // save to local storage
        localStorage.setItem("stations", JSON.stringify(this.stations))
        this.changed()
    }

    load() { // load from local storage
        let stats = localStorage.getItem("stations")
        if (stats) {
            this.stations = JSON.parse(stats)
            this.changed()
        }
    }
    
    private updateCbs:UpdateCallback[] = []
    onUpdated(ucb:UpdateCallback):UpdateCallback {
        this.updateCbs.push(ucb)
        return ucb
    }

    private changed() {
        for (const cb of this.updateCbs)
            cb()
    }
}

export const favorites = new Favorites()