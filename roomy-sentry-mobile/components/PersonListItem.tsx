import {View, Text, TouchableOpacity} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {styles} from "../styles";
import User from "../objects/User";
import UserDevicesModal from "./UserDevicesModal";
import {useEffect, useState} from "react";

export default function PersonListItem(props: {user: User}) {
    const [isVisible, setVisible] = useState(false);
    const [value, setValue] = useState(0); // integer state
    var count = 0;

    function useForceUpdate(){
        setValue(value+1); // update the state to force render
    }

    useEffect(() => {
        count = 0;
    }, [value]);

    return (
        <TouchableOpacity style={{width: "100%", padding: 0, margin: 5}} onPress={() => {setVisible(true)}}>
            <UserDevicesModal user={props.user} isVisible={isVisible} close={() => {setVisible(false); useForceUpdate();}}/>
            <View style={{flexDirection: "row",width: 350, justifyContent: "space-between"}}>
                <Text style={[styles.text, {fontSize: 24}]}>{props.user.name}</Text>
                <Text style={{ flexDirection: "row", justifyContent: "flex-end"}}><Ionicons name="ellipse" size={32} color={props.user.isOnline ? "green" : "red"} /></Text>
            </View>
            <Text style={[styles.text, {fontSize: 20}]}>{props.user.isOnline ? "Is at Home" : "Is not at Home"}</Text>
        </TouchableOpacity>
    );
}
