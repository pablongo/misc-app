import React from 'react';
import { useStore } from 'react-redux';
import { SafeAreaView, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import ImgReto from '../../../assets/retoWhite.svg'
import numbro from 'numbro';
import client from '../../../../client';
import { getData } from '../../../utils';

const CustomChallengePage: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const store = useStore()
    const otherGame = store.getState().otherGame
    const betSettings = otherGame !== undefined ? JSON.parse(otherGame.betSettings) : {}
    const gameInfo = JSON.parse(otherGame?.game)
    const gamematchId = route?.params?.gameId


    const cancelChallenge = async () => {
        const user = await getData('user')
        client.post('/api/games/challenge/customChallenge/rejected', {
            gamematchId, userId: user.id, betSettings: otherGame.betSettings, friends: otherGame?.friends
                .map((item: any) => { return { id: item.user.id } })
        })
        navigation.navigate('Dashboard')
    }

    return (
        <SafeAreaView style={styles.resultView}>
            <View style={styles.container}>
                <View style={styles.contentView}>
                    {gameInfo?.type === 'customChallenge' ? (
                        <ImgReto width={68} height={68} />
                    ) : null}
                    <Text style={styles.title}>Reto enviado:</Text>
                    <Text style={{ ...styles.title, fontSize: 30, marginTop: 22  }}>{gameInfo?.value}</Text>
                    {betSettings.type === 'Economic' ? (
                        <Text style={{ ...styles.title, fontSize: 15, marginTop: 21  }}>{`Entrada de ${numbro((betSettings?.value / otherGame?.friends?.length)).format({ trimMantissa: true, mantissa: 2 })}€ por jugador`}</Text>
                    ) : (
                        <View>
                            <Text style={{ ...styles.title, fontSize: 15, marginTop: 21  }}>¿Qué hay en juego?</Text>
                            <Text style={{ ...styles.title, fontSize: 15, marginTop: 5  }}>{betSettings.value}</Text>
                        </View>
                    )}
                    <Text style={{ ...styles.title, fontSize: 12, marginTop: 5 }}>{otherGame?.friends?.length} jugadores</Text>
                </View>
                <View>
                    <TouchableOpacity
                        style={[styles.buttonActions, { marginTop: 8 }]}
                        onPress={() => cancelChallenge()}
                    >
                        <Text style={styles.textButton}>Anular reto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.buttonActions, { marginTop: 8, backgroundColor: '#00443B' }]}
                        onPress={() => navigation.navigate('Dashboard')}
                    >
                        <Text style={{ ...styles.textButton, color: "#ffffff" }}>Volver a laurel Gaming</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    resultView: {
        flex: 1,
        backgroundColor: '#0bc481',
    },
    scrollView: {
        minHeight: '100%',
        flex: 1
    },
    buttonActions: {
        backgroundColor: '#0bc481',
        width: 332,
        justifyContent: 'center',
        borderRadius: 100,
        alignItems: 'center',
        padding: 15,
        borderColor: "#00443B",
        borderWidth: 1
    },
    textButton: {
        color: '#00274E',
        fontSize: 15,
        fontFamily: 'Apercu Pro Bold',
        fontStyle: 'normal',
        fontWeight: '700',
        lineHeight: 20,
        textAlign: "center",
    },
    container: {
        flex: 1,
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,

    },
    contentView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 20,
        marginTop: 30,
        color: '#00443B',
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
        fontWeight: '500',
        textAlign: "center"
    },
});

export default CustomChallengePage;