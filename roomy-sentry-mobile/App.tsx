import { StatusBar } from 'expo-status-bar';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import {useFonts} from "@use-expo/font";


export default function App() {
  const [isLoaded] = useFonts({
    "SF-Mono": require("./assets/fonts/SF-Mono-Regular.otf"),
    "SF-Mono-Bold": require("./assets/fonts/SF-Mono-Bold.otf"),
  });

  if (!isLoaded) {
    return <Text>Loading...</Text>;
  } else {
    return (
        <View style={styles.container}>
          <Text style={styles.title}>Welcome to Roomy!</Text>
          <StatusBar style="auto"/>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text : {
    color: 'white'
  },
  title : {
    color: 'white',
    fontFamily: 'SF-Mono-Bold',
    fontSize: 32
  }
});
