import React from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper";

const Tugas04 = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <CustomCard image={require("./assets/ArleChibi.jpg")} name="Efri Ramadhan" id="00000078662" />
      <CustomCard image={require("./assets/Kazuha.jpg")} name="Ucup" id="00000076969" />
      <CustomCard image={require("./assets/Bennet.jpg")} name="Asep" id="00000072314" />
      <CustomCard image={require("./assets/Xianyun.jpg")} name="Soimah" id="00000079696" />
      <CustomCard image={require("./assets/Furina Chibi.jpg")} name="Purina" id="00000077777" />
    </ScrollView>
  );
};


const CustomCard = ({ image, name, id }) => {
  return (
    <Card style={styles.card}>
      <Card.Cover source={image} style={styles.image} />
      <Card.Content>
        <Text style={styles.boldText}>{name}</Text>
        <Text>{id}</Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    alignItems: "center",
    padding: 10,
  },
  card: {
    width: 350,
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
  },
  image: {
    height: 150,
    borderRadius: 10,
  },
  boldText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
  },
});

export default Tugas04;
