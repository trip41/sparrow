import qs from "qs";
import { GOOGLE_API_KEY } from "../constants";
import { IGooglePlaceDetails, IGooglePlaceMatch } from "../types";

export function autocompletePlaces(params: any): Promise<IGooglePlaceMatch[]> {
    const queryString = qs.stringify({...params, ...{key: GOOGLE_API_KEY}});

    return fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${queryString}`)
        .then((response) => response.json())
        .then((responseJson) => responseJson.predictions)
        .catch((error) => {
            console.error(error);
        });
}

export function getPlaceDetails(placeid: string): Promise<IGooglePlaceDetails> {
    const queryString = qs.stringify({...{placeid}, ...{key: GOOGLE_API_KEY}});

    return fetch(`https://maps.googleapis.com/maps/api/place/details/json?${queryString}`)
        .then((response) => response.json())
        .then((responseJson) => responseJson.result)
        .catch((error) => {
            console.error(error);
        });
}
