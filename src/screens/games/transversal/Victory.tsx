import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Victory = () => {
  const result = [
    {
      win: false,
      totalAnswerCorrect: 6,
      totalQuestion: 10,
      user: {
        id: '12321',
        name: "Ester"
      }
    },
    {
      win: false,
      totalAnswerCorrect: 3,
      totalQuestion: 10,
      user: {
        id: '22212',
        name: "Javi"
      }
    },
    {
      win: true,
      totalAnswerCorrect: 9,
      totalQuestion: 10,
      user: {
        id: '54545',
        name: "Ramon"
      }
    },
    {
      win: false,
      totalAnswerCorrect: 8,
      totalQuestion: 10,
      user: {
        id: '34455',
        name: "Marc"
      }
    },
  ];
  return (
    <SafeAreaView style={styles.victoryView}>
      <View style={styles.header}>
        <Text style={styles.textHeader}>Trivoo</Text>
      </View>
      <View style={styles.contentView}>
        <Text style={styles.contentTitle}>Derrota</Text>
        <Text style={[styles.contentSubtitle, { fontWeight: 'bold', fontSize: 16 }]}>Has perdido!</Text>
        <Text style={styles.contentSubtitle}>Ya puedes pagar los 2.5€ apostados</Text>
        <Text style={styles.contentSubtitle}>a Ramon ¡le pertenecen!</Text>
        <Text style={[styles.contentSubtitle, { marginTop: 35, }]}>Resultado final:</Text>
        <View style={styles.contentPlayers}>
          {result.map((result: any, key) => (
            <View key={key}>
              <View style={[styles.contentResult, { backgroundColor: result.win ? '#0CC482' : '#002F5D' }]}>
                <Text style={[styles.textResult, { color: result.win ? '#00274E' : '#ffffff' }]}>{result.user.name[0]}</Text>
              </View>
              <Text style={styles.textNameResult}>{result.user.name}</Text>
              <Text style={styles.textResultCount}>{result.totalAnswerCorrect}/{result.totalQuestion}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={[styles.buttonActions, { marginTop: 60 }]}>
          <Text style={styles.textButton}>Pagar 2.5€ a Ramon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonActions, { marginTop: 8 }]}>
          <Text style={styles.textButton}>Retar de nuevo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buttonActions, { marginTop: 8, backgroundColor: '#ffffff' }]}>
          <Text style={styles.textButton}>Volver a laurel Gaming</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  victoryView: {
    flex: 1,
  },
  header: {
    height: 70,
    padding: 15,
    justifyContent: 'center',
    backgroundColor: '#002F5D',
  },
  textHeader: {
    fontFamily: 'Apercu Pro',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  contentView: {
    backgroundColor: 'rgba(0, 39, 78, 1)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentTitle: {
    fontFamily: 'Laurel',
    fontStyle: 'normal',
    color: '#ffffff',
    fontSize: 60,
  },
  contentSubtitle: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 15,
    fontStyle: 'normal',
  },
  contentPlayers: {
    flexDirection: 'row',
    marginTop: 25,
  },
  contentResult: {
    borderRadius: 100,
    margin: 10,
    width: 72,
    height: 72,
    alignItems: 'center',
    backgroundColor: '#002F5D'
  },
  textResult: {
    fontFamily: 'Laurel',
    fontStyle: 'normal',
    fontSize: 45,
    color: '#ffffff',
  },
  textNameResult: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  textResultCount: {
    textAlign: 'center',
    fontFamily: 'Apercu Pro',
    fontSize: 12,
    color: '#ffffff',
  },
  buttonActions: {
    backgroundColor: '#108BE3',
    width: 332,
    justifyContent: 'center',
    borderRadius: 100,
    alignItems: 'center',
    padding: 15,
  },
  textButton: {
    color: '#00274E',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
  }
});

export default Victory;