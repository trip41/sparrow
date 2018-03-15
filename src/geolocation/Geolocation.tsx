import * as React from "react";
import { StyleSheet, Text, View } from "react-native";

export interface IGeolocationProps {}
export interface IGeolocationState {
    initialPosition: string;
    lastPosition: string;
}

export class Geolocation extends React.Component<IGeolocationProps, IGeolocationState> {
    private watchID: number;

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
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const initialPosition = JSON.stringify(position);
                this.setState({initialPosition});
            },
            (error) => alert(JSON.stringify(error)),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 500},
        );
        this.watchID = navigator.geolocation.watchPosition((position) => {
            const lastPosition = JSON.stringify(position);
            this.setState({lastPosition});
        },
        (error) => alert(JSON.stringify(error)),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 500 });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }
}

const styles = StyleSheet.create({
    title: {
        fontWeight: "500",
    },
});
