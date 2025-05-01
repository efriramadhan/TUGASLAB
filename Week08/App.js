import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import FormPage from "./screens/FormPage.tsx";
import PostPage from "./screens/PostPage.tsx";
import { getPosts } from "./services/axios.ts";

const Stack = createNativeStackNavigator();

export default function App() {
  const getAllPosts = () => {
    getPosts()
      .then((data) => {
        console.log("Posts loaded successfully!", data);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
      });
  };

  useEffect(() => {
    getAllPosts();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PostPage">
        <Stack.Screen
          name="PostPage"
          component={PostPage}
          options={{ title: "Posts" }}
        />
        <Stack.Screen
          name="FormPage"
          component={FormPage}
          options={{ title: "Edit Post" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
