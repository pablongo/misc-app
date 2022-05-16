import React from 'react';
import { Alert, StyleSheet, Text } from 'react-native';
import { useAxiosMutation } from '../../../../client';
import CustomButton from '../../../components/customButton';

const DeleteFriendRequestButton: React.FC<{
  idFriend: string
  userName?: string
  onRefresh?: Function
  updateData?: Function
}> = ({
  idFriend,
  userName,
  onRefresh,
  updateData
}) => {
    const onComplete = (response: any) => {
      if (response.data.success) {
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

    const [handleMutation, { loading }] = useAxiosMutation('/api/auth/deleteFriend', {
      onComplete,
      onError
    });

    const handleDeleteFriend = () => {
      Alert.alert(
        "Alerta",
        "¿Deseas eliminar a " + userName + " de tus amigos?",
        [
          {
            text: "Aceptar",
            onPress: () => handleMutation({ idFriend })

          },
          {
            text: "Cancelar",
          }
        ]
      );
    }

    return (
      <CustomButton
        loading={loading}
        disabled={loading}
        onPress={handleDeleteFriend}
        style={styles.deleteFriendRequestButton}>
        <Text style={styles.friendRequestText}>Eliminar</Text>
      </CustomButton>
    );
  }

const styles = StyleSheet.create({
  deleteFriendRequestButton: {
    marginLeft: 'auto',
    backgroundColor: '#FFCFCF',
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

export default DeleteFriendRequestButton;