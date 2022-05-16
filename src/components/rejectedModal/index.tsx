import numbro from 'numbro';
import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import CustomButton from '../customButton';
import ImgReto from '../../assets/tres_en_raya.svg'
import ImgTrivoo from '../../assets/trivoo.svg'
import { CATEGORIES_COMPONENT_MODES } from '../../screens/games/preguntados/Categories';
import { logEvent } from '../../utils/Amplitude';

const RejectedModal: React.FC<{
    data?: any,
    navigation: any,
    setOpenModal: any
}> = ({ data, navigation, setOpenModal }) => {
    const gameMatch = data?.gameMatch ? JSON.parse(data?.gameMatch || '') : {};
    const gameInfo = gameMatch?.game ? JSON.parse(gameMatch?.game || '') : {}

    const handleRemacht = async () => {
        logEvent("CHALLENGE_AGAIN", { type: gameInfo?.type });
        switch (gameInfo?.type) {
            case 'trivoo': {
                navigation.navigate('Preguntados-Categories', {
                    mode: CATEGORIES_COMPONENT_MODES.CHALLENGE,
                    game: "trivoo"
                })
                setOpenModal(false);
                break;
            }
            case 'customChallenge': {
                navigation.navigate('custom-challenge', { game: 'customChallenge' })
                setOpenModal(false);
                break;
            }
        }
    }

    const handleClose = () => {
        navigation.navigate('Dashboard')
        setOpenModal(false);
    }
    
    return (
        <View style={{ ...styles.modalContent, backgroundColor: gameMatch?.color === 'green' ? '#e9f6ed' : '#E2F4F8' }}>
            <View style={styles.contentView}>
                {gameInfo?.type === 'trivoo' ? (
                    <ImgTrivoo width={68} height={68} />
                ) : null}
                {gameInfo?.type === 'customChallenge' ? (
                    <ImgReto width={68} height={68} />
                ) : null}
                <Text style={styles.textTitle}>¡Rechazado!</Text>
                <Text style={{...styles.textTitle, marginTop: 20}}>{gameMatch?.title}</Text>
            </View>
            <View style={styles.buttons}>
                <CustomButton onPress={handleRemacht} style={{ ...styles.rejectButton, backgroundColor: gameMatch?.color === 'green' ? '#0CC482' : '#108BE3' }}>
                    <Text style={styles.rejectText}>Volver a retar</Text>
                </CustomButton>
                <CustomButton onPress={handleClose} style={{ ...styles.acceptButton, backgroundColor: gameMatch?.color === 'green' ? '#00443B' : '#1F3738' }}>
                    <Text style={{ ...styles.acceptText, color: '#FFFFFF' }}>Volver a Laurel Gaming</Text>
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
        fontSize: 20,
        marginTop: 34,
        color: '#00443B',
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
        fontWeight: '500',
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

export default RejectedModal; 