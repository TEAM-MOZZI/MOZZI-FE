import React, { useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Autocomplete from 'react-native-autocomplete-input'
import styled from 'styled-components/native'

import useProfileStore from '../../store/ProfileStore'


interface SearchLikeProps {
  data: string[] 
  onSelect: (selectedItems: string[]) => void
  flag: boolean
}

const Container = styled(View)`
  width: 100%;
  /* max-height: 20%; */
  flex-direction: row;
  align-items: center;
  margin: 10px 0px 5px 0px;
  background-color: ${(props) => props.theme.palette.background};
`

const CustomAutoComplete = styled(Autocomplete)`
  color: ${(props) => props.theme.palette.font};
  font-size: 16px;
  background-color: ${(props) => props.theme.palette.background};
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.palette.light};
`

const IngreList = styled(View)`
  background-color: ${(props) => props.theme.palette.background};
  width: 100%;
  flex-direction: row;
  padding: 10px 0 10px 0;
  align-items: center;
`

const ListItem = styled(Text)`
  font-size: 16px;
  color: ${(props) => props.theme.palette.font};
`

const NoResText = styled(Text)`
  font-size: 16;
  font-family: ${(props) => props.theme.fonts.content};
  color: ${(props) => props.theme.palette.font}; 
  margin-top: 10px;
  margin-bottom: 20;
`

const JustifyView = styled(View)`
  flex-direction: row;
  align-items: center;
`

const SelectedStyle = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  margin-right: 12px;
  border-radius: 14px;
  background-color: ${(props) => props.theme.palette.point};
`

const TextSelectedStyle = styled(Text)`
  font-size: 16px;
  font-family: ${(props) => props.theme.fonts.content};
  color: ${(props) => props.theme.palette.font};
`


export const SearchLike:React.FC<SearchLikeProps> = ({ data, onSelect, flag }) => {
  const { profileData } = useProfileStore()
  const [ tmpData, setTmpData ] = useState<string[]>(
    profileData.foods && profileData.foods.length > 0
    ? profileData.foods
      .filter(food => (food.isLike === 1) === flag)
      .map(food => food.ingredientName)
      : []
    )
  const [ searchQuery, setSearchQuery ] = useState<string>('')
  const [ filteredData, setFilteredData ] = useState<string[]>([])
  const [ recipeName, setRecipeName ] = useState<string>('')

  // 자동 완성 데이터 필터링
  const handleAutoComplete = (text: string) => {
    setSearchQuery(text)
    const filtered = data.filter(item => item.includes(text))
    setFilteredData(filtered)
    console.log('----', filtered)
  }

  const handleSelect = (item: string) => {
    setTmpData(prev => [...prev, item])
    setSearchQuery('')
    setRecipeName(item)
    handleAutoComplete(item)
    setFilteredData([])
  }

  useEffect(() => {
    onSelect(tmpData)
  }, [tmpData])


  return (
    <View>
      <Container>
        <CustomAutoComplete
          data={filteredData}
          onChangeText={handleAutoComplete}
          inputContainerStyle={{ borderWidth: 0 }}
          flatListProps={{
            renderItem: ({ item }: { item: FoodItem }) => (
              <TouchableOpacity
                onPress={() => {handleSelect(item)}}>
                <IngreList>
                  <ListItem>{item}</ListItem>
                </IngreList>
              </TouchableOpacity>
            ),
            scrollEnabled: true,
            style: {...styles.list, ...styles.shadow}
          }}
        />
      </Container>

      {/* 서치바 하단 */}
      <View>
        {filteredData.length === 0 && searchQuery.length > 0 && recipeName !== searchQuery && (
          <View>
            <NoResText>검색 결과가 없습니다.</NoResText>
          </View>
        )}

        <JustifyView>
          {tmpData.map((item, index)=>(
            <TouchableOpacity key={index} onPress={() => setTmpData(tmpData.filter(data => data !== item))}>
              <SelectedStyle>
                <TextSelectedStyle>{item}</TextSelectedStyle>
              </SelectedStyle>
            </TouchableOpacity>
          ))}
        </JustifyView>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  list: {
    zIndex: 1,
    borderWidth: 0,
    maxHeight: 200,
  },
  shadow: {
  },
})