import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Linking, Share, Dimensions } from 'react-native';
import ImgClose from '../../assets/close.svg'
import { Restaurant } from '../../types/index'

import Modal from "react-native-modal";

const RestaurantSilder: React.FC<{ setPanelState: (value: boolean) => void, panelState: any, restaurant: Restaurant, }> = ({ setPanelState, panelState, restaurant }) => {
    const handleClickOrder = async () => {
        switch (restaurant.type) {
            case 'WHITE_BOOKING_SYSTEM': {
                
                break
            }
            case 'WHITE_WEBSITE': {
                try {
                    await Linking.openURL('glovo://app')
                }
                catch (error) {
                    await Linking.openURL(Platform.OS === 'android' ?
                        "https://play.google.com/store/apps/details?id=com.glovo&hl=es_VE&gl=US" :
                        "https://apps.apple.com/es/app/glovo-pide-lo-que-quieras/id951812684"
                    );
                }
                break
            }
            case 'WHITE_ONLY_INFO': {
                // await Linking.openURL('https://www.google.com/')
                // break
                try {
                    await Linking.openURL('glovoapp://app')
                }
                catch (error) {
                    await Linking.openURL(Platform.OS === 'android' ?
                        "https://play.google.com/store/apps/details?id=com.glovo&hl=es_VE&gl=US" :
                        "https://apps.apple.com/es/app/glovo-pide-lo-que-quieras/id951812684"
                    );
                }
                break
            }
            default: {
                console.log(restaurant.type)
                break
            }
        }

    }

    return (
        <Modal
            isVisible={panelState}
            style={{ margin: 0, justifyContent: 'flex-end' }}
            onBackdropPress={() => setPanelState(false)}
        >
            <View style={styles.modalContainer}>
                <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={() => setPanelState(false)}>
                    <ImgClose width={12} height={12} />
                </TouchableOpacity>
                <Text style={{
                    ...styles.textContainer,
                    fontSize: 18,
                    fontWeight: 'bold'
                }}>
                    Restaurante {restaurant.name}
                </Text>
                <Text style={{
                    ...styles.textContainer,
                    fontSize: 15,
                    marginTop: 10
                }}>
                    Te hemos enviado un correo con toda la información y ofertas referente a este reto.
                </Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.buttonActionsLose}
                        onPress={() => handleClickOrder()}
                    >
                        <Text style={{
                            ...styles.textContainer,
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: "#00274E"
                        }}>
                            Reservar
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.buttonActionsWin}
                        onPress={() => setPanelState(false)}
                    >
                        <Text style={{
                            ...styles.textContainer,
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#00443B'
                        }}>
                            Entendido
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        textAlign: 'center',
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
        backgroundColor: '#FFFFFF',
        borderColor: '#108BE3',
        borderWidth: 1,
        width: 332,
        justifyContent: 'center',
        borderRadius: 100,
        alignItems: 'center',
        padding: 15,
    },
    buttonActionsLose: {
        width: 332,
        justifyContent: 'center',
        backgroundColor: '#108BE3',
        borderRadius: 100,
        borderColor: '#108BE3',
        borderWidth: 1,
        alignItems: 'center',
        padding: 15,
        marginBottom: 10
    },
});

export default RestaurantSilder;