import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import AddGreen from '../../assets/add-green.svg';
import CloseGreen from '../../assets/close-green.svg';

const Accordion: React.FC<{
  index?: number
  data: any,
  style?: any
}> = ({
  index = -1,
  data = [],
  style
}) => {
    const [activeIndex, setActiveIndex] = useState(index || -1);
    const handleClick = (index: number) => {
      const newIndex = activeIndex === index ? -1 : index;
      setActiveIndex(newIndex);
    }
    return (
      <ScrollView>
        <View style={style}>
          {data.map((item: any, key: any) => (
            <AccordionContent
              key={key}
              title={item?.title}
              content={item?.content}
              index={key}
              activeIndex={activeIndex}
              onPress={handleClick} />
          ))}
        </View>
      </ScrollView>
    )
  };

const AccordionContent: React.FC<{
  title: string
  content: string
  index: number
  activeIndex: number
  onPress: (index: number) => void
}> = ({
  title,
  content,
  index,
  activeIndex,
  onPress
}) => (
    <View style={styles.accordionView}>
      <TouchableOpacity onPress={() => onPress(index)}>
        <View style={styles.accordionTitle}>
          <Text style={styles.textTitle}>
            {title}
          </Text>
          <View style={{ marginLeft: 'auto' }}>
            {activeIndex === index ? <CloseGreen width={10} height={20} /> : <AddGreen width={10} height={20} />}
          </View>
        </View>
      </TouchableOpacity>
      {activeIndex === index && (
        <View style={{ marginTop: 10, marginBottom: 10 }}>
          <Text style={styles.textContent}>
            {content}
          </Text>
        </View>
      )}
    </View>
  );

const styles = StyleSheet.create({
  accordionView: {
    borderBottomColor: '#EAEAEA',
    borderBottomWidth: 1,
    paddingBottom: 20,
    paddingTop: 20,
  },
  accordionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textTitle: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'bold',
    fontSize: 15,
    color: '#00443B'
  },
  textContent: {
    fontFamily: 'Apercu Pro',
    fontWeight: 'normal',
    fontSize: 15,
    color: '#00443B'
  }
})

export default Accordion;