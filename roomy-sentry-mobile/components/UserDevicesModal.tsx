import React, { useState } from 'react';
import {StyleSheet, Modal, View, Text, Alert, ScrollView, Button} from 'react-native';
import User from "../objects/User";
import { RFPercentage, RFValue } from "react-native-responsive-fontsize";
import PersonListItem from "./PersonListItem";
import {styles} from "../styles";
import DeviceListItem from "./DeviceListItem";





export default function UserDevicesModal(props: { isVisible: boolean, close: Function, user: User }) {

    function closeScreen()
    {
        props.close();
    }


    return (
        <Modal animationType={"slide"} presentationStyle="pageSheet" visible={props.isVisible} onRequestClose={() => props.close()} onDismiss={() => props.close()} style={{ backgroundColor: "black"}}>
            <ScrollView style={{ backgroundColor: "black"}}>
                <View style={[{ minHeight: 100, backgroundColor: "#F59810", width: "100%", paddingTop: RFValue(25), paddingHorizontal: RFValue(10), paddingBottom: RFValue(10), marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between' }]}>
                    <Text style={[styles.title, { paddingBottom: RFValue(8), marginTop: RFValue(25), color: 'white' }]}>{props.user.name}</Text>
                </View>
                {props.user.devices.map((d, i) => {
                    return <DeviceListItem device={d} key={i}/>;
                })}
                <Button title={"Close"} onPress={closeScreen}/>
            </ScrollView>
        </Modal>
    );
}
