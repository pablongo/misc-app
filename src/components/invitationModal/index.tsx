import numbro from 'numbro';
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import CustomButton from '../customButton';
import ImgReto from '../../assets/tres_en_raya.svg'
import ImgTrivoo from '../../assets/trivoo.svg'
import client from '../../../client';
import { getData } from '../../utils';

const InvitationModal: React.FC<{
    data?: any,
    navigation: any,
    setOpenModal: any
}> = ({ data, navigation, setOpenModal }) => {
    const gameMatch = data?.gameMatch ? JSON.parse(data?.gameMatch || '') : {};
    const gameInfo = gameMatch?.game ? JSON.parse(gameMatch?.game || '') : {}
    const betSettings = gameMatch?.betSettings ? JSON.parse(gameMatch?.betSettings || '') : {}
    const friends = gameMatch?.friends ? JSON.parse(gameMatch?.friends || '') : {}

    const handleAcceptGame = async () => {
        switch (gameInfo?.type) {
            case 'trivoo': {
                setOpenModal(false);
                navigation.navigate('LoadGamematch', { gamematchId: gameMatch.gamematchId });
                break;
            }
            case 'customChallenge': {
                const body = {
                    title: gameInfo?.value,
                    gameId: gameMatch.gamematchId,
                    friends: friends,
                    betSettings
                }
                client.post('/api/games/challenge/customChallenge/accepted', body)
                setOpenModal(false);
                break;
            }
            default: {
                setOpenModal(false);
                break;
            }
        }
    }

    const onClose = async () => {
        const user = await getData('user')
        switch (gameInfo?.type) {
            case 'trivoo': {
                client.post('/api/games/questions/rejected', { ...gameMatch, userId: user.id, betSettings: gameMatch?.betSettings, friends: friends })
                setOpenModal(false);
                break;
            }
            case 'customChallenge': {
                client.post('/api/games/challenge/customChallenge/rejected', { ...gameMatch, userId: user.id, betSettings: gameMatch?.betSettings, friends: friends })
                setOpenModal(false);
                break;
            }
            default: {
                setOpenModal(false);
                break;
            }
        }
    }

    return (
        <View style={styles.modalContent}>
            <View style={styles.contentView}>
                {gameInfo?.type === 'trivoo' ? (
                    <ImgTrivoo width={68} height={68} />
                ) : null}
                {gameInfo?.type === 'customChallenge' ? (
                    <ImgReto width={68} height={68} />
                ) : null}
                <Text style={styles.textTitle}>{gameMatch?.title}</Text>
                <Text style={{ ...styles.textTitle, fontSize: 30, marginTop: 20 }}>{gameInfo?.value}</Text>
                {betSettings?.type === 'Economic' ? (
                    <Text style={{ ...styles.textTitle, fontSize: 15, marginTop: 20 }}> Entrada de {numbro(betSettings.value).format({ trimMantissa: true, mantissa: 2 })}€ por jugador</Text>
                ) : (
                    <View>
                        <Text style={{ ...styles.textTitle, fontSize: 15, marginTop: 20 }}>¿Qué hay en juego?</Text>
                        <Text style={{ ...styles.textTitle, fontSize: 15, marginTop: 5 }}>{betSettings.value}</Text>
                    </View>
                )}
                <Text style={{ ...styles.textTitle, fontSize: 12, marginTop: 5 }}>{friends?.length} jugadores</Text>
            </View>
            <View style={styles.buttons}>
                <CustomButton onPress={onClose} style={{ ...styles.rejectButton, backgroundColor: gameMatch?.color === 'green' ? '#0CC482' : '#E2F4F8' }}>
                    <Text style={styles.rejectText}>Rechazar</Text>
                </CustomButton>
                <CustomButton onPress={handleAcceptGame} style={{ ...styles.acceptButton, backgroundColor: gameMatch?.color === 'green' ? '#00443B' : '#108BE3' }}>
                    <Text style={{ ...styles.acceptText, color: gameMatch?.color === 'green' ? '#FFFFFF' : "#00443B" }}>Aceptar</Text>
                </CustomButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    modalContent: {
        width: '100%',
        height: '100%',
        padding: 35,
        backgroundColor: '#FFFFFF',
        display: 'flex',
        flexDirection: "column",
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconTrivoo: {
        width: 68,
        height: 68,
        marginTop: 30
    },
    textTitle: {
        color: '#00443B',
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
        fontWeight: '500',
        fontSize: 20,
        marginTop: 30,
        textAlign: "center"
    },
    textDescription: {
        fontSize: 30,
        marginTop: 30,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    textEntry: {
        fontSize: 15,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    textPlayerCount: {
        fontSize: 12,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    acceptButton: {
        height: 51,
        width: 332,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#108BE3',
        borderRadius: 100,
    },
    buttons: {
        marginTop: Dimensions.get('window').height - 700
    },
    acceptText: {
        color: '#00443B',
        fontFamily: 'Apercu Pro Bold',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 15,
        lineHeight: 20,
    },
    rejectButton: {
        marginBottom: 20,
        width: 332,
        height: 51,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E2F4F8',
        borderRadius: 100,
    },
    rejectText: {
        color: '#00443B',
        fontFamily: 'Apercu Pro Bold',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: 15,
        lineHeight: 20,
    },
    amount: {
        fontFamily: 'Laurel',
        fontSize: 90,
        color: '#00443B',
    },
    contentView: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
})

export default InvitationModal; 