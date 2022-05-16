import React from 'react';
import {
    StyleSheet,
    ImageBackground,
    View,
    Text,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useDispatch, useStore } from 'react-redux';
import { createBet, updateBeat } from '../../controllers/bet/actions';
import { updateOther } from '../../controllers/games/other';
import { Restaurant } from '../../types/index'
import client from '../../../client';

const RestaurantBox: React.FC<{ navigation: any, route: any, restaurant: Restaurant }> = ({ navigation, route, restaurant }) => {
    const dispatch = useDispatch()
    const store = useStore()
    const otherStore = store.getState()?.otherGame

    const handlePress = async () => {
        switch (route?.params?.game) {
            case 'trivoo': {
                dispatch(updateBeat({
                    betSettings: JSON.stringify({ value: restaurant.name, type: 'Comida', id: 3 }),
                    restaurantInfo: restaurant
                }))
                dispatch(createBet(navigation));
                break;
            }
            case 'customChallenge': {
                dispatch(updateOther({
                    betSettings: JSON.stringify({ value: restaurant.name, type: 'Comida', id: 3 }),
                    restaurantInfo: restaurant
                }))
                const { data } = await client.post('/api/games/challenge/customChallenge/create', { ...otherStore, betSettings: JSON.stringify({ value: restaurant.name, type: 'Restaurant', id: 3 }), restaurantInfo: restaurant })
                navigation.navigate('custom-challenge-page', { color: route?.params?.color, game: route?.params?.game, gameId: data.d.gameId })
                break;
            }
            default: {
                dispatch(updateBeat({
                    betSettings: null
                }))
                dispatch(updateOther({
                    betSettings: null
                }));
                navigation.navigate('Dashboard');
                break;
            }
        }
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            <View
                style={styles.imgBox}
            >
                <ImageBackground
                    source={{ uri: restaurant?.imageLink }}
                    resizeMode="cover"
                    style={styles.logo}
                    imageStyle={{ borderRadius: 15 }}
                >
                    {restaurant.coupons.length ? (
                        <View style={styles.discountBox}>
                            <Text style={styles.discountText}>-{restaurant.coupons[0].discount}%</Text>
                        </View>
                    ) : null}
                    <View style={{
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                        <Text style={styles.restaurantTitle}>{restaurant.name}</Text>
                        <View
                            style={styles.restaurantSubTitleBox}
                        >
                            <Text style={styles.restaurantSubTitle}>{
                                restaurant.offers[0]?.name
                            }</Text>
                        </View>
                    </View>
                </ImageBackground>
            </View>
        </TouchableOpacity >
    );
};

const styles = StyleSheet.create({
    logo: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        // remove width and height to override fixed static size
    },
    imgBox: {
        width: Dimensions.get('window').width - 45,
        height: 179,
        marginVertical: 10,
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
    },
    discountBox: {
        marginTop: 10,
        marginRight: 10,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 2.5
    },
    discountText: {
        fontSize: 12,
        fontFamily: 'Apercu Pro Blod',
        fontStyle: 'normal',
        fontWeight: '700',
        color: '#108BE3',
    }
});

export default RestaurantBox;