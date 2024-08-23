import { View, Text, SafeAreaView, Platform, StyleSheet, StatusBar, Image, TouchableOpacity, FlatList } from "react-native";
import axios from "axios";
import { useEffect, useState } from "react";
import BackButton from "../components/BackButton";
export default CheckScreen = ({ navigation }) => {
    axios.defaults.withCredentials = true; //The most important line for cookies
    const [data, setData] = useState({});
    const [error, setError] = useState({});
    const fetchData = async () => {
        try {
            let res = await axios.get('https://jsonplaceholder.typicode.com/posts');
            setData(res.data);

        } catch (err) {
            console.log(err);
            setError({ error: err.response.data.error });

        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <View>
            <BackButton navigate={'Walkthrough'} />
            <TouchableOpacity onPress={() => navigation.navigate('Verification')}>
                <Text>Next</Text>
            </TouchableOpacity>
            <Text>Next</Text>
            <Text style={{ color: 'red' }}>{error?.error}</Text>
            <FlatList data={data}
                renderItem={({ item }) => {
                    return <Text>{item.title}</Text>;
                }}
                ItemSeparatorComponent={<View style={{ height: 10 }}></View>}
            />
        </View>
    );
};