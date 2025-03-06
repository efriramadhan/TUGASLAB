import { Text, View, Image, ScrollView } from "react-native";
import userData from "./data.json";
import styles from "./App.styles";

export default function App() {
  return (
    <ScrollView>
      {userData.map((users) => {
        return (
          <View style={styles.container} key={users.name}>
            <View style={styles.card}>
              <Image
                source={{
                  uri: users.photo_url,
                }}
                style={styles.avatar}
              />
              <View style={styles.boldText}>
                <Text style={styles.boldText}>{users.name}</Text>
                <Text>{users.email}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
