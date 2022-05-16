import React, { useState, useEffect } from 'react';
import { Dimensions, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import client, { useAxios } from '../../../client';
import CustomButton from '../../components/customButton';
import CustomModal from '../../components/modal';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import ImgArrowRight from '../../assets/arrow-right.svg'
import ImgAdd from '../../assets/add-green.svg'
import ImgSearch from '../../assets/search.svg'

const colors = ['#FFE1C6', '#E9F6ED', '#FAF0F0', '#E2F4F8'];
var colorAvatar = colors[Math.floor(Math.random() * colors.length)];
const windowHeight = Dimensions.get('window').height;


const Friends: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { loading, error, data, refetch } = useAxios('api/auth/getFriends');
  const { params } = route;
  const [makeRefretch, setMakeRefretch] = useState(false);
  const [friendRequestRefresh, setFriendRequestRefresh] = useState(false);
  const handleRefetch = () => {
    refetch();
    setFriendRequestRefresh(true);
  }

  useEffect(() => {
    console.log('here')
    refetch()
  }, [makeRefretch]);

  useEffect(() => {
    if (params?.deleteFriend) {
      refetch();
    }
  }, [params]);

  return (
    <View style={styles.viewFriends}>
      <View style={styles.viewButtons}>
        <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate('Contacts')}>
          <View style={styles.iconButton}>
            <ImgSearch width={14} height={14} />
          </View>
          <Text style={styles.textButton}>Buscar nuevo amigo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonView} onPress={() => navigation.navigate('AppShare')}>
          <View style={styles.iconButton}>
            <ImgAdd width={10} height={12} />
          </View>
          <Text style={styles.textButton}>Invitar a un amigo</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.containerList}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <Text style={styles.textStatistics}>Estadísticas</Text>
            <Text style={styles.textFriends}>Tus amigos</Text>
          </View>
          <FriendsRequests
            params={params}
            friendRequestRefresh={friendRequestRefresh}
            setFriendRequestRefresh={setFriendRequestRefresh}
            refetchFriends={refetch}
            setMakeRefretch={setMakeRefretch}
            makeRefretch={makeRefretch}
          />
        </View>
        {Boolean(error) && (
          <View style={styles.loadingOrError}>
            <Text>Lo sentimos, ha ocurrido un error.</Text>
          </View>
        )}
        <FlatList
          style={{ marginTop: 20, height: windowHeight - 450 }}
          data={data || []}
          refreshing={loading}
          onRefresh={handleRefetch}
          renderItem={(friend) => <Friend friend={friend.item} navigation={navigation} />}
          keyExtractor={(item: any) => item.id}
        />
      </View>

    </View>
  );
};

