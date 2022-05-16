import React, { useEffect, useState } from 'react';
import { NativeSyntheticEvent, ScrollView, StyleSheet, Text, TextInput, TextInputEndEditingEventData, TextInputFocusEventData, TouchableOpacity, View } from 'react-native';
import Divider from '../divider';
import CustomModal from '../modal';
import ImgArrowBack from '../../assets/arrow-back-green.svg'
const PLACEHOLDER_TEXT_COLOR = '#FFFFFF';
const { countries } = require('./indicative.json');

const ListCountries: React.FC<{
  onSelected?: Function,
  value?: string,
  textFilter?: string
}> = ({ onSelected, value, textFilter }) => {
  const [dataCountries, setDataCountries] = useState([]);
  const handleCountry = (selectedValue: any) => {
    if (onSelected) onSelected(selectedValue);
  };

  useEffect(() => {
    const filterCountries = countries
      .filter((country: any) => (
        country.name.toLocaleLowerCase()
          .includes(textFilter?.toLocaleLowerCase())
        ||
        country.code.toLocaleLowerCase()
          .includes(textFilter?.toLocaleLowerCase())
      ));
    setDataCountries(filterCountries);
  }, [countries, textFilter]);

  return (
    <>
      {(textFilter && textFilter.length > 1) ? (
        <>
          {dataCountries.length <= 0 && (
            <View>
              <Text style={styles.textMsg}>Sin resultados</Text>
            </View>
          )}
          {
            dataCountries
              .map((country: any, key: number) => (
                <TouchableOpacity onPress={() => handleCountry(country.code)} key={key}>
                  <View style={[styles.item, value === country.code && { backgroundColor: '#0CC482' }]}>
                    <Text style={styles.textIndicative}>{country.code}</Text>
                    <Text style={styles.textCountry}>{country.name.slice(0, 26)}</Text>
                  </View>
                </TouchableOpacity>
              ))
          }
        </>
      ) : (
        <View>
          <Text style={styles.textMsg}>Ejemplo: (+34 ó España)</Text>
        </View>
      )}
    </>
  );
};

const InputPhone: React.FC<{
  onSelected?: ((text: string) => void),
  value?: string
  phone?: string
  onBlur?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined
  onEndEditing?: ((e: NativeSyntheticEvent<TextInputEndEditingEventData>) => void) | undefined
  onChangePhone?: ((text: string) => void)
}> = ({ onSelected, value, onChangePhone, phone, onBlur, onEndEditing }) => {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const handleSelected = (codeValue: any) => {
    if (onSelected) onSelected(codeValue);
    setSearchText('');
    setOpen(false);
  };
  const onCloseModal = () => {
    setSearchText('');
    setOpen(false);
  };
  return (
    <View style={styles.inputPhone}>
      <TouchableOpacity onPress={() => setOpen(!open)}>
        <View style={styles.indicativeNumber}>
          <Text style={styles.textIndicativeNumber}>{value || '+00'}</Text>
          <ImgArrowBack width={5} height={5} />
        </View>
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={onChangePhone}
        value={phone}
        onBlur={onBlur}
        onEndEditing={onEndEditing}
        placeholderTextColor={PLACEHOLDER_TEXT_COLOR}
        placeholder="Teléfono"
        keyboardType="numeric"
      />
      <CustomModal open={open}>
        <View style={styles.modalView}>
          <TextInput
            value={searchText}
            onChangeText={value => setSearchText(value)}
            style={styles.searchCountry}
            placeholderTextColor='#00443B'
            placeholder="Buscar por país o su indicativo"
          />
          <Divider text="o" />
          <ScrollView>
            <ListCountries
              value={value}
              onSelected={handleSelected}
              textFilter={searchText} />
          </ScrollView>
          <TouchableOpacity onPress={onCloseModal} style={styles.buttonCloseModal}>
            <Text style={styles.textButtonCloseModal}>
              Cerrar
            </Text>
          </TouchableOpacity>
        </View>
      </CustomModal>
    </View>
  );
};

const styles = StyleSheet.create({
  inputPhone: {
    flexDirection: 'row',
  },
  buttonCloseModal: {
    marginTop: 20,
    width: 100,
    height: 52,
    borderRadius: 100,
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#0CC482',
  },
  textButtonCloseModal: {
    color: '#00443B',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    textAlign: 'center',
  },
  item: {
    width: 270,
    flexDirection: 'row',
    height: 51,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    borderColor: '#0CC482',
    borderWidth: 2,
    marginTop: 10,
  },
  textIndicative: {
    fontWeight: 'bold',
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontSize: 15,
  },
  textMsg: {
    fontWeight: 'bold',
    color: '#ccc',
    fontFamily: 'Apercu Pro',
    fontSize: 15,
  },
  textCountry: {
    fontWeight: 'bold',
    color: '#00443B',
    fontFamily: 'Apercu Pro',
    fontSize: 15,
    marginLeft: 10,
  },
  arrowDown: {
    width: 5,
    marginLeft: 10,
    height: 5
  },
  modalView: {
    alignItems: "center",
    height: 350,
    marginTop: 150,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  indicativeNumber: {
    width: 87,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    height: 51,
    borderColor: '#0CC482',
    borderWidth: 1,
    borderRadius: 100,
  },
  textIndicativeNumber: {
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
  },
  searchCountry: {
    width: 270,
    textAlign: 'center',
    margin: 5,
    height: 51,
    borderColor: '#0CC482',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#00443B',
    borderWidth: 2,
    borderRadius: 100,
  },
  input: {
    width: 237,
    textAlign: 'center',
    margin: 5,
    height: 51,
    borderColor: '#0CC482',
    fontWeight: 'bold',
    fontFamily: 'Apercu Pro',
    color: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 100,
  },
});



export default InputPhone;