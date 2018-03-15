import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface IStationListProps {}
export interface IStationListState {
    initialPosition: string;
    lastPosition: string;
}

export class StationList extends React.Component<IStationListProps, IStationListState> {
    private intervalId: number;

    public state = {
        initialPosition: "unknown",
        lastPosition: "unknown",
    };

    render() {
        return (
            <View>
                <Text>
                    <Text style={styles.title}>Initial position: </Text>
                    {this.state.initialPosition}
                </Text>
                <Text>
                    <Text style={styles.title}>Current position: </Text>
                    {this.state.lastPosition}
                </Text>
            </View>
        );
    }

    componentDidMount() {
        this.intervalId = setInterval(() => {
            console.log("fetching thing");
        }, 5000);
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: "500",
    },
});
