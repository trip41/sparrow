import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import { IBikeNearbyStation, STATION_TYPE } from "../types";
import { colorForCount } from "../utils";

export interface IStationMarkerProps {
    station: IBikeNearbyStation;
    index: number;
    type: STATION_TYPE;
}

export interface IStationMarkerState {}

export class StationMarker extends React.PureComponent<IStationMarkerProps, IStationMarkerState> {
    public render() {
        const { index, station, type } = this.props;

        return (
            <Marker
                key={station.id}
                coordinate={{
                    latitude: station.information.lat,
                    longitude: station.information.lon,
                }}
                title={station.information.name}
                description={`${station.status.num_bikes_available} bikes, ${station.status.num_docks_available} docks`}
                centerOffset={{x: 0, y: -15}}
            >
                <View style={[styles.markerPin, { backgroundColor: colorForCount(station.status[`num_${type}_available`]) }]}>
                    <View style={styles.markerDot}/>
                    <View style={styles.markerLabel}>
                        <Text
                            style={[
                                styles.markerLabelText,
                                { color: colorForCount(station.status[`num_${type}_available`]) },
                            ]}
                        >
                            {index + 1}
                        </Text>
                    </View>
                </View>
            </Marker>
        );
    }
}

const styles = StyleSheet.create({
    markerPin: {
        width: 30,
        height: 30,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
        borderBottomLeftRadius: 0,
        backgroundColor: "#89849b",
        transform: [{ rotate: "-45deg" }],
        marginTop: -15,
        opacity: 0.85,
    },
    markerDot: {
        width: 18,
        height: 18,
        marginTop: 6,
        marginLeft: 6,
        backgroundColor: "rgba(255,255,255,0.5)",
        position: "absolute",
        borderRadius: 9,
    },
    markerLabel: {
        position: "absolute",
        left: "50%",
        top: "50%",
        marginLeft: -9,
        marginTop: -7.2,
        backgroundColor: "transparent",
        width: 18,
    },
    markerLabelText: {
        fontFamily: "Menlo-Bold",
        fontWeight: "700",
        color: "#89849b",
        fontSize: 12,
        textAlign: "center",
        width: 18,
        transform: [{ rotate: "45deg" }],
    },
});
