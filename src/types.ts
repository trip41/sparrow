export type STATION_TYPE = "bikes" | "docks";
export const STATION_TYPE = {
    BIKES: "bikes" as "bikes",
    DOCKS: "docks" as "docks",
};

export interface ILatLong {
    latitude: number;
    longitude: number;
}

export interface IGooglePlaceMatch {
    key?: string;
    id: string;
    place_id: string;
    description: string;
    matched_substrings: any[];
    reference: string;
    structured_formatting: {
        main_text: string;
        main_text_matched_substrings: any[];
        secondary_text: string;
    };
    terms: any[];
    types: string[];
}

export interface IGooglePlaceDetails {
    addressComponents: {
        long_name: string;
        short_name: string;
        types: string[];
    };
    adr_address: string;
    geometry: {
        location: {
            latitude: number;
            longitude: number;
        };
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    icon: string;
    id: string;
    international_phone_number: string;
    name: string;
    placeid: string;
    rating: number;
    reference: string;
    reviews: any[];
    scope: string;
    types: string[];
    url: string;
    url_offset: number;
    vicinity: string;
    website: string;
}

export interface IBikeStationInfo {
    station_id: string;
    name: string;
    short_name: string;
    lat: number;
    lon: number;
    region_id: number;
    rental_methods: string[];
    capacity: number;
    eightd_has_key_dispenser: boolean;
}

export interface IBikeStationStatus {
    station_id: string;
    num_bikes_available: number;
    num_ebikes_available: number;
    num_bikes_disabled: number;
    num_docks_available: number;
    num_docks_disabled: number;
    is_installed: number;
    is_renting: number;
    is_returning: number;
    last_reported: number;
    eightd_has_key_dispenser: boolean;
}

export interface IBikeStationResolved {
    id: string;
    information: IBikeStationInfo;
    status: IBikeStationStatus;
}

export interface IBikeNearbyStation {
    id: string;
    key: string;
    distance: number;
    information: IBikeStationInfo;
    status?: IBikeStationStatus;
}
