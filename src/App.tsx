import { StackNavigator } from "react-navigation";
// import { SearchInput } from "./search/SearchInput";
import { DestinationView } from "./views/DestinationView";
import { OriginView } from "./views/OriginView";

// Cmd+R to reload
// Cmd+D or shake for dev menu

export default StackNavigator({
    Home: {
        screen: OriginView,
    },
    Destination: {
        screen: DestinationView,
    },
});
