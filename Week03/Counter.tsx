import React from "react";
import { Button, View, StyleSheet, Text } from "react-native";

    interface ICounter{
        tambahUmur: () => void;
        kurangiUmur: () => void;
        simpanNilai: () => void;
        umur: number;
    }

    const Counter = ({ tambahUmur, kurangiUmur, simpanNilai, umur }: ICounter) => {
        return(
            <View style = {styles.counterContainer}>
                <Text style = {styles.title}>Umur ku</Text>
                <Text style = {styles.age}>{umur}</Text>
                <Text style = {styles.text}>tahun</Text>

                <View style = {styles.buttonContainer}>
                    <Button title = "INCREMENT" onPress={tambahUmur} color= "#1976D2" />
                    <Button title = "DECREMENT" onPress={kurangiUmur} color= "#1976D2" />
                </View>

                <View style = {styles.passValueContainer}>
                    <Button title = "PASS VALUE" onPress={simpanNilai} color="#0D47A1" />
                </View>
            </View>     
        )
    }

    const styles = StyleSheet.create({
        counterContainer: {
            backgroundColor: '#FFF',
            padding: 20,
            borderRadius: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 3,
            alignItems: 'center',
            width: '90%',
            marginBottom: 20,
        },

        title: {
            fontSize: 24,
            fontWeight: 'bold',
            color: '#444',
        },

        age: {
            fontSize: 50,
            fontWeight: 'bold',
            color: '#1E88E5',
        },

        text: {
            fontSize: 18,
            color: '#666'
        },

        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 10,
        },

        passValueContainer: {
            marginTop: 15,
            width: '100%',
        },

    });


export default Counter;