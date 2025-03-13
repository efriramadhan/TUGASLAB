import { StyleSheet } from "react-native";

const styles = StyleSheet.create({ 
    container: { 
      backgroundColor: "#fff", 
      alignItems: "center", 
      justifyContent: "center", 
      padding: 5,
      marginTop: 10,
      // "display: flex" not needed in RN as components are flex by default
    },
    card: { 
      borderWidth: 1, 
      borderColor: "black", 
      borderRadius: 8, 
      flexDirection: "row", 
      alignItems: "center", 
      padding: 8, 
      width: 325, 
      // "gap" property should be replaced with margins
      // "display: flex" not needed
    }, 
    avatar: { 
      width: 75, 
      height: 75, 
      borderRadius: 75/2, // React Native handles borderRadius differently for perfect circles
    }, 
    boldText: { 
      fontWeight: "bold",
    }, 
    description: {
      // "width: fit-content" not supported in RN
      flex: 1, // Use flex instead to take available space
      marginLeft: 8, // Replace gap with margin
      // "display: flex" not needed
      // "gap" property should be replaced with margins
    },
});

export default styles;