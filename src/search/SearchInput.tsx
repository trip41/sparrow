import debounce from "lodash.debounce";
import * as React from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableHighlight, View, ViewStyle } from "react-native";
import { autocompletePlaces } from "../services/GooglePlacesService";
import { IGooglePlaceMatch, ILatLong } from "../types";
import { locationStringFromLatLon } from "../utils";

export interface ISearchInputProps {
    position: ILatLong;
    viewStyles?: ViewStyle;
    onSelectPlace: (placeid: string, placeName: string) => void;
}

export interface ISearchInputState {
    results: IGooglePlaceMatch[];
    inputText: string;
}

export class SearchInput extends React.Component<ISearchInputProps, ISearchInputState> {
    private textInputRef;

    public state: ISearchInputState = {
        results: [],
        inputText: "",
    };

    render() {
        const { viewStyles } = this.props;
        const { results } = this.state;

        return (
            <View style={[styles.container, viewStyles]}>
                <View style={styles.textInputContainer}>
                    <TextInput
                        ref={(ref) => { this.textInputRef = ref; }}
                        style={styles.textInput}
                        onChangeText={this.onChangeText}
                        placeholder="Search destinations"
                        clearButtonMode="always"
                    />
                </View>
                <View style={[styles.list, results.length > 0 && styles.showList]}>
                    <FlatList
                        style={styles.flatList}
                        data={results}
                        ItemSeparatorComponent={() => <View style={styles.listItemSeparator}/>}
                        keyboardShouldPersistTaps="always"
                        renderItem={({item}) => (
                            <TouchableHighlight
                                onPress={() => this.onSelect(item)}
                                underlayColor="rgba(81,82,81,0.1)"
                            >
                                <View style={styles.listItem}>
                                    <Text style={styles.listItemPrimary}>{item.structured_formatting.main_text}</Text>
                                    <Text style={styles.listItemSecondary}>{item.structured_formatting.secondary_text}</Text>
                                </View>
                            </TouchableHighlight>
                        )}
                    />
                </View>

            </View>
        );
    }

    private autocomplete = () => {
        const { position } = this.props;
        const { inputText } = this.state;

        autocompletePlaces({
            input: inputText,
            location: locationStringFromLatLon(position),
            radius: 5000,
            language: "en",
        }).then(results => this.setState({results: results.map(result => {
            result.key = result.place_id;
            return result;
        })}));
    }

    private onChangeText = (inputText: string) => {
        this.setState({inputText}, () => {
            this.debouncedAutocomplete();
        });
    }

    private onSelect = (placeMatch: IGooglePlaceMatch) => {
        this.props.onSelectPlace(placeMatch.place_id, placeMatch.structured_formatting.main_text);
        this.textInputRef.clear();
        this.setState({inputText: "", results: []});
    }

    private debouncedAutocomplete = debounce(this.autocomplete, 200);
}

const styles = StyleSheet.create({
    container: {
        zIndex: 9,
        position: "absolute",
        width: "100%",
    },
    textInputContainer: {
        marginHorizontal: 8,
        marginTop: 8,
        paddingLeft: 10,
        paddingRight: 3,
        paddingTop: 4,
        paddingBottom: 3,
        backgroundColor: "rgba(255,255,255,0.9)",
        borderColor: "#CED0CE",
        borderStyle: "solid",
        borderWidth: 1,
    },
    textInput: {
        height: 34,
        fontWeight: "300",
        backgroundColor: "transparent",
    },
    list: {
        display: "none",
        position: "absolute",
        top: 50,
        width: "100%",
        paddingHorizontal: 8,
    },
    showList: {
        display: "flex",
    },
    flatList: {
        backgroundColor: "rgba(255,255,255,0.9)",
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        paddingBottom: 3,
        borderColor: "#CED0CE",
        borderStyle: "solid",
        borderWidth: 1,
    },
    listItem: {
        paddingVertical: 7,
        paddingHorizontal: 10,
        flexDirection: "column",
    },
    listItemPrimary: {
        marginBottom: 1,
    },
    listItemSecondary: {
        fontSize: 11,
        opacity: 0.7,
    },
    listItemSeparator: {
        height: 0.5,
        width: "100%",
        backgroundColor: "#CED0CE",
    },
});
