import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useAxios } from '../../../../client';
import { updateBeat } from '../../../controllers/bet/actions';
import { updateOther } from '../../../controllers/games/other';
import { getData } from '../../../utils/index'
import { playBackgroundMusic } from '../../../controllers/sound';
import ImgArrowBack from '../../../assets/arrow-back-green.svg'
import ImgSelectedBlue from '../../../assets/selectedBlue.svg'
import ImgSelectedGreen from '../../../assets/selectedGreen.svg'
import ImgUnSelected from '../../../assets/unSelected.svg'

const windowHeight = Dimensions.get('window').height;

const SelectFriends: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const dispatch = useDispatch()
  const [guestList, setGuestList] = useState<any>([]);
  const [search, setSearch] = useState("");
  const disabledButton = guestList.length < 1;

  const handleSelectedGuests = (selected: any) => {
    const newData = [...guestList];
    const index = newData.findIndex((guest: any) => guest.user.id === selected.user.id);
    if (index === -1) {
      newData.push(selected);
      if (guestList.length < 3) {
        setGuestList(newData);
      }
    }
    else {
      handleUnSelectedGuests(selected)
    }

  };

  const handleUnSelectedGuests = (selected: any) => {
    const newData = [...guestList];
    const removeItem = newData.filter((guest: any) => guest.user.id !== selected.user.id);
    setGuestList(removeItem);
  }

  const handleNext = async () => {
    const user = await getData('user')
    const newGuestList = guestList.map((item: any) => {
      return { ...item, status: 2 }
    })
    switch (route?.params?.game) {
      case 'trivoo': {
        dispatch(updateBeat({
          friends: [...newGuestList, {
            id: newGuestList[newGuestList.length - 1].id + 1,
            status: 1,
            user: {
              id: user.id,
              name: user.userName
            }
          }]
        }));
        navigation.navigate('BET-TYPES', { color: route?.params?.color, game: route?.params?.game });
        break;
      }
      case 'customChallenge': {
        dispatch(updateOther({
          friends: [...newGuestList, {
            id: newGuestList[newGuestList.length - 1].id + 1,
            status: 1,
            user: {
              id: user.id,
              name: user.userName
            }
          }]
        }));
        navigation.navigate('BET-TYPES', { color: route?.params?.color, game: route?.params?.game });
        break;
      }
      default: {
        dispatch(updateOther({
          friends: []
        }));
        navigation.navigate('Dashboard');
        break;
      }
    }
  }

  const isSelected = (friend: any) => {
    return guestList
      .findIndex((guest: any) => guest.user.id === friend.user.id) > -1;
  }


  const { loading, error, data, refetch } = useAxios('api/auth/getFriends');

  const dataWithSearch = () => {
    let _data = data || [];
    if (!search) {
      return _data
    }
    return _data
      .filter((friend: any) => (
        friend.user.name.toLocaleLowerCase()
          .includes(search.toLocaleLowerCase())
      ));
  }

  const handleGoback = () => {
    switch (route?.params?.game) {
      case 'trivoo': {
        dispatch(updateBeat({
          friends: []
        }));
        navigation.navigate('Preguntados-Categories', { mode: "challenge", game: route?.params?.game })
        break;
      }
      case 'customChallenge': {
        dispatch(updateOther({
          friends: []
        }));
        navigation.navigate('custom-challenge', { mode: "challenge", game: route?.params?.game })
        break;
      }
      default: {
        dispatch(updateBeat({
          friends: []
        }));
        dispatch(updateOther({
          friends: []
        }));
        playBackgroundMusic()
        navigation.navigate('Dashboard');
        break;
      }
    }
  }

  useEffect(() => {
    const myFunction = async () => {
      const user = await getData('user')
      if (user.music && route?.params?.game === 'trivoo') {
        playBackgroundMusic()
      }
      if (route?.params?.friends?.length) {
        const newData = [...route?.params?.friends];
        const removeItem = newData.filter((guest: any) => guest.user.id !== user.id);
        setGuestList(removeItem);
      }
    }
    myFunction()
  }, [])

  return (
    <SafeAreaView style={styles.viewFriends}>
      <View style={{ padding: Platform.OS === 'ios' ? 21 : 0 }}>
        <TouchableOpacity onPress={() => handleGoback()}>
          <ImgArrowBack width={12} height={10} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', marginTop: 10 }}>
          <View style={{ width: '100%' }}>
            <Text style={styles.textFriends}>Seleccionar amigos</Text>
            <TextInput
              onChangeText={(value) => setSearch(value)}
              placeholder="Buscar amigo"
              placeholderTextColor={"#00443B"}
              style={styles.searchBar}
            />
          </View>
        </View>
        {Boolean(error) && (
          <View style={styles.loadingOrError}>
            <Text>Lo sentimos, ha ocurrido un error.</Text>
          </View>
        )}
        <FlatList
          style={{ marginTop: 20, height: windowHeight - 300 }}
          data={dataWithSearch()}
          refreshing={loading}
          onRefresh={() => refetch()}
          renderItem={(friend: any) => (
            <Friend
              isSelected={() => isSelected(friend.item)}
              friend={friend.item}
              handleUnSelected={handleUnSelectedGuests}
              handleSelected={handleSelectedGuests}
              color={route?.params?.color}
            />
          )}
          keyExtractor={(item: any) => item.id}
        />
      </View>
      <View style={{ paddingHorizontal: Platform.OS === 'ios' ? 21 : 0 }}>
        <TouchableOpacity
          disabled={disabledButton}
          onPress={handleNext}
          style={disabledButton ? {
            ...styles.challengeButtonDisabled,
            backgroundColor: route?.params?.color === 'green' ? "#E9F6ED" : "#E2F4F8"
          } : {
            ...styles.challengeButton,
            backgroundColor: route?.params?.color === 'green' ? "#0CC482" : "#108BE3"
          }}>
          <Text style={styles.challengeTextButton}>Retar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const colors = ['#FFE1C6', '#E9F6ED', '#FAF0F0', '#E2F4F8'];
var colorAvatar = colors[Math.floor(Math.random() * colors.length)];

const Friend: React.FC<{
  friend: any,
  handleSelected: Function,
  isSelected?: Function,
  handleUnSelected: Function,
  color: string
}> = ({
  friend,
  handleSelected,
  handleUnSelected,
  isSelected = () => { },
  color
}) => {
    const checkSelected = isSelected();
    return (
      <TouchableOpacity onPress={() => handleSelected(friend)} style={styles.friendItem}>
        {checkSelected ? (
          <View style={[styles.avatarItem, { backgroundColor: colorAvatar, }]}>
            {color === 'green' ? (
              <ImgSelectedGreen width={38} height={38} />
            ) : null}
            {color === 'blue' ? (
              <ImgSelectedBlue width={38} height={38} />
            ) : null}
          </View>
        ) : (
          <View style={[styles.avatarItem, { backgroundColor: colorAvatar, }]}>
            <Text style={styles.avatarText}>{friend.user.userName[0]}</Text>
          </View>
        )}
        {friend.user.name ? (
          <View>
            <Text style={styles.friendUserName}>{friend.user.userName}</Text>
            <Text style={styles.friendName}>{friend.user.name}</Text>
          </View>
        ) : (
          <Text style={styles.friendUserName}>{friend.user.userName}</Text>
        )}
        {checkSelected && (
          <TouchableOpacity onPress={() => handleUnSelected(friend)} style={{ marginLeft: 'auto' }} >
            <ImgUnSelected width={28} height={28} />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  }

const styles = StyleSheet.create({
  viewFriends: {
    flex: 1,
    padding: Platform.OS === 'ios' ? 0 : 21,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF'
  },
  challengeButton: {
    backgroundColor: '#108BE3',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  challengeButtonDisabled: {
    backgroundColor: '#E2F4F8',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  challengeTextButton: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#00443B',
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
  searchBar: {
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    padding: Platform.OS === 'ios' ? 15 : 0,
    alignItems: 'stretch',
    borderColor: '#EAEAEA',
  },
  friendItem: {
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
  },
  avatarText: {
    fontFamily: 'Laurel',
    fontSize: 24,
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
  loadingOrError: {
    marginTop: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textFriends: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#00443B',
  },
});

export default SelectFriends;