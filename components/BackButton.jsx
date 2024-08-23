import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import backButton from "../assets/images/backbutton.png";
import { useNavigation } from "@react-navigation/native";

export default BackButton = ({ navigate, params }) => {
    const navigation = useNavigation();
    return (<TouchableOpacity onPress={() => { navigation.navigate(navigate, params); }} >
        <Image style={styles.backButton} source={backButton} />
    </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    backButton: {
        height: 40,
        width: 40
        // fontWeight: 'bold'
    },
});