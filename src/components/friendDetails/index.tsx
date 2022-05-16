import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, SafeAreaView, Platform, Alert, StatusBar } from 'react-native';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import ImgPlus from '../../assets/plus.svg'
import ImgClose from '../../assets/close.svg'
import PaymentSlider from '../paymentSilder/index'
import LastGame from '../lastGame'
import { useAxios, useAxiosMutation } from '../../../client';
import Modal from "react-native-modal";
import CustomButton from '../customButton';

const FriendDetails: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const friend = route.params
    const { loading, error, data, refetch }: any = useAxios(`api/auth/friendsDetails/`, 'post', JSON.stringify({ friendId: friend?.user?.id }));

    const [skipIndex, setSkipIndex] = useState(3)
    const [openModal, setOpenModal] = useState(false);
    const [panelState, setPanelState]: any = useState(false)
    const [recordData, setRecordData]: any = useState({
        earned: 0,
        wins: 0,
        games: 0,
        record: []
    })

    const [records, setRecords]: any = useState([])
    const handleClick = () => {
        const newIndex = skipIndex + 3
        setRecords(data?.record.flatMap((item: any, index: any) => {
            if (index < newIndex) {
                return item
            }
            return []
        }))
        setSkipIndex(newIndex)
    }

    const handleClickMacht = () => {
        navigation.navigate('challengeFriend', friend)
    }

    const handleRefetch = () => {
        refetch()
    }

    useEffect(() => {
        if (!loading) {
            const recordData = data?.record?.reverse().flatMap((item: any, index: any) => {
                if (index < 3) {
                    return item
                }
                return []
            })
            setRecords(recordData)
            setRecordData({
                wins: data?.wins === undefined ? 0 : data?.wins,
                earned: data?.earned === undefined ? 0 : data?.earned,
                games: data?.games === undefined ? 0 : data?.games,
                record: data?.record === undefined ? 0 : data?.record
            })
        }
    }, [data, loading])

    const onComplete = (response: any) => {
        if (response.data.success) navigation.navigate('Amigos', { deleteFriend: true });
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

    const [handleMutation, { loading: loadingAccept }] = useAxiosMutation('/api/auth/deleteFriend', {
        onComplete,
        onError
    });

    const handleDeleteFriend = () => {
        handleMutation({ idFriend: friend?.user?.id })
    }

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            {(Platform.OS === 'android' && openModal) && <StatusBar backgroundColor={'rgba(0, 0, 0, 0.7)'} barStyle={'light-content'}></StatusBar>}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
                    <ImgArrowBack width={12} height={10} />
                </TouchableOpacity>
                {friend?.user?.name ? (
                    <View>
                        <Text style={{
                            ...styles.textContainer,
                            fontWeight: 'bold'
                        }}>
                            {friend?.user?.userName}
                        </Text>
                        <Text style={styles.friendName}>{friend.user.name}</Text>
                    </View>
                ) : (
                    <Text style={{
                        ...styles.textContainer,
                        fontWeight: 'bold'
                    }}>
                        {friend?.user?.userName}
                    </Text>
                )}
                <TouchableOpacity onPress={() => setOpenModal(true)} style={{ marginLeft: 'auto' }}>
                    <Text style={{
                        color: '#F8534B',
                        fontFamily: 'Apercu Pro Medium',
                        fontWeight: '700',
                        fontStyle: 'normal',
                    }}>
                        Eliminar
                    </Text>
                </TouchableOpacity>
                <Modal
                    isVisible={openModal}
                    style={styles.bottomModal}
                    onBackdropPress={() => setOpenModal(false)}>
                    <View style={styles.modalContainer}>
                        <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setOpenModal(false)}>
                            <ImgClose width={12} height={12} />
                        </TouchableOpacity>
                        <Text style={styles.textDeleteFriend}>
                            Eliminar amigo
                        </Text>
                        <Text style={styles.textContentDeleteFriend}>
                            ¿Seguro que desea eliminar a {friend?.user?.userName} de
                        </Text>
                        <Text style={styles.textContentDeleteFriend}>
                            tu lista de amigos? Ya no podrás jugar más
                        </Text>
                        <Text style={styles.textContentDeleteFriend}>
                            partidas contra él.
                        </Text>
                        <CustomButton onPress={() => setOpenModal(false)} style={styles.buttonContinueFriend}>
                            <Text style={styles.textButtonContinueFriend}>
                                Seguir como amigo
                            </Text>
                        </CustomButton>
                        <CustomButton loading={loadingAccept} onPress={handleDeleteFriend} style={styles.buttonDeleteFriend}>
                            <Text style={styles.textButtonDeleteFriend}>
                                Eliminar amigo
                            </Text>
                        </CustomButton>
                    </View>
                </Modal>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.container}>
                    <View>
                        <View style={styles.resume}>
                            <Text style={{
                                ...styles.textContainer,
                                fontSize: 12,
                            }}>
                                Resumen
                            </Text>
                            <Text style={{
                                ...styles.textContainer,
                                fontSize: 20,
                            }}>
                                Estadísticas
                            </Text>
                            <View style={styles.resumeContainer}>
                                {/* Earned */}
                                <View style={styles.circularContainer}>
                                    <View style={{
                                        ...styles.cirucalResume,
                                        backgroundColor: recordData?.earned > 0 ? '#E9F6ED' : (recordData?.earned < 0 ? '#FAF0F0' : '#F8F8F8'),
                                    }}>
                                        <Text style={{
                                            ...styles.textContainer,
                                            fontSize: 30,
                                            fontWeight: 'bold',
                                            color: recordData?.earned > 0 ? '#0CC482' : (recordData?.earned < 0 ? '#F8534B' : '#00443B')
                                        }}>
                                            {recordData?.earned > 0 ? '+' : ''}{recordData?.earned}€
                                        </Text>
                                    </View>
                                    <Text style={{
                                        ...styles.textContainer,
                                        fontSize: 15,
                                    }}>
                                        Ganancias
                                    </Text>
                                </View>
                                {/* Wins */}
                                <View style={styles.circularContainer}>
                                    <View style={{
                                        ...styles.cirucalResume,
                                        backgroundColor: recordData?.wins > 0 ? '#E9F6ED' : (recordData?.wins < 0 ? '#FAF0F0' : '#F8F8F8'),
                                    }}>
                                        <Text style={{
                                            ...styles.textContainer,
                                            fontSize: 30,
                                            fontWeight: 'bold',
                                            color: recordData?.wins > 0 ? '#0CC482' : (recordData?.wins < 0 ? '#F8534B' : '#00443B')
                                        }}>
                                            {recordData?.wins > 0 ? '+' : ''}{recordData?.wins}
                                        </Text>
                                    </View>
                                    <Text style={{
                                        ...styles.textContainer,
                                        fontSize: 15,
                                    }}>
                                        Victorias
                                    </Text>
                                </View>
                                {/* Games */}
                                <View style={styles.circularContainer}>
                                    <View style={{
                                        ...styles.cirucalResume
                                    }}>
                                        <Text style={{
                                            ...styles.textContainer,
                                            fontSize: 30,
                                            fontWeight: 'bold',
                                            color: '#00443B'
                                        }}>
                                            {recordData?.games}
                                        </Text>
                                    </View>
                                    <Text style={{
                                        ...styles.textContainer,
                                        fontSize: 15,
                                    }}>
                                        Partidas
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={styles.record}>
                        <Text style={{
                            ...styles.textContainer,
                            fontSize: 12,
                        }}>
                            Historial de
                        </Text>
                        <Text style={{
                            ...styles.textContainer,
                            fontSize: 20,
                        }}>
                            Últimas partidas
                        </Text>
                        <View >
                            {records?.map((match: any, index: any) => {
                                return (
                                    <LastGame match={match} key={index} friendId={friend?.user?.id} refetch={handleRefetch} />
                                )
                            })}
                        </View>
                        {records?.length !== recordData?.record?.length ? (
                            <TouchableOpacity
                                onPress={() => handleClick()}
                                style={styles.singleRecordContainer}
                            >
                                <View style={styles.singleRecord}>
                                    <View style={{
                                        ...styles.singleCirculeRecord,
                                        backgroundColor: '#F8F8F8'
                                    }}>
                                        <ImgPlus width={9} height={9} />
                                    </View>
                                    <Text style={{
                                        ...styles.textContainer,
                                        fontSize: 15,
                                    }}>
                                        Ver más
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.buttonActions}
                            onPress={() => setPanelState(true)}
                        >
                            <Text style={{
                                ...styles.textContainer,
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: '#00443B'
                            }}>
                                Reclamar
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                ...styles.buttonActions,
                                backgroundColor: '#00443B',
                                marginTop: 10
                            }}
                            onPress={() => handleClickMacht()}
                        >
                            <Text style={{
                                ...styles.textContainer,
                                fontSize: 15,
                                fontWeight: 'bold',
                                color: "#FFFFFF"
                            }}>
                                Retar
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
            <PaymentSlider setPanelState={setPanelState} panelState={panelState} iWin={true} earned={recordData?.earned} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContainer: {
        backgroundColor: 'white',
        padding: 32,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    textDeleteFriend: {
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
        fontWeight: '700',
        color: '#00443B',
        marginTop: 30,
        marginBottom: 20,
        fontSize: 18,
    },
    textContentDeleteFriend: {
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 15,
        color: '#00443B',
        lineHeight: 24
    },
    buttonContinueFriend: {
        marginTop: 30,
        width: 325,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#00443B',
    },
    textButtonContinueFriend: {
        fontFamily: 'Apercu Pro Medium',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: '700',
        color: '#00443B',
    },
    buttonDeleteFriend: {
        marginTop: 10,
        width: 325,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#F8534B',
    },
    textButtonDeleteFriend: {
        fontFamily: 'Apercu Pro Medium',
        fontSize: 15,
        fontStyle: 'normal',
        fontWeight: '700',
        color: '#FFFFFF',
    },
    header: {
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderColor: "#EAEAEA",
        borderBottomWidth: 1
    },
    arrowBack: {
        width: 12,
        height: 10,
    },
    container: {
        flex: 1,
        backgroundColor: 'white',
        display: "flex",
        flexDirection: 'column',
        justifyContent: "space-between",
        paddingBottom: 20,
    },
    circleBack: {
        width: 16,
        height: 30,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#FFFF'
    },
    textContainer: {
        fontFamily: 'Apercu Pro',
        fontWeight: 'normal',
        color: '#00443B',
        fontSize: 15,
    },
    friendName: {
        color: '#CECECE',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
        marginTop: Platform.OS === 'ios' ? 2 : 0,
        fontSize: Platform.OS === 'ios' ? 12 : 10,
    },
    resume: {
        padding: 20,
    },
    resumeContainer: {
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignContent: 'center',
        paddingVertical: 20,
        borderColor: "#EAEAEA",
        borderBottomWidth: 1,
    },
    cirucalResume: {
        minWidth: 102,
        height: 102,
        padding: 10,
        borderRadius: 100,
        display: "flex",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#F8F8F8'
    },
    circularContainer: {
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
    },
    record: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1,
    },
    singleRecordContainer: {
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-between",
        alignContent: 'center',
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
    buttonContainer: {
        width: '100%',
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignContent: "center",
        alignItems: 'center',
    },
    buttonActions: {
        backgroundColor: '#0CC482',
        width: 332,
        justifyContent: 'center',
        borderRadius: 100,
        alignItems: 'center',
        padding: 15,
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
    }
});

export default FriendDetails;