import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, SafeAreaView, StatusBar, Platform } from 'react-native';
import ImgClose from '../../assets/close.svg'
import client from '../../../client';
import { getData } from '../../utils';

const Record: React.FC<{ setOpenModal: any }> = ({ setOpenModal }) => {
    const [records, setRecords]: any = useState({})
    useEffect(() => {
        const myFunction = async () => {
            const token = await getData('userToken');
            const user = await client.get('/api/auth/me', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setRecords(user.data)
        }
        myFunction()
    }, [])

    return (
        <SafeAreaView style={{ backgroundColor: '#0CC482' }}>
              {Platform.OS === 'android' && <StatusBar backgroundColor={'#0CC482'} barStyle={'dark-content'}></StatusBar>}
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => setOpenModal(false)} style={styles.circleBack}>
                            <ImgClose width={12} height={12} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.title}>
                        <Text style={styles.titleText}>
                            {records?.userName}
                        </Text>
                    </View>
                    <View>
                        {/* Top Box */}
                        <View style={{
                            ...styles.containerRecord,
                            borderBottomColor: "#00443B",
                            borderBottomWidth: 1,
                            paddingBottom: 20
                        }}>
                            {/* Games */}
                            <View style={{
                                ...styles.individualBox,
                                borderRightColor: "#00443B",
                                borderRightWidth: 1,
                            }}>
                                <View style={styles.cirucalResume}>
                                    <Text style={styles.textContainer}>
                                        {records?.record?.games}
                                    </Text>
                                </View>
                                <Text style={{
                                    ...styles.textContainer,
                                    color: '#00443B',
                                    fontSize: 15,
                                    fontWeight: 'normal',
                                    marginTop: 5
                                }}>
                                    Núm. partidas
                                </Text>
                            </View>
                            {/* wins */}
                            <View style={styles.individualBox}>
                                <View style={styles.cirucalResume}>
                                    <Text style={styles.textContainer}>
                                        {records?.record?.wins}
                                    </Text>
                                </View >
                                <Text style={{
                                    ...styles.textContainer,
                                    color: '#00443B',
                                    fontSize: 15,
                                    fontWeight: 'normal',
                                    marginTop: 5
                                }}>
                                    Victorias
                                </Text>
                            </View>
                        </View>
                        {/* Botton Box */}
                        <View style={{
                            ...styles.containerRecord,
                            marginTop: 20
                        }}>
                            {/* Losses*/}
                            <View style={{
                                ...styles.individualBox,
                                borderRightColor: "#00443B",
                                borderRightWidth: 1,
                            }}>
                                <View style={styles.cirucalResume}>
                                    <Text style={{
                                        ...styles.textContainer,
                                        color: '#F8534B'
                                    }}>
                                        {records?.record?.losses}
                                    </Text>
                                </View>
                                <Text style={{
                                    ...styles.textContainer,
                                    color: '#00443B',
                                    fontSize: 15,
                                    fontWeight: 'normal',
                                    marginTop: 5
                                }}>
                                    Derrotas
                                </Text>
                            </View>
                            {/* Earned */}
                            <View style={styles.individualBox}>
                                <View style={styles.cirucalResume}>
                                    <Text style={{
                                        ...styles.textContainer,
                                        color: records?.record?.earned >= 0 ? "#0CC482" : "#F8534B"
                                    }}>
                                        {records?.record?.earned}€
                                    </Text>
                                </View>
                                <Text style={{
                                    ...styles.textContainer,
                                    color: '#00443B',
                                    fontSize: 15,
                                    fontWeight: 'normal',
                                    marginTop: 5
                                }}>
                                    Total ganacias
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        minHeight: '100%',
        padding: 20,
    },
    header: {
        width: '100%',
        display: "flex",
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    textContainer: {
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
        color: '#0CC482',
        fontSize: 30,
    },
    circleBack: {
        width: 16,
        height: 30,
        marginRight: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        backgroundColor: '#0CC482'
    },
    title: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 50
    },
    titleText: {
        fontFamily: 'Laurel',
        fontSize: 35,
        color: '#00443B',
        textAlign: "center"
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
        backgroundColor: '#E9F6ED'
    },
    containerRecord: {
        display: "flex",
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: "center",
    },
    individualBox: {
        width: '50%',
        display: "flex",
        flexDirection: 'column',
        justifyContent: "center",
        alignItems: "center",
        borderRightColor: "#00443B",
        paddingVertical: 20
    }
});

export default Record;