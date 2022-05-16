import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform, Linking, Share, Dimensions } from 'react-native';
import ImgClose from '../../assets/close.svg'
import ImgWhatsapp from '../../assets/whatsapp.svg'
import ImgBizum from '../../assets/bizum.svg'
import ImgVerse from '../../assets/verse.svg'
import ImgPaypal from '../../assets/paypal_Logo.svg'

import Modal from "react-native-modal";

const PaymentSilder: React.FC<{ setPanelState: Function, panelState: any, iWin: Boolean, earned: number }> = ({ setPanelState, panelState, iWin, earned }) => {
    const handleClickVerse = async () => {
        try {
            await Linking.openURL('verse.me://app')
        }
        catch (error) {
            await Linking.openURL(Platform.OS === 'android' ?
                "https://play.google.com/store/apps/details?id=com.verse&hl=es_419&gl=US" :
                "https://apps.apple.com/es/app/verse-pagos/id1081049286"
            );
        }
    }

    const handleClickPaypal = async () => {
        try {
            await Linking.openURL('paypal://app')
        }
        catch (error) {
            await Linking.openURL(Platform.OS === 'android' ?
                "https://play.google.com/store/apps/details?id=com.paypal.android.p2pmobile&hl=en&gl=US" :
                "https://apps.apple.com/us/app/paypal-send-shop-manage/id283646709"
            );
        }
    }

    const handleClickWhatsapp = async () => {
        try {
            const result = await Share.share({
                message:
                    `Hola! Todavía me debes ${earned}€ por la Victoria. El que paga descansa.`,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error: any) {
            console.log(error.message);
        }
    }

    return (
        <Modal
            isVisible={panelState}
            style={{ margin: 0, justifyContent: 'flex-end' }}
            onBackdropPress={() => setPanelState(false)}
        >
            <View style={styles.panel}>
                <TouchableOpacity
                    style={styles.containerIconClose}
                    onPress={() => setPanelState(false)}
                >
                    <ImgClose width={12} height={12} />
                </TouchableOpacity>
                <Text style={styles.payText}>{iWin ? "Reclamar por..." : "Pagar por..."}</Text>
                <View style={{
                    ...styles.payment,
                    justifyContent: iWin ? 'space-between' : 'flex-start',
                }}>
                    <View style={styles.containerPaymentIcon}>
                        <TouchableOpacity
                            style={styles.circularPaymentIcon}
                            disabled
                        >
                            <ImgBizum width={21} height={26} />
                        </TouchableOpacity>
                        <Text style={styles.circularpaymentTextDisable}>Bizum</Text>
                    </View>
                    <View style={{ ...styles.containerPaymentIcon, marginLeft: iWin ? 0 : 20 }}>
                        <TouchableOpacity
                            style={styles.circularPaymentIcon}
                            onPress={() => handleClickVerse()}
                        >
                            <ImgVerse width={18} height={21} />
                        </TouchableOpacity>
                        <Text style={styles.circularpaymentText}>Verse</Text>
                    </View>
                    <View style={{ ...styles.containerPaymentIcon, marginLeft: iWin ? 0 : 20 }}>
                        <TouchableOpacity
                            style={styles.circularPaymentIcon}
                            onPress={() => handleClickPaypal()}
                        >
                            <ImgPaypal width={18} height={21} />
                        </TouchableOpacity>
                        <Text style={styles.circularpaymentText}>PayPal</Text>
                    </View>
                    {iWin ? (
                        <View style={styles.containerPaymentIcon}>
                            <TouchableOpacity
                                style={styles.circularPaymentIcon}
                                onPress={() => handleClickWhatsapp()}
                            >
                                <ImgWhatsapp width={19} height={20} />
                            </TouchableOpacity>
                            <Text style={styles.circularpaymentText}>Whatsapp</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    panel: {
        backgroundColor: "#ffffff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
    },
    iconClose: {
        width: 12,
        height: 12,
    },
    containerIconClose: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "flex-end",
        padding: 10
    },
    payText: {
        color: '#00443B',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Apercu Pro',
        paddingVertical: 10
    },
    payment: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    circularPaymentIcon: {
        height: 71,
        width: 71,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#E2F4F8',
        borderRadius: 100,
        marginTop: 10
    },
    paymentIcon: {
        width: 18,
        height: 21,
    },
    containerPaymentIcon: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: "center",
        alignContent: "center",
    },
    circularpaymentText: {
        color: '#00443B',
        fontSize: 12,
        fontWeight: 'normal',
        fontFamily: 'Apercu Pro',
        paddingVertical: 10
    },
    circularpaymentTextDisable: {
        color: '#cedad7',
        fontSize: 12,
        fontWeight: 'normal',
        fontFamily: 'Apercu Pro',
        paddingVertical: 10
    }
});

export default PaymentSilder;