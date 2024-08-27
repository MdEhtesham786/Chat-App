import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import image from "../assets/images/icon.png";

export default ChatBox = ({ avatar, name, latestMessage }) => {
    return (
        <TouchableOpacity style={styles.box}>
            <Image style={styles.img} source={image} />
            <View style={styles.textContainer}>
                <Text style={styles.name}>{name}</Text>
                <Text style={styles.latestMessage}>{latestMessage}</Text>
            </View>
        </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    box: {
        flexDirection: 'row',
        height: 80,
        width: '100%',
        // alignItems: 'center',
        marginHorizontal: "auto",
        borderColor: '#EDEDED',
        borderBottomWidth: 1,
    },
    textContainer: {
        // backgroundColor: 'orange',
        paddingHorizontal: 15,
        width: '80%',
        paddingVertical: 5
    },
    img: {
        height: 60,
        width: 60,
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