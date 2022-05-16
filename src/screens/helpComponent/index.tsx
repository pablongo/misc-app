import React from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useAxios } from '../../../client';
import ImgArrowBack from '../../assets/arrow-back-green.svg';
import Accordion from '../../components/accordion';

const HelpComponent: React.FC<{
  navigation: any
}> = ({ navigation }) => {

  const { loading, error, data }: any = useAxios('/api/frequentQuestion/getFrequentQuestions');

  if (loading) return (
    <SafeAreaView style={styles.viewSafeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
          <ImgArrowBack width={15} height={21} />
        </TouchableOpacity>
        <Text style={{ ...styles.textContainer, fontWeight: 'bold' }}>
          Ayuda
        </Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <ActivityIndicator color='#00443B' />
      </View>
    </SafeAreaView>
  );

  if (error) return (
    <SafeAreaView style={styles.viewSafeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
          <ImgArrowBack width={15} height={21} />
        </TouchableOpacity>
        <Text style={{ ...styles.textContainer, fontWeight: 'bold' }}>
          Ayuda
        </Text>
      </View>
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Text>Lo sentimos ha ocurrido un error.</Text>
      </View>
    </SafeAreaView>
  );

  const list = data.map((v: any) => ({
    ...v,
    content: v?.text
  }));

  return (
    <SafeAreaView style={styles.viewSafeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.circleBack}>
          <ImgArrowBack width={15} height={21} />
        </TouchableOpacity>
        <Text style={{ ...styles.textContainer, fontWeight: 'bold' }}>
          Ayuda
        </Text>
      </View>
      <View style={styles.content}>
        <Text style={{ fontFamily: 'Apercu Pro', fontSize: 20, color: '#00443B' }}>
          Preguntas frecuentes
        </Text>
      </View>
      <Accordion
        data={list || []}
        style={{ paddingRight: 21, paddingLeft: 21 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewSafeArea: {
    backgroundColor: '#FFFFFF',
    flex: 1,
  },
  content: {
    padding: 21,
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
  header: {
    width: '100%',
    display: "flex",
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderColor: "#EAEAEA",
    borderBottomWidth: 1
  },
})

export default HelpComponent;