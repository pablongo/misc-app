import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import CustomButton from '../../components/customButton';
import ImgClose from '../../assets/close.svg'
import GamesTabView from '../../components/gamesTabView';
import Modal from "react-native-modal";


const Games: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
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
    <View style={{ ...styles.viewContent, backgroundColor: '#FFFFFF' }}>
      {Platform.OS === 'android' && <StatusBar backgroundColor={statusBarColor}></StatusBar>}
      <View style={styles.viewContainer}>
        <Text style={styles.titleContainer}>
          Reta y gana
        </Text>
        <Text style={styles.questionTitleContainer}>
          ¿Qué te juegas?
        </Text>
      </View>
      <GamesTabView navigation={navigation} openModal={openModal} route={route} openModal2={openModal2} />
      {/* Modal 1 */}
      <Modal
        isVisible={open}
        style={{ margin: 0, justifyContent: 'flex-end' }}
        onBackdropPress={() => closeModal()}
      >
        <View style={styles.modalContent}>
          <TouchableOpacity style={{ marginLeft: 'auto', padding: 10 }} onPress={closeModal}>
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
          <TouchableOpacity style={{ marginLeft: 'auto' }} onPress={closeModal2}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  viewContent: {
    flex: 1,
  },
  iconClose: {
    width: 12,
    height: 12,
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
  titleContainer: {
    fontSize: 12,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  viewContainer: {
    padding: 21,
    paddingBottom: 0
  },
  trophy: {
    width: 12,
    height: 12
  },
  circleTrophy: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    backgroundColor: '#E9F6ED'
  },
  line: {
    width: '100%',
    height: 1.1,
    backgroundColor: '#EAEAEA',
  },
  appTitle: {
    fontSize: 15,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  selectBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    paddingBottom: 10,
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1
  },
  questionTitleContainer: {
    color: '#00443B',
    fontFamily: 'Apercu Pro Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 20,
    lineHeight: 20,
    marginTop: 10,
  },
});

export default Games;