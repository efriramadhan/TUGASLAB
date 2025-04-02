import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles';

export default function ChatDetailScreen() {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { id: '1', text: 'Halo!', sender: 'other' },
    { id: '2', text: 'Hai, apa kabar?', sender: 'me' },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setChatMessages([...chatMessages, { id: Date.now().toString(), text: message, sender: 'me' }]);
      setMessage('');
    }
  };

  return (
    <View style={styles.chatDetailContainer}>
      <FlatList
        data={chatMessages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.chatBubble,
              item.sender === 'me' ? styles.myMessage : styles.otherMessage,
            ]}
          >
            <Text style={styles.chatText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.chatInputContainer}>
        <TextInput
          style={styles.chatInput}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Kirim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
