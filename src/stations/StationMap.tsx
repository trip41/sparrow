import * as React from "react";
import { ActivityIndicator, StyleSheet, Text, View, ViewStyle } from "react-native";
import MapView, { LatLng, Marker } from "react-native-maps";
import { DEFAULT_MAP_DELTA } from "../constants";
import { IBikeNearbyStation, STATION_TYPE } from "../types";
import { StationMarker } from "./StationMarker";

export interface IStationMapProps {
    initialLocation: LatLng;
    stations: IBikeNearbyStation[];
    markedLocation?: {
        name: string;
        coordinate: LatLng;
    };
    viewStyles?: ViewStyle;
    showsUserLocation?: boolean;
    type: STATION_TYPE;
}

export interface IStationMapState {}

export class StationMap extends React.Component<IStationMapProps, IStationMapState> {
    public mapRef: any;

    public render() {
        const { initialLocation, viewStyles, markedLocation, stations, showsUserLocation, type } = this.props;

        if (initialLocation && initialLocation.latitude && initialLocation.longitude) {
            return (
                <MapView
                    ref={(ref) => { this.mapRef = ref; }}
                    style={viewStyles}
                    initialRegion={initialLocation ? {...initialLocation, ...DEFAULT_MAP_DELTA} : undefined}
                    showsUserLocation={showsUserLocation}
                    showsMyLocationButton={showsUserLocation}
                >
                    {markedLocation && <Marker
                        coordinate={markedLocation.coordinate}
                        title={markedLocation.name}
                    />}
                    {stations.map((station, index) => (
                        <StationMarker key={station.id} station={station} index={index} type={type} />
                    ))}
                </MapView>
            );
        } else {
            return (
                <View style={[styles.placeholder, viewStyles]}>
                    <ActivityIndicator style={styles.placeholderActivity} size="large" color="#8A9BA8" />
                    <Text style={styles.placeholderText}>Getting current location...</Text>
                </View>
            );
        }

    }
}

const styles = StyleSheet.create({
    placeholder: {
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#F5F8FA",
    },
    placeholderActivity: {
        marginBottom: 10,
    },
    placeholderText: {
        opacity: 0.5,
    },
});
