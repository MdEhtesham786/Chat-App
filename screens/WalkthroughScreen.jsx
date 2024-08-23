import { View, Text, SafeAreaView, Platform, StyleSheet, StatusBar, Image, TouchableOpacity } from "react-native";
import axios from "../utils/axiosConfig";

import image1 from "../assets/images/image1.png";
import image2 from "../assets/images/image2.png";
export default WalkthroughScreen = ({ navigation, route }) => {
    const fetchData = async () => {
        try {

        } catch (err) {
            console.log(err);

        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.imageContainer}>
                <Image style={styles.image1} source={image1} resizeMode="contain" />
                <Image style={styles.image2} source={image2} resizeMode="contain" />
            </View>
            <View style={styles.descriptionContainer}>
                <Text style={styles.descriptionText}>
                    Connect easily with your friends and family over countries
                </Text>
            </View>
            <View style={styles.buttonContainer}>
                <Text style={{ fontSize: 16 }} >Terms & Privacy Policy</Text>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Verification')} >
                    <Text style={styles.buttonText}>Start Messaging</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
        // backgroundColor:'#E5E5E5'
    },
    imageContainer: {
        marginTop: 100,
        height: 300,
        width: 300,
        // backgroundColor:'red',
        flexDirection: 'row'
    },
    image1: {
        width: '65%',
        height: '85%',
        alignSelf: 'flex-end',

    },
    image2: {
        width: '35%',
        height: '35%',
    },
    descriptionContainer: {
        marginTop: 30,
        width: 300,
        // backgroundColor: 'red'
    },
    descriptionText: {
        fontSize: 28,
        textAlign: 'center',

        fontWeight: 'bold'
    },
    buttonContainer: {
        marginTop: 130,
        height: 120,
        width: 350,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button: {
        height: '55%',
        width: '100%',
        backgroundColor: 'blue',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white'
    }
});            