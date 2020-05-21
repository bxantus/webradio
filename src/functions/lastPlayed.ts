import { Station, needsUpgrade, upgradeStation } from "./radioApi";

export async function getLastPlayedStation():Promise<Station | undefined> {
    const stat = localStorage.getItem("lastPlayed")
    if (stat) {
        let station:Station = JSON.parse(stat)
        if (needsUpgrade(station))
            await upgradeStation(station)
        return station
    }
}

export function saveLastPlayedStation(station:Station) {
    localStorage.setItem("lastPlayed", JSON.stringify(station))
}