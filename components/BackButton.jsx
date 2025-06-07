import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import backButton from "../assets/images/backbutton.png";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";

export default BackButton = ({ params }) => {
    const navigation = useNavigation();
    return (<TouchableOpacity onPress={() => { navigation.goBack(); }} >
        <Image style={styles.backButton} source={backButton} />
    </TouchableOpacity>
    );
};
const styles = StyleSheet.create({
    backButton: {
        height: 40,
        width: 40,
    },
});