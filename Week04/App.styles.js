import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    display: "flex",
  },
  card: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 20,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 100,
    marginTop: 50,
    width: 550,  
    gap: 8,
    backgroundColor: "#82e0aa",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 999,
    marginRight: 10,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 35,
  },
  description: {
    width: "fit-content",
    display: "flex",
    gap: 2,
  },
});

export default styles;
