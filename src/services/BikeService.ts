import geolib from "geolib";
import { IBikeNearbyStation, IBikeStationInfo, IBikeStationResolved, IBikeStationStatus, ILatLong } from "../types";

export function getStationStatus(): Promise<IBikeStationStatus[]> {
    return fetch("https://gbfs.citibikenyc.com/gbfs/en/station_status.json")
            .then((response) => response.json())
            .then((responseJson) => responseJson.data.stations)
            .catch((error) => {
                console.error(error);
            });
}

export function getStationInformation(): Promise<IBikeStationInfo[]> {
    return fetch("https://gbfs.citibikenyc.com/gbfs/en/station_information.json")
        .then((response) => response.json())
        .then((responseJson) => responseJson.data.stations)
        .catch((error) => {
            console.error(error);
        });
}

export function getStations(): Promise<IBikeStationResolved[]> {
    return Promise.all([getStationInformation(), getStationStatus()]).then((values) => {
        const stationInformation = values[0];
        const stationStatus = values[1];

        const statusMap = stationStatus.reduce((map, cur) => {
            map[cur.station_id] = cur;
            return map;
        }, {});

        return stationInformation.map((stationInfo) => ({
            id: stationInfo.station_id,
            information: stationInfo,
            status: statusMap[stationInfo.station_id],
        }));
    });
}

export function getNearbyStations(location: ILatLong, stations: IBikeStationResolved[], limit?: number): IBikeNearbyStation[] {
    const nearbyStations: IBikeNearbyStation[] = stations
        .map(station => ({
            id: station.id,
            key: station.id,
            distance:  geolib.getDistance(
                location,
                {
                    latitude: station.information.lat,
                    longitude: station.information.lon,
                },
                10,
                1,
            ),
            information: station.information,
            status: station.status,
        }))
        .sort((a, b) => a.distance - b.distance);

    return limit !== undefined
        ? nearbyStations.slice(0, limit)
        : nearbyStations;
}
