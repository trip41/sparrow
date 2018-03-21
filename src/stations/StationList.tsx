import pluralize from "pluralize";
import * as React from "react";
import { FlatList, RefreshControl, StyleSheet, Text, TouchableHighlight, View, ViewStyle } from "react-native";
import { IBikeNearbyStation } from "../types";
import { formatAsImperial } from "../utils";

export interface IStationListProps {
    nearbyStations: IBikeNearbyStation[];
    viewStyles?: ViewStyle;
    refreshing: boolean;
    touchable?: boolean;
    onRefresh: () => void;
    onSelect: (item: IBikeNearbyStation) => void;
}

export interface IStationListState {}

export class StationList extends React.Component<IStationListProps, IStationListState> {
    public render() {
        const { nearbyStations, touchable, viewStyles, onSelect, onRefresh, refreshing } = this.props;

        return (
            <FlatList
                style={[styles.list, viewStyles]}
                data={nearbyStations}
                refreshControl={(
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                )}
                ItemSeparatorComponent={() => <View style={styles.listItemSeparator}/>}
                renderItem={({item, index}) => (
                    <TouchableHighlight
                        onPress={() => onSelect(item)}
                        underlayColor={touchable ? "rgba(81,82,81,0.1)" : "#FFFFFF"}
                    >
                        <View style={styles.listItem}>
                            <View style={styles.listItemPrimary}>
                                <Text style={styles.listItemName}>{index + 1}. {item.information.name}</Text>
                            </View>
                            <View style={styles.listItemSecondary}>
                                <Text style={styles.listItemCount}>{formatAsImperial(item.distance)}</Text>
                                <View style={styles.listItemCountSeparator}/>
                                <Text
                                    style={[
                                        styles.listItemCount,
                                        styles.success,
                                        item.status.num_bikes_available < 5 && styles.warning,
                                        item.status.num_bikes_available === 0 && styles.danger,
                                    ]}
                                >
                                    {pluralize("bike", item.status.num_bikes_available, true)}
                                </Text>
                                <View style={styles.listItemCountSeparator}/>
                                <Text
                                    style={[
                                        styles.listItemCount,
                                        styles.success,
                                        item.status.num_docks_available < 5 && styles.warning,
                                        item.status.num_docks_available === 0 && styles.danger,
                                    ]}
                                >
                                    {pluralize("dock", item.status.num_docks_available, true)}
                                </Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                )}
            />
        );
    }
}

const styles = StyleSheet.create({
    list: {
        backgroundColor: "#FFFFFF",
    },
    listItem: {
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    listItemSeparator: {
        height: 0.5,
        width: "100%",
        backgroundColor: "#CED0CE",
    },
    listItemPrimary: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 6,
    },
    listItemName: {
        fontSize: 18,
        fontWeight: "300",
        flexGrow: 1,
    },
    listItemDistance: {
        fontSize: 16,
        fontWeight: "600",
    },
    listItemSecondary: {
        display: "flex",
        flexDirection: "row",
        opacity: 0.7,
    },
    listItemCount: {
        fontSize: 14,
        borderRightWidth: 1,
        borderRightColor: "black",
        borderStyle: "solid",
        color: "#293742",
    },
    listItemCountSeparator: {
        marginHorizontal: 5,
        width: 1,
        backgroundColor: "#CED0CE",
    },
    success: {
        color: "#29A634",
    },
    warning: {
        color: "#D9822B",
    },
    danger: {
        color: "#DB3737",
    },
});
