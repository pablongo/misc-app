
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const PendingFriendRequestButton = () => (
  <TouchableOpacity style={styles.pendingFriendRequestButton}>
    <Text style={styles.friendRequestText}>Pendiente</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  pendingFriendRequestButton: {
    marginLeft: 'auto',
    backgroundColor: '#FFE1C6',
    borderRadius: 100,
    width: 72,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  friendRequestText: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 12,
    color: '#00443B',
  },
})

export default PendingFriendRequestButton;