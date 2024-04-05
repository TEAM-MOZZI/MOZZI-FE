import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, ScrollView, Text, TextInput, KeyboardAvoidingView } from 'react-native'
import styled from 'styled-components/native'

import { useNavigation } from '@react-navigation/native'
import { Header } from '../../components/Header/Header'
import EditScreen from './EditScreen'
import SmallButton from '../../components/Button/SmallButton'
import LoadingScreen from '../../components/Loading/LoadingScreen'

import useProfileStore from '../../store/ProfileStore'
import useDropdownStore from '../../store/DropdownStore'

const Container = styled(ScrollView).attrs(props => ({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
  }
  }))`
  flex: 1;
  background-color: ${(props) => props.theme.palette.background};
`

const Title = styled(Text)`
  font-size: 36px;
  margin: 20px 0px 0px 16px;
  text-align: left;
  width: 100%;
  font-family: ${(props) => props.theme.fonts.title};
  color: ${(props) => props.theme.palette.font}; 
`

const Body = styled(View)`
  margin: 0px 16px 20px 16px;
`

const Label = styled(Text)`
  margin-top: 20px;
  font-size: 16;
  font-family: ${(props) => props.theme.fonts.content};
  color: ${(props) => props.theme.palette.font};
`

const StyledInput = styled(TextInput)`
  min-height: 40px;
  font-size: 16;
  margin: 10px 0px 10px 0px;
  border-bottom-width: 1px;
  border-bottom-color: ${(props) => props.theme.palette.light};
`

function ProfileScreen () {
  const navigation = useNavigation()
  const { getProfile, profileData, foodInfo, editNickname, editIsVegan, editFoodInfo, form } = useProfileStore()
  const { dropdownData, isVeganData } = useDropdownStore()
  const [ isEdit, setIsEdit ] = useState<boolean>(false)
  const [ flag, setFlag ] = useState(false)


  useLayoutEffect(() => {
    getProfile()

  }, [isEdit])
 
  const handleIsEdit = async () => {
    if (isEdit) {
      setFlag(true)
      await editNickname(form.nickname)
      await editIsVegan(Boolean(isVeganData))
      await editFoodInfo(foodInfo)
      setFlag(false)
    }
    setIsEdit(!isEdit)
    
  }

  return (
    <Container>
      { flag ?
        (<LoadingScreen dataLength={0}/>)
      : (<>
          <Header>
            <Header.Icon iconName="arrow-back" onPress={navigation.goBack} />
          </Header>

          <Title>내 정보</Title>
          <KeyboardAvoidingView>
            <Body>
              {isEdit ? (
                <EditScreen />
                ) : (
                <View>
                  <Label>닉네임</Label>
                  <StyledInput
                    placeholder={profileData.nickname}
                    editable={false}
                  />
                  <Label>알레르기 정보</Label>
                  <StyledInput
                    placeholder={
                      profileData.foods && profileData.foods.length > 0
                        ? [...new Set(profileData.foods
                          .filter(food => food.isLike === 2)
                          .map(food => food.mainAllergy))]
                          .join(', ')
                        : "보유하고 있는 알레르기 정보를 선택해 주세요"
                    }
                    editable={false}
                  />
                  <Label>좋아하는 식재료</Label>
                  <StyledInput
                    placeholder={
                      profileData.foods && profileData.foods.length > 0
                        ? profileData.foods
                            .filter(food => food.isLike === 1)
                            .map(food => food.ingredientName)
                            .join(', ')
                        : "좋아하는 식재료를 찾아보세요."
                    }
                    editable={false}
                  />
                  <Label>싫어하는 식재료</Label>
                  <StyledInput
                    placeholder={
                      profileData.foods && profileData.foods.length > 0
                        ? profileData.foods
                            .filter(food => food.isLike === 0)
                            .map(food => food.ingredientName)
                            .join(', ')
                        : "싫어하는 식재료를 찾아보세요."
                    }
                    editable={false}
                  />
                  <Label>비건 여부</Label>
                  <StyledInput
                    placeholder={`${(profileData.isVegan)? '네':'아니오'}`}
                    editable={false}
                  />
                </View>
                )
              }
              <SmallButton 
                onPress={handleIsEdit}
                text={isEdit ? '완료' : '수정'}
                style={{
                  marginTop: 20,
                }}
              />
            </Body>
          </KeyboardAvoidingView>
        </>)
      }
    </Container>
  )
}

export default ProfileScreen