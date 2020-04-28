import { Station } from "./radioSearch";

export function getLastPlayedStation():Station | undefined {
    const stat = localStorage.getItem("lastPlayed")
    if (stat)
        return JSON.parse(stat) as Station
}

export function saveLastPlayedStation(station:Station) {
    localStorage.setItem("lastPlayed", JSON.stringify(station))
}