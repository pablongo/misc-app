import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
    Platform,
    ScrollView
} from 'react-native';
import { useDispatch, useStore } from 'react-redux';
import { updateBeat } from '../../controllers/bet/actions';
import { updateOther } from '../../controllers/games/other';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import client from '../../../client';
import { Restaurant } from '../../types/index'
import RestaurantBox from '../../components/restaurantBox';

const RestaurantBet: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const store = useStore()
    const [pages, setPages] = useState(1)
    const [count, setCount] = useState(1)
    const [friends, setFriends] = useState([]);
    const [restaurants, setRestaurants] = useState<Array<Restaurant>>([])
    const dispatch = useDispatch()

    const handleGoback = () => {
        dispatch(updateBeat({
            betSettings: null
        }))
        dispatch(updateOther({
            betSettings: null
        }))
        navigation.navigate('BET-TYPES', { color: route?.params?.color, game: route?.params?.game });
    }

    useEffect(() => {
        const myFunction = async () => {
            const response = await client.post(`/api/paymentMethod/restaurant/`, {
                skip: (pages - 1) * 10, take: 10, admin: false, friends: friends.length
            })
            setRestaurants(response.data.data)
            setCount(response.data.count)
        }
        if (friends.length) {
            myFunction()
        }
    }, [pages, friends])

    useEffect(() => {
        switch (route?.params?.game) {
            case 'trivoo': {
                setFriends(store.getState().betCreation.friends)
                break;
            }
            case 'customChallenge': {
                setFriends(store.getState().otherGame.friends)
                break;
            }
            default: {
                setFriends([])
                break;
            }
        }
    }, [])

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={{ padding: Platform.OS === 'ios' ? 20 : 0 }}>
                <View style={styles.containerTitle}>
                    <TouchableOpacity
                        style={{
                            borderRadius: 100,
                            height: 40,
                            width: 40,
                            justifyContent: 'center',
                        }}
                        onPress={() => handleGoback()}>
                        <ImgArrowBack width={12} height={10} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Selecciona el restaurante</Text>
                </View>
                <ScrollView>
                    <View style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignContent: 'center',
                        alignItems: 'center',
                        marginTop: 10,
                    }}>
                        {restaurants?.map((item, index: number) => {
                            return (
                                <RestaurantBox route={route} navigation={navigation} restaurant={item} key={index} />
                            )
                        })}
                    </View>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
        padding: 20,
        backgroundColor: '#FFFFFF',
    },
    containerTitle: {
        padding: Platform.OS === 'ios' ? 21 : 0,
        paddingBottom: 0,
        paddingTop: 0,
        backgroundColor: '#FFFFFF',
    },
    arrowBack: {
        width: 12,
        height: 10,
        marginTop: 20,
    },
    title: {
        fontSize: 20,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    challengeButton: {
        backgroundColor: '#108BE3',
        borderRadius: 100,
        width: 332,
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    challengeButtonDisabled: {
        backgroundColor: '#E2F4F8',
        borderRadius: 100,
        width: 332,
        height: 51,
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
    boxText: {
        height: 190,
        padding: 21,
        marginTop: 21,
        borderWidth: 2,
        borderRadius: 25,
        borderColor: "#EAEAEA",
        marginVertical: 20
    },
    betText: {
        fontSize: 10,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'normal',
    },
    inputText: {
        fontSize: 15,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
        height: 160,
        textAlignVertical: 'top',
    },
    logo: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        // remove width and height to override fixed static size
    },
    imgBox: {
        width: 332,
        height: 179,
        marginVertical: 10
    },
    restaurantTitle: {
        fontSize: 30,
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
        fontWeight: '500',
        color: '#FFFFFF',
        textShadowColor: '#585858',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10,
    },
    restaurantSubTitle: {
        fontSize: 12,
        fontFamily: 'Apercu Pro Blod',
        fontStyle: 'normal',
        fontWeight: '700',
        color: '#FFFFFF',
        textShadowColor: '#585858',
        textShadowOffset: { width: 5, height: 5 },
        textShadowRadius: 10,
    },
    restaurantSubTitleBox: {
        minWidth: 141,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 10,
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default RestaurantBet;