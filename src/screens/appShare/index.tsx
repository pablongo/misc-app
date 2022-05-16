import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Share from 'react-native-share';
import ImgArrowBack from '../../assets/arrow-back-green.svg';
import ImgShare from '../../assets/share.svg';
import { logEvent } from '../../utils/Amplitude';

const AppShare: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [uri] = useState('https://www.laurelgaming.com/NlfvHy08')

  const handleShare = async () => {
    try {
      const shareOptions = {
        url: uri,
      };
      await Share.open(shareOptions);
      logEvent("TYPE_INVITE_FRIEND_EVENT");
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <SafeAreaView style={styles.viewAppShare}>
      <View style={styles.titleView}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.circleBack}>
          <ImgArrowBack width={12} height={10} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Invitar amigos</Text>
      </View>
      <View style={styles.line}></View>
      <View style={styles.viewShareList}>
        <Text style={styles.titleFriend}>Reta</Text>
        <Text style={styles.subtitleText}>A tus amigos favoritos</Text>
        <TouchableOpacity onPress={handleShare} style={styles.shareItem}>
          <ImgShare width={13} height={14} />
          <Text style={styles.textItem}>Invitar amigo por...</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  viewAppShare: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  titleFriend: {
    color: '#00443B',
    fontSize: 12,
  },
  textApp: {
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    fontSize: 12,
    marginTop: 8,
  },
  buttonApp: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  shareItem: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'center',
    alignContent: 'center'
  },
  textItem: {
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    marginLeft: 10
  },
  iconItem: {
    marginRight: 10,
  },
  subtitleText: {
    color: '#00443B',
    fontSize: 20,
    marginBottom: 20,
  },
  titleView: {
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    padding: 15,
  },
  titleText: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    color: '#00443B',
    fontSize: 15,
  },
  circleBack: {
    width: 16,
    height: 30,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
  },
  arrowBack: {
    width: 12,
    height: 10,
  },
  line: {
    borderBottomWidth: 1,
    borderColor: '#EAEAEA',
  },
  viewShareList: {
    padding: 20,
  },
});

export default AppShare;