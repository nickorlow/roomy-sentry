import {View, Text} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import {styles} from "../styles";
import Device from "../objects/Device";
var oui = require('oui');

export default function DeviceListItem(props: {device: Device}) {
    const manufacturer = oui(props.device.macAddress);
    return (
        <View style={{width: "100%", padding: 0, margin: 5}}>

            <View style={{flexDirection: "row",width: 350, justifyContent: "space-between"}}>
                <Text style={[styles.text, {fontSize: 24}]}>{props.device.name}</Text>
                <Text style={{ flexDirection: "row", justifyContent: "flex-end"}}><Ionicons name="ellipse" size={32} color={props.device.isOnline ? "green" : "red"} /></Text>
            </View>
            <Text style={[styles.text, {fontSize: 16}]}>{props.device.isOnline ? "Is Online" : "Is not Online"}</Text>
            <Text style={[styles.text, {fontSize: 16}]}>Last seen {props.device.lastSeen.toLocaleDateString()} at {props.device.lastSeen.toLocaleTimeString()}</Text>
            <Text style={[styles.text, {fontSize: 16}]}>Mac Address: {props.device.macAddress}</Text>
            <Text style={[styles.text, {fontSize: 16}]}>Manufacturer: {manufacturer == null ? "Unknown (PrivateAddress?)" : manufacturer}</Text>
        </View>
    );
}
