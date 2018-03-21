import numeral from "numeral";
import { GeolocationReturnType } from "react-native";
import { ILatLong } from "./types";

export function formatNumber(num: number, format: string): string {
    return numeral(num).format(format);
}

export function formatAsImperial(meters: number): string {
    const miles = meters * (1 / 1609.344);

    return miles < 0.12
        ? `${formatNumber(miles * 5280, "0,0")}ft`
        : `${formatNumber(miles, "0,0.1")}mi`;
}

export function placeLatLon(placeDetails: any): ILatLong {
    return placeDetails ? {
        latitude: placeDetails.geometry.location.lat,
        longitude: placeDetails.geometry.location.lng,
    } : undefined;
}

export function positionLatLon(position: GeolocationReturnType): ILatLong {
    return position ? {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    } : undefined;
}

export function locationStringFromLatLon(position: ILatLong): string {
    return position
        ? `${position.latitude},${position.longitude}`
        : "";
}

export function colorForCount(count: number): string {
    if (count === 0) {
        return "#DB3737";
    } else if (count < 5) {
        return "#D9822B";
    } else {
        return "#29A634";
    }
}
