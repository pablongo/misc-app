import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, SafeAreaView, StatusBar, Platform } from 'react-native';
import ImgClose from '../../assets/close.svg'
import CustomButton from '../customButton';
import GamesTabView from '../gamesTabView';
import Modal from "react-native-modal";
import ImgArrowBack from '../../assets/arrow-back-green.svg'

const GamesBox: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const friend = route.params
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [statusBarColor, setStatusBarColor] = useState('#FFFFFF')

    const openModal = () => {
        setStatusBarColor('rgba(0, 0, 0, 0.7)')
        setOpen(true);
    }

    const closeModal = () => {
        setStatusBarColor('#FFFFFF')
        setOpen(false);
    }

    const openModal2 = () => {
        setStatusBarColor('rgba(0, 0, 0, 0.7)')
        setOpen2(true);
    }

    const closeModal2 = () => {
        setStatusBarColor('#FFFFFF')
        setOpen2(false);
    }

    return (
        <SafeAreaView >
            {Platform.OS === 'android' && <StatusBar backgroundColor={statusBarColor}></StatusBar>}
            <View style={{
                ...styles.container,
                backgroundColor: '#FFFFFF'
            }}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ ...styles.circleBack, backgroundColor: '#FFFFFF' }}>
                        <ImgArrowBack width={12} height={10} />
                    </TouchableOpacity>
                    <Text style={{
                        ...styles.textContainer,
                        fontWeight: 'bold'
                    }}
                    >Retar a {friend.user.name}</Text>
                </View>
                <GamesTabView navigation={navigation} openModal={openModal} route={route} openModal2={openModal2} />
            </View>
            {/* Modal 1 */}
            <Modal
                isVisible={open}
                style={{ margin: 0, justifyContent: 'flex-end' }}
                onBackdropPress={() => closeModal()}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={closeModal}>
                        <ImgClose width={12} height={12} />
                    </TouchableOpacity>
                    <Text style={styles.titleModal}>
                        ¡Próximamente!
                    </Text>
                    <Text style={styles.textModal}>
                        Este juego está en desarrollo, avisaremos tan pronto como esté disponible en nuestra plataforma.
                    </Text>
                    <View style={{ alignItems: 'center', }}>
                        <CustomButton
                            onPress={closeModal}
                            style={styles.modalButton}>
                            <Text style={styles.modalText}>Entendido</Text>
                        </CustomButton>
                    </View>
                </View>
            </Modal>
            {/* Modal 2 */}
            <Modal
                isVisible={open2}
                style={{ margin: 0, justifyContent: 'flex-end' }}
                onBackdropPress={() => closeModal2()}
            >
                <View style={styles.modalContent}>
                    <TouchableOpacity style={{ marginLeft: 'auto', padding: 10 }} onPress={closeModal2}>
                        <ImgClose width={12} height={12} />
                    </TouchableOpacity>
                    <Text style={styles.titleModal}>
                        ¡Próximamente!
                    </Text>
                    <Text style={styles.textModal}>
                        Esta funcionalidad está en desarrollo, avisaremos tan pronto como esté disponible en nuestra plataforma.
                    </Text>
                    <View style={{ alignItems: 'center', }}>
                        <CustomButton
                            onPress={closeModal2}
                            style={styles.modalButton}>
                            <Text style={styles.modalText}>Entendido</Text>
                        </CustomButton>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flexGrow: 1,
        minHeight: '100%'
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
        height: '100%',
        backgroundColor: '#FFFF',
        display: "flex",
        flexDirection: 'column',
        paddingBottom: 20
    },
    gameContainer: {
        margin: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
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
    gameName: {
        marginTop: 20,
        color: '#00443B',
        fontSize: 15,
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    cardContent: {
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        width: '48%',
        height: 179,
        borderRadius: 15,
        marginBottom: 10,
    },
    textSoon: {
        color: '#FFFFFF',
        fontSize: 10,
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    viewSoon: {
        backgroundColor: '#0CC482',
        width: 46,
        padding: 2,
        alignItems: 'center',
        borderRadius: 100,
    },
    modalButton: {
        borderRadius: 100,
        backgroundColor: '#0CC482',
        padding: 10,
        width: 302,
        height: 51,
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalText: {
        fontWeight: 'bold',
        fontFamily: 'Apercu Pro',
        fontSize: 14,
        color: '#00443B'
    },
    textModal: {
        fontSize: 15,
        marginTop: 10,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
    },
    titleModal: {
        fontSize: 18,
        marginTop: 30,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    modalContent: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 35,
        backgroundColor: '#FFFFFF',
    },
});

export default GamesBox;