import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Paragraph, Title } from "react-native-paper";
import { getPosts } from "../services/axios";
interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const PostPage = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      if (response.status === 200) {
        setPosts(response.data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    // Refresh posts when returning from FormPage
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPosts();
    });

    return unsubscribe;
  }, [navigation]);

  const renderPostCard = ({ item }: { item: Post }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate("FormPage", { post: item })}
      style={styles.cardContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>{item.title}</Title>
          <Paragraph numberOfLines={3} style={styles.content}>
            {item.body}
          </Paragraph>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Loading posts...</Text>
      ) : (
        <FlatList
          data={posts}
          renderItem={renderPostCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 10,
  },
  listContainer: {
    paddingBottom: 15,
  },
  cardContainer: {
    marginBottom: 10,
  },
  card: {
    elevation: 3,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
    lineHeight: 20,
    color: "black",
  },
  content: {
    fontSize: 14,
    color: "black",
    textAlign: "justify",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
});

export default PostPage;
