import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, TextInput, View, StyleSheet, Keyboard } from 'react-native';
import styled from 'styled-components/native';
import Autocomplete from 'react-native-autocomplete-input';
import useFridgeStore from '../../store/FridgeStore';

interface FoodItem {
  id: number;
  image: string;
  title: string;
}

const SearchSection = styled(View)`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin: 10px 0px 5px 0px;
  background-color: ${(props) => props.theme.palette.background};
`

const StyledAutocomplete = styled(Autocomplete)`
  font-size: 16px;
  z-index: 1001;
  width: 100%;
  border: transparent;
  height: 50px;
  flex-direction: row;
  align-items: center;
  background-color: #fff;
  border-width: 1;
  border-radius: 8px;
  border-color: ${(props) => props.theme.palette.pointDark};
  color: ${(props) => props.theme.palette.font};
  margin-bottom: 5px;
  padding-left: 15px;
`;

const ListButton = styled(TouchableOpacity)`
  background-color: ${(props) => props.theme.palette.background};
  width: 100%;
  flex-direction: row;
  padding: 10px 0 10px 0;
  align-items: center;
`
const ListItem = styled(Text)`
  color: ${(props) => props.theme.palette.font};
  font-size: 16px;
`

export const SearchFood: React.FC<{ setQuery: (query: string) => void }> = ({ setQuery }) => {
  const [query, setLocalQuery] = useState('');
  const [filteredData, setFilteredData] = useState<FoodItem[]>([]);
  const allFoods = useFridgeStore((state) => state.allFoods);
  const getAllFoods = useFridgeStore((state) => state.getAllFoods);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  // 선택된 항목을 저장할 상태
  const [selectedItem, setSelectedItem] = useState<FoodItem | null>(null);

  useEffect(() => {
    // 키보드 상태 추적
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      console.log('Keyboard is open');
      setKeyboardOpen(true);
    });
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      console.log('Keyboard is closed');
      setKeyboardOpen(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);


  useEffect(() => {
    // `query`가 변경될 때마다 `setQuery`를 호출
    setQuery(query);
  }, [query, setQuery]);


  useEffect(() => {
    // 데이터를 가져온 후 상태를 업데이트
    getAllFoods().then(() => {
      // console.log('푸드 데이터 베이스 로딩 완료')
      // console.log(`푸드 리스트: ${allFoods}`)
    });
  }, [getAllFoods]);
  

  // 자동 완성 데이터 필터링
  const handleAutoComplete = (text: string) => {
    setLocalQuery(text);
    if (text === '') {
      setFilteredData([]);
    } else {
      const filtered = allFoods.filter((food) =>
      food && food.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredData(filtered);
    }
  }

  // 자동 완성 목록에서 항목을 선택했을 때 호출되는 함수
  const handleSelectItem = (item: string) => {
    setLocalQuery(item); // 로컬 상태 업데이트
    setQuery(item); // 상위 컴포넌트의 상태 업데이트
  };

  return (
    <SearchSection>
      {/* {keyboardOpen ? ( */}
      <StyledAutocomplete
        data={filteredData}
        defaultValue={query}
        onChangeText={handleAutoComplete}
        inputContainerStyle={{ borderWidth: 0 }}
        flatListProps={{
          keyExtractor: (item, index) => index.toString(),
          renderItem: ({ item }) => (
            <ListButton onPress={() => handleSelectItem(item)}>
              <ListItem>{item}</ListItem>
            </ListButton>
          ),
          scrollEnabled: true,
          style: { ...styles.list, ...styles.shadow },
        }}
        renderTextInput={(props) => <TextInput {...props} />}
        listContainerStyle={{
          maxHeight: keyboardOpen ? 300 : 150 ,
        }}
      />
    </SearchSection>
  );
};


const styles = StyleSheet.create({
  list: {
    borderWidth: 0,
    maxHeight: 300,
    zIndex: 1,
  },
  shadow: {    
  },
})