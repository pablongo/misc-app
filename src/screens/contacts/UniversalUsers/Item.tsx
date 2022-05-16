import React from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import DeleteFriendRequestButton from './DeleteFriendRequestButton';
import PendingFriendRequestButton from './PendingFriendRequestButton';
import SendFriendRequestButton from './SendFriendRequestButton';

const Item: React.FC<{
  user: any,
  updateData?: Function,
  onRefresh?: Function
}> = ({ user, updateData, onRefresh }) => {
  return (
    <View style={styles.contactItem}>
      <View style={styles.avatarItem}>
        <Text style={styles.avatarText}>{user.userName[0]}</Text>
      </View>
      <View>
        {user.name ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.contactName}>{user.userName}</Text>
              {user.match === 1 && <Text style={styles.textFriend}>Amigo/a</Text>}
            </View>
            <Text style={styles.contactUserName}>{user.name}</Text>
          </>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.contactName}>{user.userName}</Text>
            {user.match === 1 && <Text style={styles.textFriend}>Amigo/a</Text>}
          </View>
        )}
      </View>
      {user.match === -1 && (
        <SendFriendRequestButton
          idFriend={user.id}
          onRefresh={onRefresh}
          updateData={updateData}
        />
      )}
      {user.match === 1 && (
          <DeleteFriendRequestButton
            idFriend={user.id}
            userName={user.userName}
            onRefresh={onRefresh}
            updateData={updateData} />
      )}
      {user.match === 0 && (
        <PendingFriendRequestButton />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textFriend: {
    color: '#0CC482',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 12,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center'
  },
  avatarItem: {
    borderRadius: 100,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9F6ED',
  },
  avatarText: {
    fontFamily: 'Laurel',
    fontSize: 24,
    fontStyle: 'normal',
    color: '#00443B',
  },
  contactName: {
    color: '#00443B',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
  },
  contactUserName: {
    color: '#CECECE',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: Platform.OS === 'ios' ?  12 : 10,
  },
})


export default Item;