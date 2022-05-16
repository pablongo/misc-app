import React from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, StyleSheet, ActivityIndicator } from 'react-native';
import CustomButton from '../../../components/customButton';
import { useUniversalUsers } from '../../../hooks/UniversalUsers';
import Item from './Item';
const windowHeight = Dimensions.get('window').height;

const UniversalUsers: React.FC<{ search: string, onRefresh?: Function }> = ({ search, onRefresh }) => {
  const {
    loading,
    error,
    data,
    loadMore,
    loadingLoadMore,
    checkLoadMore,
    updateData
  } = useUniversalUsers(search, 1, 10);

  const ViewEmptyList = () => {
    if (error) return (
      <View style={styles.loadingOrError}>
        <Text>Lo sentimos, ha ocurrido un error.</Text>
      </View>
    )

    if (search.trim().length > 0) return (
      <View style={styles.loadingOrError}>
        <Text>No se encontró el contacto.</Text>
      </View>
    );

    return (
      <View style={styles.loadingOrError}>
        <Text>No tienes contactos que estén usando Laurel Gaming.</Text>
      </View>
    );
  };

  if (loading) return (
    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 160, }}>
      <ActivityIndicator />
    </View>
  );

  return (
    <View>
      <FlatList
        style={{ height: windowHeight - 260 }}
        data={data?.users}
        renderItem={(user) => (
          <Item
            user={user.item}
            onRefresh={onRefresh}
            updateData={updateData} />
        )}
        keyExtractor={(item: any) => item.id}
        ListEmptyComponent={ViewEmptyList}
      />
      {checkLoadMore && (
        <CustomButton
          loading={loadingLoadMore}
          onPress={() => loadMore()}
          style={styles.seeMore}>
          <Text >Ver más</Text>
        </CustomButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  loadingOrError: {
    marginTop: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  seeMore: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 10,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center'
  },
  avatarItem: {
    borderRadius: 100,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E9F6ED',
  },
  avatarText: {
    fontFamily: 'Laurel',
    fontSize: 24,
    fontStyle: 'normal',
    color: '#00443B',
  },
  contactName: {
    color: '#00443B',
    marginLeft: 10,
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
  },
})

export default UniversalUsers;