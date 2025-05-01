import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { updatePost } from "../services/axios";

interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const FormPage = ({ navigation, route }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (route.params && route.params.post) {
      const { post } = route.params;
      setPost(post);
      setTitle(post.title);
      setBody(post.body);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Error", "Title and body cannot be empty");
      return;
    }

    if (!post) {
      Alert.alert("Error", "No post data found");
      return;
    }

    try {
      setLoading(true);
      const data = {
        id: post.id, // Include the ID in the request
        title,
        body,
        userId: post.userId,
      };

      const response = await updatePost(post.id, data);

      // Check if the response exists instead of checking status
      if (response && response.data) {
        Alert.alert("Success", "Post updated successfully!", [
          { text: "OK", onPress: () => navigation.navigate("PostPage") },
        ]);
      }
    } catch (error) {
      console.error("Error updating post:", error);
      Alert.alert("Error", "Failed to update post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter post title"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Body</Text>
        <TextInput
          style={[styles.input, styles.bodyInput]}
          value={body}
          onChangeText={setBody}
          placeholder="Enter post body"
          multiline
          numberOfLines={6}
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Updating..." : "Update Post"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  bodyInput: {
    height: 150,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default FormPage;
