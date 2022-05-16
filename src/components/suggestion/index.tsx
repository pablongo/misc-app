import React from "react";
import { TouchableOpacity,  Text, StyleSheet, FlatList } from "react-native";

interface Suggestion {
  id: number | string,
  text: string,
};

const Suggestion: React.FC<{
  borderColor?: string,
  data: Suggestion[] | null,
  refetch?: () => void,
  loading?: boolean,
  onChangeText?: (text: string) => void
}> = ({ borderColor = '#0CC482', data = [], refetch, loading = false, onChangeText }) => {

  const handleText = (text: string) => {
    if (onChangeText) onChangeText(text);
  };

  const handleRefetch = () => {
    if (refetch) refetch();
  };

  return (
    <FlatList
      refreshing={loading}
      onRefresh={handleRefetch}
      style={{ height: 180 }}
      numColumns={2}
      data={data}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleText(item.text)} style={[styles.suggestionButton, { borderColor }]}>
          <Text style={styles.suggestionText}>{item.text.length > 17 ? item.text.substring(0, 18) + '...' : item.text}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item: any) => item.id}
    />
  );
};

const styles = StyleSheet.create({
  suggestionButton: {
    borderWidth: 1,
    borderRadius: 100,
    padding: 12,
    marginLeft: 10,
    marginTop: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  suggestionText: {
    fontFamily: 'Apercu Pro Medium',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: 15,
    color: '#00443B',
  }
});

export default Suggestion;