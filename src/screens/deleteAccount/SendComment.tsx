import React, { useState } from 'react';
import {
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useAxiosMutation } from '../../../client';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import CustomButton from '../../components/customButton';

const SendComment: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [val, setVal] = useState("");

  const onComplete = () => {
    navigation.replace('Received');
  }

  const onError = (error: any) => {

  }

  const [mutation, { loading }] = useAxiosMutation('/api/auth/hintMessage', {
    onComplete,
    onError
  })

  const handleMutation = () => {
    mutation({ message: val });
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.safeAreaView}>
        <View>
          <View style={styles.containerTitle}>
            <TouchableOpacity style={{
              marginTop: Platform.OS === 'ios' ? 20 : 0,
              borderRadius: 100,
              height: 40,
              width: 40,
              justifyContent: 'center',
            }} onPress={() => navigation.goBack()}>
              <ImgArrowBack width={12} height={10} />
            </TouchableOpacity>
            <Text style={styles.title}>Enviar comentario</Text>
          </View>
          <View style={[styles.boxText, { margin: Platform.OS === 'ios' ? 21 : 0, }]}>
            <Text style={styles.betText}>Tu Comentario</Text>
            <TextInput
              style={styles.inputText}
              value={val}
              maxLength={150}
              onChangeText={(text: any) => setVal(text)}
              multiline
            />
          </View>
          <Text style={styles.textLength}>{val.length}/150</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <CustomButton
            loading={loading}
            onPress={handleMutation}
            disabled={!val.trim()}
            style={!val.trim() ? styles.buttonDisabled : styles.buttonEnabled}>
            <Text style={!val.trim() ? styles.textButtonDisabled : styles.textButton}>Enviar</Text>
          </CustomButton>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between",
    backgroundColor: '#FFFFFF',
  },
  containerTitle: {
    padding: Platform.OS === 'ios' ? 21 : 0,
    paddingBottom: 0,
    paddingTop: 0,
    backgroundColor: '#FFFFFF',
  },
  arrowBack: {
    width: 12,
    height: 10,
    marginTop: 20,
  },
  textLength: {
    paddingLeft: Platform.OS === 'ios' ? 24 : 10,
    marginTop: 10,
    color: '#00443B',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro'
  },
  title: {
    fontSize: 20,
    marginTop: 20,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
  },
  buttonEnabled: {
    backgroundColor: '#00443B',
    borderRadius: 100,
    width: 332,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  buttonDisabled: {
    backgroundColor: '#E9F6ED',
    borderRadius: 100,
    width: 332,
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  textButtonDisabled: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#00443B',
  },
  textButton: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  boxText: {
    height: 190,
    padding: 21,
    marginTop: 21,
    borderWidth: 2,
    borderRadius: 25,
    borderColor: "#EAEAEA",
  },
  betText: {
    fontSize: 10,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
  },
  inputText: {
    fontSize: 15,
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    height: 160,
    textAlignVertical: 'top',
  }
});

export default SendComment;
