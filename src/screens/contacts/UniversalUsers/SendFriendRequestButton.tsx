import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useAxiosMutation } from '../../../../client';
import CustomButton from '../../../components/customButton';
import { logEvent } from '../../../utils/Amplitude';

const SendFriendRequestButton: React.FC<{
  idFriend: string,
  onRefresh?: Function
  updateData?: Function
}> = ({
  idFriend,
  onRefresh,
  updateData
}) => {
    const onComplete = (response: any) => {
      if (response.data.success) {
        logEvent("TYPE_SEND_FRIEND_REQUEST_EVENT", { idFriend });
        if (updateData) updateData(response.data.user);
        if (onRefresh) onRefresh(false);
      }
    };
    const onError = (error: any) => {
      if (error.response) {
        const { data } = error.response;
        if (data.msg) {
          Alert.alert(
            "Ops...",
            JSON.stringify(data.msg),
            [
              { text: "Aceptar" }
            ]
          );
        }
      };
    };

    const [handleMutation, { loading }] = useAxiosMutation('/api/auth/sendFriendRequest', {
      onComplete,
      onError
    });

    const handleSendFriendRequest = () => handleMutation({ idFriend });

    return (
      <CustomButton
        loading={loading}
        disabled={loading}
        onPress={handleSendFriendRequest}
        style={styles.sendFriendRequestButton}>
        <Text style={styles.friendRequestText}>Invitar</Text>
      </CustomButton>
    );
  };


const styles = StyleSheet.create({
  sendFriendRequestButton: {
    marginLeft: 'auto',
    backgroundColor: '#E9F6ED',
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
});

export default SendFriendRequestButton;