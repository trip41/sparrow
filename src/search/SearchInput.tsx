import * as React from "react";
import { StyleSheet, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const homePlaceLocation = "40.7266937,-73.9856429";

export interface ISearchInputProps {
    title: string;
    navigator: any;
}
export interface ISearchInputState {}

export class SearchInput extends React.Component<ISearchInputProps, ISearchInputState> {
    render() {
        return (
            <View style={styles.wrapper}>
                <GooglePlacesAutocomplete
                    placeholder="Where to..."
                    minLength={2}
                    autoFocus={false}
                    listViewDisplayed="auto"
                    fetchDetails={true}
                    renderDescription={(row) => row.description}
                    query={{
                        key: "AIzaSyA-Il-CIUityDU_-tlRGfMDoFAHDORhTTs",
                        location: homePlaceLocation,
                        radius: 1000,
                        language: "en",
                    }}
                    nearbyPlacesAPI="GooglePlacesSearch"
                    GooglePlacesSearchQuery={{
                        rankby: "distance",
                        types: "food",
                    }}
                    debounce={200}
                    styles={{
                        container: {
                            flex: 1,
                            backgroundColor: "blue",
                        },
                        textInputContainer: {
                            backgroundColor: "red",
                        },
                        textInput: {
                        },
                        poweredContainer: {
                            display: "none",
                        },
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        display: "flex",
        flex: 1,
        backgroundColor: "green",
    },
});