const Friend: React.FC<{ friend: any, navigation: any, }> = ({ friend, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('friendDetails', friend)}
    >
      <View style={styles.friendItem}>
        <View style={[styles.avatarItem, { backgroundColor: colorAvatar, }]}>
          <Text style={styles.avatarText}>{friend.user.userName[0]}</Text>
        </View>
        {friend.user.name ? (
          <View>
            <Text style={styles.friendUserName}>{friend.user.userName}</Text>
            <Text style={styles.friendName}>{friend.user.name}</Text>
          </View>
        ) : (
          <Text style={styles.friendUserName}>{friend.user.userName}</Text>
        )}
        <View style={{ marginLeft: 'auto' }}>
          <ImgArrowRight width={5} height={8} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const FriendsRequests: React.FC<{
  refetchFriends?: Function,
  params?: any,
  setMakeRefretch: any,
  makeRefretch: any,
  friendRequestRefresh?: boolean,
  setFriendRequestRefresh?: any
}> = ({
  refetchFriends,
  params,
  setMakeRefretch,
  makeRefretch,
  friendRequestRefresh,
  setFriendRequestRefresh
}) => {
    const [open, setOpen] = useState(false);
    const { loading, data, refetch }: any = useAxios('api/auth/friendRequests');
    useEffect(() => {
      if (params?.receivedFriendRequest) {
        refetch();
        setOpen(true);
      }
    }, [params]);

    useEffect(() => {
      if (friendRequestRefresh) {
        refetch();
        setFriendRequestRefresh(false);
      }
    }, [friendRequestRefresh]);

    const openModal = () => {
      setOpen(true);
      refetch();
    }
    return (
      <>
        <TouchableOpacity onPress={openModal} style={styles.friendRequests}>
          <Text style={styles.textFriendRequests}>{data ? data.length : 0} Invitaciones</Text>
        </TouchableOpacity>
        <CustomModal open={open}>
          <View style={styles.modalFriendRequests}>
            <TouchableOpacity onPress={() => setOpen(false)} style={styles.circleBack}>
              <ImgArrowBack width={12} height={10} />
            </TouchableOpacity>
            <Text style={styles.titleFriendRequests}>Solicitudes pendientes</Text>
            <Text style={styles.textCountFriendRequests}>Tienes {data ? data.length : 0} invitaciones</Text>
            <FlatList
              style={{ marginTop: 10 }}
              data={data || []}
              refreshing={loading}
              onRefresh={() => refetch()}
              renderItem={(friendRequest) => (
                <FriendRequest
                  refetch={refetch}
                  refetchFriends={refetchFriends}
                  friendRequest={friendRequest.item}
                  setMakeRefretch={setMakeRefretch}
                  makeRefretch={makeRefretch}
                />
              )}
              keyExtractor={(item: any) => item.id}
            />
          </View>
        </CustomModal>
      </>
    );
  }

const FriendRequest: React.FC<{ friendRequest: any, refetch?: any, refetchFriends?: any, setMakeRefretch: any, makeRefretch: any }> = ({
  friendRequest,
  refetchFriends,
  refetch,
  setMakeRefretch,
  makeRefretch
}) => {
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const checkName = Boolean(friendRequest.user.name);
  const handleAcceptFriendRequest = () => {
    setLoadingAccept(true);
    client.post('/api/auth/acceptFriendRequest', {
      idFriend: friendRequest.user.id
    })
      .then(() => {
        setLoadingAccept(false)
        refetch()
        refetchFriends()
        setMakeRefretch(!makeRefretch)
      })
      .catch((error: any) => {
        setLoadingAccept(false);
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
      });
  };

  const handleDeleteFriendRequest = () => {
    setLoadingDelete(true);
    client.post('/api/auth/deleteFriendRequest', {
      idFriend: friendRequest.user.id
    })
      .then(() => {
        setLoadingDelete(false);
        refetch()
        refetchFriends()
        setMakeRefretch(!makeRefretch)
      })
      .catch((error: any) => {
        setLoadingDelete(false);
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
      });
  };


  return (
    <View style={styles.friendRequestItem}>
      <View style={[styles.avatarItemFriendRequest, { backgroundColor: colorAvatar, }]}>
        <Text style={styles.avatarTextFriendRequest}>{friendRequest.user.userName[0]}</Text>
      </View>
      <View style={{ marginLeft: 20, marginTop: 20 }}>
        <Text style={[styles.friendRequestName, { marginBottom: checkName ? 0 : 10 }]}>{friendRequest.user.userName}</Text>
        {checkName && <Text style={styles.friendRequestUserName}>{friendRequest.user.name}</Text>}
        <View style={styles.viewButtonsFriendRequest}>
          <CustomButton
            loading={loadingDelete}
            disabled={loadingDelete}
            onPress={handleDeleteFriendRequest}
            style={styles.buttonDeleteFriendRequest}>
            <Text style={styles.textDeleteFriendRequest}>Rechazar</Text>
          </CustomButton>
          <CustomButton
            loading={loadingAccept}
            disabled={loadingAccept}
            onPress={handleAcceptFriendRequest}
            style={{
              ...styles.buttonAcceptFriendRequest,
              marginLeft: 15,
            }} >
            <Text style={styles.textAcceptFriendRequest}>Aceptar</Text>
          </CustomButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  viewFriends: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  titleFriendRequests: {
    fontFamily: 'Apercu Pro',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00443B',
    marginBottom: Platform.OS === 'ios' ? 7 : 0
  },
  textCountFriendRequests: {
    fontFamily: 'Apercu Pro',
    fontSize: 15,
    fontStyle: 'normal',
    color: '#00443B'
  },
  modalFriendRequests: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 30 : 0,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  buttonDeleteFriendRequest: {
    width: 110,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#FAF0F0',
  },
  textDeleteFriendRequest: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    color: '#F8534B',
    fontSize: 12,
  },
  buttonAcceptFriendRequest: {
    width: 110,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#E9F6ED',
  },
  textAcceptFriendRequest: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    color: '#0CC482',
    fontSize: 12,
  },
  viewButtonsFriendRequest: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  arrowBack: {
    width: 12,
    height: 10,
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
  friendRequests: {
    marginLeft: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    width: 109,
    borderRadius: 100,
    height: 32,
    backgroundColor: '#E9F6ED',
  },
  textFriendRequests: {
    color: '#0CC482',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 12,
  },
  containerList: {
    padding: 25,
  },
  textStatistics: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    marginBottom: Platform.OS === 'ios' ? 7 : 0
  },
  textFriends: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#00443B',
  },
  iconButton: {
    marginRight: 10,
  },
  textButton: {
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    fontWeight: 'bold',

  },
  loadingOrError: {
    marginTop: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textTitle: {
    marginTop: 35,
    fontFamily: 'Laurel',
    fontWeight: 'normal',
    fontSize: 50,
    color: '#00443B'
  },
  viewButtons: {
    marginTop: 10,
    alignItems: 'center'
  },
  buttonView: {
    borderRadius: 100,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#00443B',
    marginTop: 10,
    width: 333,
    height: 51,
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendItem: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center'
  },
  friendRequestItem: {
    flexDirection: 'row',
    height: 104,
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
    alignItems: 'center',
  },
  avatarItem: {
    borderRadius: 100,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: 'Laurel',
    fontSize: 24,
    fontStyle: 'normal',
    color: '#00443B',
  },
  avatarItemFriendRequest: {
    borderRadius: 100,
    width: 49,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTextFriendRequest: {
    fontFamily: 'Laurel',
    fontSize: 30,
    fontStyle: 'normal',
    color: '#00443B',
  },
  friendUserName: {
    color: '#00443B',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
  },
  friendName: {
    color: '#CECECE',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    marginTop: Platform.OS === 'ios' ? 2 : 0,
    fontSize: Platform.OS === 'ios' ? 12 : 10,
  },
  friendRequestName: {
    color: '#00443B',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
  },
  friendRequestUserName: {
    color: '#CECECE',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 12,
    paddingBottom: 8,
  },
  arrowRight: {
    width: 6,
    height: 10,
  },
});

export default Friends;