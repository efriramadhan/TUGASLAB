import react from "react";
import { Text, View, StyleSheet, Image, ScrollView,TextInput } from "react-native";

const Tugas02 = () => {
  return (
    <>
      <ScrollView>

        <View style ={styles.container}>
            <Image style= {styles.image} source={require('./assets/ArleChibi.jpg')}></Image>
            <Text style= {styles.text}> Efri Ramadhan - 00000078662 </Text>
        </View>

        <View style ={styles.container}>
            <Image style= {styles.image} source={require('./assets/Kazuha.jpg')}></Image>
            <Text style= {styles.text}> Ucup - 00000076969 </Text>
        </View>

        <View style ={styles.container}>
            <Image style= {styles.image} source={require('./assets/Bennet.jpg')}></Image>
            <Text style= {styles.text}> Asep - 00000072314 </Text>
        </View>

        <View style ={styles.container}>
            <Image style= {styles.image} source={require('./assets/Xianyun.jpg')}></Image>
            <Text style= {styles.text}> Soimah - 00000079696 </Text>
        </View>

        <View style ={styles.container}>
            <Image style= {styles.image} source={require('./assets/Furina Chibi.jpg')}></Image>
            <Text style= {styles.text}> Purina - 00000077777 </Text>
        </View>

      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
    container:{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 50,
    },

    content:{
        alignItems: 'center',
    },

    text: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    image: {
        width: 300,
        height: 300,
        resizeMode: 'contain',
        marginTop: 20,
    },
});

export default Tugas02;
