import moment from "moment";
import * as React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NavigationScreenProp } from "react-navigation";
import { DEFAULT_MAP_DELTA } from "../constants";
import { SearchInput } from "../search/SearchInput";
import { getNearbyStations, getStations } from "../services/BikeService";
import { StationList } from "../stations/StationList";
import { StationMap } from "../stations/StationMap";
import { IBikeNearbyStation, IBikeStationResolved, ILatLong, STATION_TYPE } from "../types";
import { positionLatLon } from "../utils";

export interface IOriginViewProps {
    navigation: NavigationScreenProp<any>;
}

export interface IOriginViewState {
    currentPosition?: ILatLong;
    stations?: IBikeStationResolved[];
    nearbyStations:  IBikeNearbyStation[];
    lastUpdated?: Date;
    refreshing: boolean;
}

export class OriginView extends React.PureComponent<IOriginViewProps, IOriginViewState> {
    private lastUpdatedIntervalId: number;
    private stationMapRef: any;

    public state: IOriginViewState = {
        currentPosition: undefined,
        stations: undefined,
        nearbyStations: [],
        lastUpdated: undefined,
        refreshing: false,
    };

    public render() {
        const { currentPosition } = this.state;

        return (
            <View style={styles.container}>
                <SearchInput
                    viewStyles={styles.searchInput}
                    position={currentPosition}
                    onSelectPlace={this.onSelectPlace}
                />
                <StationMap
                    ref={(ref) => { this.stationMapRef = ref; }}
                    viewStyles={styles.stationMap}
                    initialLocation={currentPosition}
                    showsUserLocation={true}
                    stations={this.state.nearbyStations}
                    type={STATION_TYPE.BIKES}
                />
                <StationList
                    viewStyles={styles.stationList}
                    nearbyStations={this.state.nearbyStations}
                    onSelect={this.onSelect}
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                />
            </View>
        );
    }

    public componentWillMount() {
        this.updatePositionAndStations();
    }

    public componentWillUnmount() {
        clearInterval(this.lastUpdatedIntervalId);
    }

    private onRefresh = () => {
        this.setState({ refreshing: true });
        this.updatePositionAndStations();
    }

    private onSelectPlace = (placeid: string, placeName: string) =>  {
        const { stations } = this.state;
        this.props.navigation.navigate("Destination", {
            placeName,
            placeid,
            stations,
        });
    }

    private onSelect = (_item: IBikeNearbyStation) => {
        // do something
    }

    private updatePositionAndStations = () => {
        navigator.geolocation.getCurrentPosition(
            this.onGetPositionSuccess,
            this.onGetPositionError,
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 500},
        );
    }

    private onGetPositionSuccess = (position) => {
        const currentPosition = positionLatLon(position);
        this.setState({ currentPosition });
        this.stationMapRef.mapRef.animateToRegion({...currentPosition, ...DEFAULT_MAP_DELTA});

        getStations().then((stations: IBikeStationResolved[]) => {
            const nearbyStations = getNearbyStations(currentPosition, stations, 10);
            this.setState({ stations, nearbyStations, refreshing: false, lastUpdated: new Date() });
            this.props.navigation.setParams({ lastUpdatedString: "Just now" });
            this.lastUpdatedIntervalId = setInterval(this.updateTimestamp, 5000);
        });
    }

    private onGetPositionError = (error) => {
        console.error(JSON.stringify(error));
    }

    private updateTimestamp = () => {
        this.props.navigation.setParams({ lastUpdatedString: moment(this.state.lastUpdated).fromNow() });
    }

    public static navigationOptions = (({ navigation }) => {
        const { params } = navigation.state;
        const lastUpdatedString = params ? params.lastUpdatedString : "Just now";

        return {
            title: "sparrow",
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
    },
    searchInput: {
        flexGrow: 1,
    },
    stationMap: {
        flexGrow: 1,
        borderColor: "#CED0CE",
        borderStyle: "solid",
        borderWidth: 1,
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
