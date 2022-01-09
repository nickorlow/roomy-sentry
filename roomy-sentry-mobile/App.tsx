import {StatusBar} from 'expo-status-bar';
import {Button, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFonts} from "@use-expo/font";
import {useEffect, useState} from "react";
import PersonListItem from "./components/PersonListItem";
import {styles} from "./styles";
import User from "./objects/User";


export default function App() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
            updateHomeRoomys();
        }
        , [])

    function updateHomeRoomys() {
        var userArr: User[] = [];
        fetch('https://69c2-2603-8080-e900-ef-7993-68c7-29b3-41e0.ngrok.io/Roomy/Devices',
            {
                method: 'GET',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
            })
            .then(response => response.json())
            .then(data => {
                for (var i = 0; i < data.length; i++) {
                    var userIndex: number = userArr.findIndex(x => x.name == data[i].ownerName);
                    var user: User = userIndex > -1 ? userArr[userIndex] : {name: data[i].ownerName, isOnline: false, devices: []};
                    if(userIndex > -1) {
                        userArr.splice(userIndex, 1);
                    }
                    var fiveMinutes = 1000 * 60 * 5;
                    var otherVariable = ((new Date().getTime() - new Date(data[i].lastDetected).getTime()) < fiveMinutes) ? "active" : "inactive";

                    user.devices.push({
                        owner: user.name,
                        name: data[i].deviceName,
                        lastSeen: new Date(data[i].lastDetected),
                        macAddress: data[i].macAddress,
                        isOnline: otherVariable == "active"
                    });

                    if (otherVariable == "active") {
                        user.isOnline = true;
                    }

                    userArr.push(user);
                }
                setUsers(userArr);
                console.log(userArr)
            }).catch(e => console.log(e));

    }

    const [isLoaded] = useFonts({
        "SF-Mono": require("./assets/fonts/SF-Mono-Regular.otf"),
        "SF-Mono-Bold": require("./assets/fonts/SF-Mono-Bold.otf"),
    });

    if (!isLoaded) {
        return <Text>Loading...</Text>;
    } else {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.container}>
                    <Text style={[styles.title, {marginBottom: 50, marginTop: 40}]}>Welcome to Roomy!</Text>
                    <ScrollView>
                        {users.map((u, i) => {
                            return <PersonListItem user={u} key={i}/>;
                        })}
                    </ScrollView>
                    <Button title={"Refresh"} onPress={updateHomeRoomys}/>
                    <Text style={styles.text}>Copyright© Nicholas Orlowsky</Text>
                    <Text style={styles.text}>Made in Austin, TX</Text>
                    <Text style={styles.text}>Do not use for illegal purposes</Text>
                </View>
            </SafeAreaView>
        );
    }
}

