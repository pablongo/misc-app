import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useWindowDimensions
} from 'react-native';
import ImgTrivoo from '../../assets/trivoo.svg'
import ImgEscacs from '../../assets/escacs.svg'
import ImgParchiis from '../../assets/parchiis.svg'
import ImgBillar from '../../assets/billar.svg'
import ImgMinigols from '../../assets/minigols.svg'
import ImgMotos from '../../assets/motos.svg'
import ImgFutbol from '../../assets/futbol.svg'
import ImgReto from '../../assets/tres_en_raya.svg'
import ImgPorra from '../../assets/money.svg'
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { getData } from '../../utils';
import { CATEGORIES_COMPONENT_MODES } from "../../screens/games/preguntados/Categories"
import { logEvent } from '../../utils/Amplitude';

const GamesTabView: React.FC<{ navigation: any, openModal: any, openModal2: any, route: any }> = ({ navigation, openModal, openModal2, route }) => {
    const friend = route.params
    const layout = useWindowDimensions();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Laurel' },
        { key: 'second', title: 'Otros' },
    ]);

    const handleNavegationTrivoo = async () => {
        if (route.name === 'challengeFriend') {
            const user = await getData('user')
            navigation.navigate('Preguntados-Categories', {
                game: 'trivoo',
                mode: CATEGORIES_COMPONENT_MODES.CHALLENGE,
                rematch: true,
                friends: [
                    {
                        id: friend.id,
                        status: 1,
                        user: {
                            id: friend.user.id,
                            name: friend.user.name
                        }
                    },
                    {
                        id: friend.id + 1,
                        status: 1,
                        user: {
                            id: user.id,
                            name: user.userName
                        }
                    },
                ]
            })
        } else {
            logEvent("TRIVOO_EVENT");
            navigation.navigate('Preguntados', { game: 'trivoo' });
        }
    }

    const handleNavegationCustomChallenge = async () => {
        if (route.name === 'challengeFriend') {
            const user = await getData('user')
            logEvent("CUSTOM_CHALLENGE_EVENT");
            navigation.navigate('custom-challenge', {
                game: 'customChallenge',
                rematch: true,
                friends: [
                    {
                        id: friend.id,
                        status: 1,
                        user: {
                            id: friend.user.id,
                            name: friend.user.name
                        }
                    },
                    {
                        id: friend.id + 1,
                        status: 1,
                        user: {
                            id: user.id,
                            name: user.userName
                        }
                    },
                ]
            })
        } else {
            navigation.navigate('custom-challenge', { game: 'customChallenge' })
        }
    }

    const FirstRoute = () => (
        <ScrollView>
            <View style={styles.gameContainer}>
                {laurel.map(game => (
                    <TouchableOpacity onPress={game.action} key={game.id} style={{ ...styles.card, backgroundColor: game.color }}>
                        {game.soon ? (
                            <View style={{ flexDirection: 'row-reverse', margin: 10 }}>
                                <View style={styles.viewSoon}>
                                    <Text style={styles.textSoon}>SOON</Text>
                                </View>
                            </View>
                        ) : <View style={{ margin: 18 }} />}
                        <View style={styles.cardContent}>
                            {game.name === 'Trivoo' ? (
                                <ImgTrivoo width={68} height={68} />
                            ) :
                                game.name === 'Ajedrez' ? (
                                    <ImgEscacs width={68} height={68} />
                                ) : (
                                    <ImgParchiis width={68} height={68} />
                                )
                            }
                            <Text style={styles.gameName}>{game.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const SecondRoute = () => (
        <ScrollView>
            <View style={styles.gameContainer}>
                {others.map(game => (
                    <TouchableOpacity onPress={game.action} key={game.id} style={{ ...styles.card, backgroundColor: game.color }}>
                        {game.soon ? (
                            <View style={{ flexDirection: 'row-reverse', margin: 10 }}>
                                <View style={styles.viewSoon}>
                                    <Text style={styles.textSoon}>SOON</Text>
                                </View>
                            </View>
                        ) : <View style={{ margin: 18 }} />}
                        <View style={styles.cardContent}>
                            {game.id === 1 ? (
                                <ImgReto width={68} height={68} />
                            ) : null}
                            {game.id === 2 ? (
                                <ImgBillar width={68} height={68} />
                            ) : null}
                            {game.id === 3 ? (
                                <ImgPorra width={68} height={68} />
                            ) : null}
                            {game.id === 4 ? (
                                <ImgFutbol width={68} height={68} />
                            ) : null}
                            {game.id === 5 ? (
                                <ImgMotos width={68} height={68} />
                            ) : null}
                            {game.id === 6 ? (
                                <ImgMinigols width={68} height={68} />
                            ) : null}

                            <Text style={styles.gameName}>{game.name}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </ScrollView>
    );

    const renderTabBar = (props: any) => {
        const activeItem = routes[props?.navigationState?.index];
        return (
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: '#00443B' }}
                style={{ backgroundColor: 'white' }}
                tabStyle={{ width: 100 }}
                renderLabel={({ route }) => (
                    <Text style={{
                        ...styles.questionTitleContainer,
                        fontSize: 15,
                        fontWeight: activeItem.title === route.title ? "700" : "400",
                    }}>
                        {route.title}
                    </Text>
                )}
            />
        );
    };

    const renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });


    const laurel = [
        {
            id: 1,
            name: 'Trivoo',
            color: '#E2F4F8',
            soon: false,
            action: () => handleNavegationTrivoo(),
        },
        {
            id: 2,
            name: 'Ajedrez',
            color: '#FAF3ED',
            soon: true,
            action: openModal,
        },
        {
            id: 3,
            name: 'Parchís',
            color: '#E9F6ED',
            soon: true,
            action: openModal,
        },
    ];

    const others = [
        {
            id: 1,
            name: 'Reto personal',
            color: '#BEF6D0',
            soon: false,
            action: () => handleNavegationCustomChallenge(),
        },
        {
            id: 2,
            name: 'Padel',
            color: '#E2F4F8',
            soon: true,
            action: openModal2,
        },
        {
            id: 3,
            name: 'Porras',
            color: '#FAF0F0',
            soon: true,
            action: openModal2,
        },
        {
            id: 4,
            name: 'Fútbol',
            color: '#FAF3ED',
            soon: true,
            action: openModal2,
        },
        {
            id: 5,
            name: 'Karting',
            color: '#E2F4F8',
            soon: true,
            action: openModal2,
        },
        {
            id: 6,
            name: 'Golf',
            color: '#E9F6ED',
            soon: true,
            action: openModal2,
        },
    ];

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            initialLayout={{ width: layout.width }}
            renderTabBar={renderTabBar}
        />
    );
};

const styles = StyleSheet.create({
    gameContainer: {
        margin: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    card: {
        width: '48%',
        height: 179,
        borderRadius: 15,
        marginBottom: 10,
    },
    cardContent: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewSoon: {
        backgroundColor: '#0CC482',
        width: 46,
        padding: 2,
        alignItems: 'center',
        borderRadius: 100,
    },
    textSoon: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    questionTitleContainer: {
        fontSize: 15,
        color: '#00443B',
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
    },
    gameName: {
        marginTop: 20,
        color: '#00443B',
        fontSize: 15,
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
});

export default GamesTabView;