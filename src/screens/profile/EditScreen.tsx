import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import styled from 'styled-components/native'

import CustomDropdown from '../../components/Dropdown/CustomDropdown'
import { SearchLike } from '../../components/AutoWord/SearchLike'

import useProfileStore from '../../store/ProfileStore'
import useDropdownStore from '../../store/DropdownStore'
import useFridgeStore from '../../store/FridgeStore'

const Label = styled(Text)`
  margin-top: 30px;
  font-size: 16;
  font-family: ${(props) => props.theme.fonts.content};
  color: ${(props) => props.theme.palette.font};
`

const StyledInput = styled(TextInput)`
  font-size: 16;
  min-height: 40px;
  margin: 10px 0px 10px 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.palette.light};
`

function EditScreen() {
  const { form, setForm, setFoodInfo } = useProfileStore()
  const { allFoods } = useFridgeStore()
  const { dropdownData } = useDropdownStore()

  const [ likeData, setLikeData ] = useState([])
  const [ unlikeData, setUnlikeData ] = useState([])

  useEffect(() => {
    const formatData = (data, value) => 
    Array.isArray(data) ? data.map(foodName => ({ foodName, value })) : []
    
    const formattedData = [
      ...formatData(unlikeData, 0),
      ...formatData(likeData, 1),
      ...formatData(dropdownData, 2),
    ]

    console.log( '알러지/호불호 식재료 데이터 완성', formattedData)
    setFoodInfo(formattedData)

  }, [unlikeData, likeData, dropdownData])


  const handleLikeData = (recipeName: string) => {
    console.log('좋아하는 재료', recipeName)
    setLikeData(recipeName)
  }

  const handleUnlikeData = (recipeName: string) => {
    console.log('싫어하는 재료', recipeName)
    setUnlikeData(recipeName)
  }

  const handleNicknameChange = (nickname: string) => setForm({ ...form, nickname })

  return (
    <View>
      <Label>닉네임</Label>
      <StyledInput
        placeholder="닉네임을 입력하세요"
        value={form.nickname}
        onChangeText={handleNicknameChange}
        placeholderTextColor="#ccc"
      />

      <Label>알레르기 정보</Label>
      <CustomDropdown
        data={allergyList}
        placeholder="보유하고 있는 알레르기 정보를 선택해 주세요"
        isMulti={true}
      />

      <Label>좋아하는 식재료</Label>
      <SearchLike data={allFoods} onSelect={handleLikeData} flag={1}/>
      

      <Label>싫어하는 식재료</Label>
      <SearchLike data={allFoods} onSelect={handleUnlikeData} flag={0}/>
      
      <Label>비건 여부</Label>
      <CustomDropdown
        data={isYes}
        placeholder="비건 여부를 알려주세요"
        isMulti={false}
      />
    </View>
  )
}

export default EditScreen


// 이 밑에 더미데이터 아님 절대 지우면 안돼
const allergyList = [
  { label: '난류', value: '난류' },
  { label: '우유', value: '우유' },
  { label: '메밀', value: '메밀' },
  { label: '땅콩', value: '땅콩' },
  { label: '대두', value: '대두' },
  { label: '밀', value: '밀' },
  { label: '고등어', value: '고등어' },
  { label: '새우', value: '새우' },
  { label: '게', value: '게' },
  { label: '돼지고기', value: '돼지고기' },
  { label: '복숭아', value: '복숭아' },
  { label: '토마토', value: '토마토' },
  { label: '호두', value: '호두' },
  { label: '닭고기', value: '닭고기' },
  { label: '쇠고기', value: '쇠고기' },
  { label: '오징어', value: '오징어' },
  { label: '굴', value: '굴' },
  { label: '전복', value: '전복' },
  { label: '홍합', value: '홍합' },
  { label: '잣', value: '잣' }
]

const isYes = [
  {label:'Yes', value: true},
  {label:'No', value: false}
]