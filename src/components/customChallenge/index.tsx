import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    SafeAreaView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useAxios } from '../../../client';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
import { updateOther } from '../../controllers/games/other/index';
import { getData, storeData } from '../../utils';
import Suggestion from '../suggestion';
import uuid from 'react-uuid';

const CustomChallenge: React.FC<{ navigation: any, route: any }> = ({ navigation, route }) => {
    const [val, setVal] = useState("");
    const [saveSuggestion, setSaveSuggestion] = useState(false);
    const [suggestionsChallengeLocal, setSuggestionsChallengeLocal] = useState<any>([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const getSuggestions = async () => {
            const suggestionsChallenge = await getData('suggestionsChallenge');
            setSuggestionsChallengeLocal(suggestionsChallenge || []);
        };
        getSuggestions();
    }, []);

    const { loading, data, refetch } = useAxios('/api/suggestion/getSuggestions?type=challenge');

    const handleChallenge = async () => {
        const user = await getData('user')
        if (saveSuggestion) {
            const suggestions = [...suggestionsChallengeLocal];
            suggestions.unshift({ id: uuid(), text: val, type: 'challenge' });
            await storeData(suggestions, 'suggestionsChallenge');
        }
        if (route?.params?.rematch) {
            dispatch(updateOther({
                userId: user.id,
                game: JSON.stringify({ value: val, type: 'customChallenge' }),
                friends: route.params.friends
            }))
            navigation.navigate('BET-TYPES', { color: 'green', game: 'customChallenge' })
        } else {
            dispatch(updateOther({
                userId: user.id,
                game: JSON.stringify({ value: val, type: 'customChallenge' }),
                friends: []
            }))
            navigation.navigate('SelectFriends', { color: 'green', game: 'customChallenge' })
        }
    }
    const handleTextChange = (text: string) => {
        setVal(text);
        setSaveSuggestion(true);
    };

    const handleTextChangeWithSuggestion = (text: string) => {
        setVal(text);
        setSaveSuggestion(false);
    };

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
                        <Text style={styles.title}>Escribe tu reto</Text>
                    </View>
                    <View style={[styles.boxText, { margin: Platform.OS === 'ios' ? 21 : 0, }]}>
                        <Text style={styles.betText}>Tu Reto</Text>
                        <TextInput
                            style={styles.inputText}
                            value={val}
                            maxLength={80}
                            onChangeText={handleTextChange}
                            multiline
                        />
                    </View>
                    <Suggestion
                        data={suggestionsChallengeLocal?.concat(data)}
                        refetch={refetch}
                        loading={loading}
                        onChangeText={handleTextChangeWithSuggestion} />
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        disabled={!val.trim()}
                        onPress={handleChallenge}
                        style={!val.trim() ? styles.challengeButtonDisabled : styles.challengeButton}>
                        <Text style={styles.challengeTextButton}>Retar</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

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
    title: {
        fontSize: 20,
        marginTop: 20,
        color: '#00443B',
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
    },
    challengeButton: {
        backgroundColor: '#0CC482',
        borderRadius: 100,
        width: 332,
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    challengeButtonDisabled: {
        backgroundColor: '#E9F6ED',
        borderRadius: 100,
        width: 332,
        height: 51,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
    },
    challengeTextButton: {
        fontFamily: 'Apercu Pro',
        fontWeight: 'bold',
        fontSize: 15,
        color: '#00443B',
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

export default CustomChallenge;