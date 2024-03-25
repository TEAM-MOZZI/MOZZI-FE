import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, TextInput, Button, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import styled from 'styled-components/native'

import useProfileStore from '../../store/ProfileStore'
import useLoginStore from '../../store/LoginStore'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'

const Container = styled.View`
  flex: 1;
  background-color: #FFFEF2;
`

const Title = styled.Text`
  font-size: 36px;
  font-weight: bold;
  margin: 50px 0px 0px 40px;
  text-align: left;
  width: 100%;
`

const Btn = styled.TouchableOpacity`
  background-color: #F9F7BB;
  border-radius: 10px;
  width: 80px;
  height: 35px;
  justify-content: center;
  align-self: flex-end;
  margin-top: 30px;
`

const BtnText = styled.Text`
  font-size: 16px;
  text-align: center;
`

const ListButton = styled.TouchableOpacity`
  padding: 20px;
  border-bottom-width: 1px;
  border-color: #E0E0E0;
`

const ListBtnText = styled.Text`
  font-size: 16px;
`

function UserScreen() {
  const { userData, setIsLogin } = useLoginStore()
  const { } = useProfileStore()
  const navigation = useNavigation()

  const handleLogout = async (navigation) => {
    await AsyncStorage.removeItem('accessToken')
    await AsyncStorage.removeItem('refreshToken')

    setIsLogin(false)

    // 네비게이션을 리셋하고 로그인 화면으로 이동합니다.
    navigation.reset({
      index: 0,
      routes: [{ name: 'LoginScreen' }],
    })
  }

  const moveProfile = () => {
    navigation.navigate("Profile")
  }

  const moveWithdrawal = () => {
    navigation.navigate("Withdrawal")
  }

  const movePolicy = () => {
    navigation.navigate("Policy")
  }

  return (
    <Container>
      <Title>{userData.nickname} 님</Title>
      <Btn onPress={handleLogout}>
        <BtnText>로그아웃</BtnText>
      </Btn>

      <ScrollView>
        <ListButton onPress={moveProfile}>
          <ListBtnText>내 정보 관리</ListBtnText>
        </ListButton>
        <ListButton onPress={moveWithdrawal}>
          <ListBtnText>서비스 탈퇴</ListBtnText>
        </ListButton>
        <ListButton onPress={movePolicy}>
          <ListBtnText>약관 및 정책</ListBtnText>
        </ListButton>
      </ScrollView>
    </Container>
  )
}

export default UserScreen