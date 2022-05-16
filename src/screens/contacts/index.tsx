import React, { useState, useEffect } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { useAxiosMutation } from '../../../client';
import CustomButton from '../../components/customButton';
import { useLoadContacts } from '../../hooks/Contacts';
import UniversalUsers from './UniversalUsers';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import { logEvent } from '../../utils/Amplitude';
const windowHeight = Dimensions.get('window').height;

const ContactsList: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const { data, error, loading, refetch } = useLoadContacts();
  const onSearch = search.trim().length > 0;
  const handleSearchWithName = (text: string) => setSearch(text);
  const handleRefresh = (activeLoading = true) => refetch(activeLoading);


  const ViewEmptyList = () => {
    if (loading) return null;

    if (error) return (
      <View style={styles.loadingOrError}>
        <Text>
          {error?.message === 'denied' ? "El permiso a los contactos ha sido denegado" : "Lo sentimos, ha ocurrido un error."}
        </Text>
      </View>
    );

    return (
      <View style={styles.loadingOrError}>
        <Text>No tienes contactos que estén usando Laurel Gaming.</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('Amigos')} style={styles.circleBack}>
          <ImgArrowBack width={12} height={10} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Buscar a un amigo</Text>
        <TextInput
          placeholder="Nombre"
          onChangeText={handleSearchWithName}
          placeholderTextColor={"#00443B"}
          style={styles.searchBar}
        />
        <View style={styles.containerList}>
          {onSearch ? (
            <UniversalUsers
              search={search}
              onRefresh={handleRefresh} />
          ) : (
            <FlatList
              style={{ height: windowHeight - 230 }}
              refreshing={loading}
              onRefresh={handleRefresh}
              data={data}
              renderItem={(contact) => (
                <Contact
                  loadContacts={handleRefresh}
                  contact={contact.item} />
              )}
              keyExtractor={(item: any) => item.id}
              ListEmptyComponent={ViewEmptyList}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const Contact: React.FC<{ contact: any, loadContacts?: Function }> = ({ contact, loadContacts }) => {
  return (
    <View style={styles.contactItem}>
      <View style={styles.avatarItem}>
        <Text style={styles.avatarText}>{contact.userName[0]}</Text>
      </View>
      <View>
        {contact.name ? (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.contactName}>{contact.userName}</Text>
              {contact.match === 1 && <Text style={styles.textFriend}>Amigo/a</Text>}
            </View>
            <Text style={styles.contactUserName}>{contact.name}</Text>
          </>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.contactName}>{contact.userName}</Text>
            {contact.match === 1 && <Text style={styles.textFriend}>Amigo/a</Text>}
          </View>
        )}
      </View>
      {contact.match === -1 && (
        <SendFriendRequestButton
          idFriend={contact.id}
          loadContacts={loadContacts}
        />
      )}
      {contact.match === 1 && (
        <DeleteFriendRequestButton
          idFriend={contact.id}
          userName={contact.userName}
          loadContacts={loadContacts} />
      )}
      {contact.match === 0 && (
        <PendingFriendRequestButton />
      )}
    </View>
  );
};

const SendFriendRequestButton: React.FC<{ idFriend: string, loadContacts?: Function }> = ({
  idFriend,
  loadContacts
}) => {
  const onComplete = () => {
    logEvent("TYPE_SEND_FRIEND_REQUEST_EVENT", { idFriend });
    if (loadContacts) loadContacts();
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

const DeleteFriendRequestButton: React.FC<{ idFriend: string, userName?: string, loadContacts?: Function }> = ({
  idFriend,
  userName,
  loadContacts
}) => {

  const onComplete = () => {
    if (loadContacts) loadContacts();
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

const PendingFriendRequestButton = () => (
  <TouchableOpacity style={styles.pendingFriendRequestButton}>
    <Text style={styles.friendRequestText}>Pendiente</Text>
  </TouchableOpacity>
);

export default ContactsList;

const styles = StyleSheet.create({
  containerList: {
    marginTop: 25,
  },
  textFriend: {
    color: '#0CC482',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 12,
  },
  titleText: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#00443B',
  },
  loadingOrError: {
    marginTop: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  deleteFriendRequestButton: {
    marginLeft: 'auto',
    backgroundColor: '#FFCFCF',
    borderRadius: 100,
    width: 72,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  pendingFriendRequestButton: {
    marginLeft: 'auto',
    backgroundColor: '#FFE1C6',
    borderRadius: 100,
    width: 72,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  circleBack: {
    width: 16,
    height: 30,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#FFFF'
  },
  arrowBack: {
    width: 12,
    height: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
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
    fontSize: Platform.OS === 'ios' ? 12 : 10,
  },
  searchBar: {
    borderBottomWidth: 1,
    padding: Platform.OS === 'ios' ? 15 : 0,
    borderColor: '#EAEAEA',
  },
});
