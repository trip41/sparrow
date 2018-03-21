import moment from "moment";
import * as React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { getNearbyStations, getStations } from "../services/BikeService";
import { getPlaceDetails } from "../services/GooglePlacesService";
import { StationList } from "../stations/StationList";
import { StationMap } from "../stations/StationMap";
import { IBikeNearbyStation, IBikeStationResolved, STATION_TYPE } from "../types";
import { placeLatLon } from "../utils";

export interface IDestinationViewProps {
    navigation: NavigationScreenProp<any>;
    screenProps: any;
}

export interface IDestinationViewState {
    nearbyStations: IBikeNearbyStation[];
    placeDetails?: any;
    refreshing: boolean;
    lastUpdated?: Date;
}

export class DestinationView extends React.PureComponent<IDestinationViewProps, IDestinationViewState> {
    private lastUpdatedIntervalId: number;

    public state: IDestinationViewState = {
        nearbyStations: [],
        placeDetails: undefined,
        refreshing: false,
        lastUpdated: undefined,
    };

    public render() {
        if (this.state.placeDetails) {
            return (
                <View style={styles.container}>
                    <StationMap
                        viewStyles={styles.stationMap}
                        initialLocation={placeLatLon(this.state.placeDetails)}
                        markedLocation={{
                            name: this.state.placeDetails.name,
                            coordinate: placeLatLon(this.state.placeDetails),
                        }}
                        stations={this.state.nearbyStations}
                        type={STATION_TYPE.DOCKS}
                    />
                    <StationList
                        viewStyles={styles.stationList}
                        nearbyStations={this.state.nearbyStations}
                        onSelect={this.onSelect}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                        touchable={true}
                    />
                </View>
            );
        } else {
            return <View style={styles.container} />;
        }
    }

    public componentWillMount() {
        const { params } = this.props.navigation.state;
        const stations: IBikeStationResolved[] = params ? params.stations : undefined;
        const placeid = params ? params.placeid : undefined;

        getPlaceDetails(placeid).then((placeDetails) => {
            const location = placeLatLon(placeDetails);
            const nearbyStations = getNearbyStations(location, stations, 10);
            this.setState({ placeDetails, nearbyStations, lastUpdated: new Date() });
            this.props.navigation.setParams({ lastUpdatedString: "Just now" });
            this.lastUpdatedIntervalId = setInterval(this.updateTimestamp, 5000);
        });
    }

    public componentWillUnmount() {
        clearInterval(this.lastUpdatedIntervalId);
    }

    private updateTimestamp = () => {
        this.props.navigation.setParams({ lastUpdatedString: moment(this.state.lastUpdated).fromNow() });
    }

    private onRefresh = () => {
        const { placeDetails } = this.state;
        const location = placeLatLon(placeDetails);

        this.setState({ refreshing: true });
        getStations().then((stations: IBikeStationResolved[]) => {
            const nearbyStations = getNearbyStations(location, stations, 10);
            this.setState({ nearbyStations, refreshing: false, lastUpdated: new Date() });
            this.props.navigation.setParams({ lastUpdatedString: "Just now" });
        });
    }

    private onSelect = (item: any) => {
        const googleUrl = `https://www.google.com/maps/dir/?api=1&travelmode=bicycling&destination=${encodeURIComponent(item.information.name)}`;
        const appleUrl = `http://maps.apple.com/?daddr=${encodeURIComponent(item.information.name)}`;

        if (Linking.canOpenURL(googleUrl)) {
            Linking.openURL(googleUrl);
        } else {
            Linking.openURL(appleUrl);
        }
    }

    public static navigationOptions = (({ navigation }) => {
        const { params } = navigation.state;
        const placeName = params ? params.placeName : undefined;
        const lastUpdatedString = params ? params.lastUpdatedString : "Just now";

        return {
            title: placeName,
            headerBackTitle: "Back",
            headerRight: (
                <Text style={styles.lastUpdated}>{lastUpdatedString}</Text>
            ),
        };
    });
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    stationMap: {
        flexGrow: 1,
    },
    stationList: {
        flexGrow: 1,
    },
    lastUpdated: {
        opacity: 0.5,
        fontSize: 12,
        paddingRight: 10,
    },
});

moment.updateLocale("en", {
    relativeTime : {
        future: "%s",
        past:   "%s",
        s  : "Just now",
        ss : "Just now",
        m:  "1 min",
        mm: "%d mins",
        h:  "1 hr",
        hh: "%d hrs",
        d:  "1 day",
        dd: "%d days",
        M:  "1 mo",
        MM: "%d mos",
        y:  "1 yr",
        yy: "%d yrs",
    },
});
