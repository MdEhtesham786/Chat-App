import { Text, View, StyleSheet, Image, TouchableOpacity, Pressable, TouchableHighlight, TouchableNativeFeedback } from "react-native";
// import image from "../assets/images/icon.png";

export default ChatBox = ({ avatar, name, latestMessage }) => {
    return (
        <TouchableNativeFeedback >
            <View style={styles.box}>
                <Image style={styles.img} source={avatar} />
                <View style={styles.textContainer}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.latestMessage}>{latestMessage}</Text>
                </View>
            </View>

        </TouchableNativeFeedback>
    );
};
const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        height: 80,
        width: '100%',
        marginHorizontal: 'auto',
        paddingLeft: 20,
        // backgroundColor: 'green',
        alignItems: 'center'
    },
    textContainer: {
        // backgroundColor: 'orange',
        paddingHorizontal: 15,
        width: '80%',
        paddingVertical: 5
    },
    img: {
        height: 55,
        width: 55,
        borderRadius: 15
    },
    name: {
        marginBottom: 10,
        fontSize: 17,
        fontWeight: '500',
        // backgroundColor: 'green'
    },
    latestMessage: {
        fontSize: 15
    }
});