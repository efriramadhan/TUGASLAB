import axios from "axios";

// Base URL untuk API
const BASE_URL = "https://jsonplaceholder.typicode.com"; // Pastikan URL ini benar

// Fungsi untuk mengambil posts dari API
export const getPosts = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

// Fungsi untuk mengambil post berdasarkan ID
export const getPostById = async (id: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching post with id ${id}:`, error);
    throw error;
  }
};

// Fungsi untuk mengupdate post
export const updatePost = async (
  id: number,
  data: { title: string; body: string }
) => {
  try {
    // JSONPlaceholder menggunakan PUT untuk update resource
    const response = await axios.put(`${BASE_URL}/posts/${id}`, data);
    console.log("Update response:", response);
    return response.data;
  } catch (error) {
    console.error(`Error updating post with id ${id}:`, error);
    throw error;
  }
};

// Fungsi untuk membuat post baru
export const createPost = async (data: {
  title: string;
  body: string;
  userId: number;
}) => {
  try {
    const response = await axios.post(`${BASE_URL}/posts`, data);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

// Fungsi untuk menghapus post
export const deletePost = async (id: number) => {
  try {
    const response = await axios.delete(`${BASE_URL}/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting post with id ${id}:`, error);
    throw error;
  }
};
