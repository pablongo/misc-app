import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';
import ImgFingerDown from '../../assets/fingerDown.svg'
import ImgFingerUp from '../../assets/fingerUp.svg'
import ImgQuestionMarks from '../../assets/questionMarks.svg'
import ImgClose from '../../assets/close.svg'
import Modal from "react-native-modal";
import moment from 'moment';
import 'moment/locale/es';
import client from '../../../client';
import { getData } from '../../utils';

const LastGame: React.FC<{ match: any, friendId: string, refetch: any }> = ({ match, friendId, refetch }) => {
    const [openModal, setOpenModal] = useState(false)
    const [iWin, setIWin]: any = useState(match.win === 'unKnow' ? 'unKnow' : match.win)

    const handleUpdateRecord = async (result: boolean) => {
        const user = await getData('user')
        const body = {
            gamematchId: match?.gamematchId,
            iWin: result,
            userId: user.id, 
            economic: match.betSetting.type === 'Economic' ? true : false,
            friendId
        }
        await client.post('/api/games/challenge/customChallenge/updated', body)
        setIWin(result)
        refetch()
    }

    return (
        <View style={styles.singleRecordContainer} >
            <View style={styles.singleRecord}>
                <View style={{
                    ...styles.singleCirculeRecord,
                    backgroundColor: iWin ? '#E9F6ED' : '#FAF0F0'
                }}>
                    {iWin === true ? (
                        <ImgFingerUp width={16} height={14} />
                    ) : null}
                    {iWin === false ? (
                        <ImgFingerDown width={16} height={14} />
                    ) : null}
                    {iWin === 'unKnow' ? (
                        <ImgQuestionMarks width={16} height={14} />
                    ) : null}
                </View>
                <View style={styles.container}>
                    <Text style={{
                        ...styles.textContainer,
                        fontSize: 15,
                    }}>
                        {iWin === 'unKnow' ? '' : (iWin === true ? "Victoria en " : "Derrota en ")}{match.gameType?.charAt(0)?.toUpperCase() + match.gameType?.slice(1)?.toLocaleLowerCase()}{' '}
                    </Text>
                    {match.gameType === 'Reto personalizado' ? (
                        <TouchableOpacity onPress={() => setOpenModal(true)}>
                            <Text style={styles.textInfo}>
                                +info
                            </Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
            <View style={styles.singleRecord}>
                {iWin !== 'unKnow' ?
                    match.betSetting.type === 'Economic' ? (
                        <Text style={{
                            ...styles.textContainer,
                            fontSize: 15,
                        }}>
                            {match.betSetting.value}€
                        </Text>
                    ) : (
                        <Text style={{
                            ...styles.textContainer,
                            fontSize: 15,
                        }}>
                            •••
                        </Text>
                    )
                    : (
                        <View style={styles.unKnow}>
                            <TouchableOpacity
                                style={{ ...styles.unKnowBox, borderColor: '#0CC482' }}
                                onPress={() => handleUpdateRecord(true)}
                            >
                                <ImgFingerUp width={16} height={14} />
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{ ...styles.unKnowBox, borderColor: '#F8534B', marginLeft: 10 }}
                                onPress={() => handleUpdateRecord(false)}
                            >
                                <ImgFingerDown width={16} height={14} />
                            </TouchableOpacity>
                        </View>
                    )}
            </View>
            <Modal
                isVisible={openModal}
                style={styles.bottomModal}
                onBackdropPress={() => setOpenModal(false)}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setOpenModal(false)}>
                        <ImgClose width={12} height={12} />
                    </TouchableOpacity>
                    <Text style={{
                        ...styles.textContainer,
                        fontSize: 18,
                        fontWeight: 'bold'
                    }}>
                        Reto personalizado
                    </Text>
                    <Text style={{
                        ...styles.textContainer,
                        fontSize: 15,
                        marginTop: 10
                    }}>
                        Reto "{match.title}" el {moment(match.createAt).format('DD')} de {moment(match.createAt).format('MMMM')} de {moment(match.createAt).format('YYYY')}. {iWin === 'unKnow' ? '¿Cuál fue el resultado?' : ''}
                    </Text>
                    {iWin === 'unKnow' ? (
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.buttonActionsLose}
                                onPress={() => handleUpdateRecord(false)}
                            >
                                <Text style={{
                                    ...styles.textContainer,
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: "#F8534B"
                                }}>
                                    Derrota
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.buttonActionsWin}
                                onPress={() => handleUpdateRecord(true)}
                            >
                                <Text style={{
                                    ...styles.textContainer,
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#00443B'
                                }}>
                                    ¡Victoria!
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ) : null}
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        fontFamily: 'Apercu Pro',
        fontWeight: 'normal',
        color: '#00443B',
        fontSize: 15,
    },
    singleRecordContainer: {
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignContent: 'center',
        alignItems: 'center',
        paddingVertical: 10
    },
    singleRecord: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignContent: "center",
        alignItems: 'center',
    },
    singleCirculeRecord: {
        width: 38,
        height: 38,
        borderRadius: 100,
        display: "flex",
        flexDirection: 'row',
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
        marginRight: 10
    },
    unKnow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    unKnowBox: {
        height: 38,
        width: 38,
        borderRadius: 100,
        borderWidth: 1,
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
    },
    textInfo: {
        fontFamily: 'Apercu Pro',
        fontWeight: 'normal',
        color: '#00443B',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    buttonContainer: {
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
        marginTop: 20
    },
    buttonActionsWin: {
        backgroundColor: '#0CC482',
        width: 332,
        justifyContent: 'center',
        borderRadius: 100,
        alignItems: 'center',
        padding: 15,
    },
    buttonActionsLose: {
        width: 332,
        justifyContent: 'center',
        borderRadius: 100,
        borderColor: '#F8534B',
        borderWidth: 1,
        alignItems: 'center',
        padding: 15,
        marginBottom: 10
    },
});

export default LastGame;