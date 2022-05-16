import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, SafeAreaView, Switch } from 'react-native';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import ImgSound from '../../assets/sound.svg'
import ImgMusic from '../../assets/music.svg'
import { getData, storeData } from '../../utils';
import client from '../../../client';

const MusicAndNotifications: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [isSoundEnabled, setIsSoundEnabled] = useState(false);
    const [isMusicEnabled, setIsMusicEnabled] = useState(false);
    const [user, setUser] = useState({});

    const handleClickMusic = async () => {
        const newUserData = { ...user, music: !isMusicEnabled }
        const body = {
            type: 'music',
            value: !isMusicEnabled
        }
        setIsMusicEnabled(!isMusicEnabled)
        await client.post('/api/auth/updateUserSound', body)
        await storeData(newUserData, 'user');
    }

    const handleClickSound = async () => {
        const newUserData = { ...user, sound: !isSoundEnabled }
        const body = {
            type: 'sound',
            value: !isSoundEnabled
        }
        setIsSoundEnabled(!isSoundEnabled)
        await client.post('/api/auth/updateUserSound', body)
        await storeData(newUserData, 'user');
    }

    useEffect(() => {
        const myFunction = async () => {
            const user = await getData('user')
            setUser(user)
            setIsSoundEnabled(user.sound)
            setIsMusicEnabled(user.music)
        }
        myFunction()
    }, [])

    return (
        <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
                    <ImgArrowBack width={12} height={10} />
                </TouchableOpacity>
                <Text style={{
                    ...styles.textContainer,
                    fontWeight: 'bold'
                }}
                >{`Música & Notificaciones`}</Text>
            </View>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View style={styles.container}>
                    <Text style={{
                        ...styles.textContainer,
                        fontWeight: "500",
                        fontSize: 20
                    }}
                    >{`Decide lo que quieres escuchar`}</Text>
                    <View style={styles.optionsContainer}>
                        <View style={styles.option}>
                            <View style={{
                                ...styles.option,
                                width: 'auto'
                            }}>
                                <ImgSound width={14} height={12} />
                                <Text style={{
                                    ...styles.textContainer,
                                    marginLeft: 10
                                }}
                                >
                                    {`Sonido`}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#BEF6D0", true: "#47ed7d" }}
                                thumbColor={isSoundEnabled ? "#0CC482" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => handleClickSound()}
                                value={isSoundEnabled}
                            />
                        </View>
                        <View style={styles.option}>
                            <View style={{
                                ...styles.option,
                                width: 'auto'
                            }}>
                                <ImgMusic width={14} height={12} />
                                <Text style={{
                                    ...styles.textContainer,
                                    marginLeft: 10
                                }}
                                >
                                    {`Música de fondo`}
                                </Text>
                            </View>
                            <Switch
                                trackColor={{ false: "#BEF6D0", true: "#47ed7d" }}
                                thumbColor={isMusicEnabled ? "#0CC482" : "#f4f3f4"}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => handleClickMusic()}
                                value={isMusicEnabled}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderColor: "#EAEAEA",
        borderBottomWidth: 1
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
    container: {
        flex: 1,
        backgroundColor: 'white',
        display: "flex",
        flexDirection: 'column',
        padding: 20
    },
    textContainer: {
        fontFamily: 'Apercu Pro Medium',
        fontStyle: 'normal',
        color: '#00443B',
        fontSize: 15,
    },
    optionsContainer: {
        paddingVertical: 20,
        width: '100%',
        display: "flex",
        alignContent: 'center',
        alignItems: 'center',
    },
    option: {
        paddingVertical: 5,
        width: '100%',
        display: "flex",
        flexDirection: 'row',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: "space-between",
    }
});

export default MusicAndNotifications;