import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { MultiSelect, Dropdown } from 'react-native-element-dropdown'

import styled from 'styled-components/native'

import useDropdownStore from '../../store/DropdownStore'
import useProfileStore from '../../store/ProfileStore'

const SelectedStyle = styled(View)`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-top: 8px;
  margin-right: 12px;
  border-radius: 14px;
  background-color: ${(props) => props.theme.palette.point};
  font-size: 16;
`

const TextSelectedStyle = styled(Text)`
  font-size: 16px;
  font-family: ${(props) => props.theme.fonts.content};
  color: ${(props) => props.theme.palette.font};
`

function CustomDropdown ({ data, placeholder, isMulti }) {
  const { dropdownData, setDropdownData, isVeganData, setIsVeganData } = useDropdownStore()
  const { profileData } = useProfileStore()
  const [selected, setSelected] = useState(
    profileData.foods && profileData.foods.length > 0
    ? [...new Set(profileData.foods
      .filter(food => food.isLike === 2)
      .map(food => food.mainAllergy))]
      : []
    )

  const handleData = (item) => {
    setIsVeganData(item.value)
  }
  
  useEffect(() => {
    console.log(dropdownData, '선택된 애들')
  }, [dropdownData])

  return (
    <>
      {isMulti ?
        <MultiSelect
          style={{borderBottomWidth:1, borderBottomColor:'#e1dfd4'}}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          placeholderStyle={{fontSize:16, color:'#e1dfd4'}}
          value={selected}
          onChange={item => {
            setDropdownData(item)
            setSelected(item)
          }}

          // renderItem={renderItem}
          
          // 선택 했을 때 밑에 뜨는 타원 css
          renderSelectedItem={(item, unSelect) => (
            <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
              <SelectedStyle>
                <TextSelectedStyle>{item.label}</TextSelectedStyle>
              </SelectedStyle>
            </TouchableOpacity>
          )}
        />
      :
        <Dropdown
          style={{ borderBottomWidth: 1, borderBottomColor: '#e1dfd4' }}
          data={data}
          labelField="label"
          valueField="value"
          placeholder={placeholder}
          placeholderStyle={{ fontSize: 16, color: '#e1dfd4' }}
          onChange={(item) => handleData(item)}
        />
      }
    </>
  )
}

export default CustomDropdown