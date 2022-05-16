import React, { useEffect } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { useDispatch } from 'react-redux';
import { setGamematchId } from '../../../controllers/games/questions/actions';

const LoadGamematch: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
  const { params } = route;
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setGamematchId(params.gamematchId))
    navigation.navigate('Preguntados-Game')
  }, [params.gamematchId])

  return (
    <SafeAreaView>
      <View>
        <Text>...</Text>
      </View>
    </SafeAreaView>
  );
}

export default LoadGamematch;