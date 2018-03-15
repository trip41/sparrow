import { StackNavigator } from "react-navigation";
import { SearchInput } from "./search/SearchInput";

// Cmd+R to reload
// Cmd+D or shake for dev menu

export default StackNavigator({
    Home: {
        screen: SearchInput,
    },
});
