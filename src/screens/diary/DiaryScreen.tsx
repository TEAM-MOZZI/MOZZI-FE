import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import styled from 'styled-components/native'

import { useNavigation } from '@react-navigation/native'
import { Calendar } from 'react-native-calendars'

import useDiaryStore from '../../store/DiaryStore'

const Container = styled(View)`
  flex: 1;
  background-color: ${(props) => props.theme.palette.background};
`

const JustifyView = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 32px;
`

const BtnContainer = styled(View)`
  margin-left: 20px;
`

const Title = styled(Text)`
  font-size: 36px;
  text-align: left;
  font-family: ${(props) => props.theme.fonts.title};
  color: ${(props) => props.theme.palette.font}; 
  margin: 40px 0 20px 0;
`

const Btn = styled(TouchableOpacity)`
  margin: 40px 0 20px 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 28px;
  background-color: black;
`

const CalendarContainer = styled(View)`
  padding: 0 16px 0 16px;
` 

const MyCalendar = styled(Calendar).attrs({
  theme: {
    arrowColor: '#E4E196',
  },
})`
  width: 100%;
`;

const DayStyle = styled(View)`
  width: 50px;
  height: 65px;
  align-items: center;
  background-color: ${(props) => (props.isSelected ? '#c6e4ee' : 'transparent')};
`

const DayNum = styled(Text)`
  align-items: center;
  color: ${props => props.textColor};
  font-weight: ${props => props.isToday ? 'bold' : 'normal'};
  font-family: ${(props) => props.theme.fonts.content};
`

const CalendarImage = styled(Image)`
  width: 80%;
  height: 80%;
  border-radius: 5px;
`

function DiaryScreen () {
  const navigation = useNavigation()
  const { calendarData, getCalendar } = useDiaryStore()

  useLayoutEffect (() => {
    // 컴포넌트 마운트 시 현재 달의 데이터를 불러옴
    const today = new Date()
    console.log(today)
    const year = today.getFullYear().toString()
    const month = (today.getMonth() + 1).toString().padStart(2, '0')
    getCalendar(year, month)
  }, [])

  // 달 이동할 때 달 정보 받음
  const getDate = (year, month) => {
    console.log(year, month)
    getCalendar(`${year}`, `${month.toString().padStart(2, '0')}`)
  }

  const moveDiaryDetail = (date, dayData) => {
    if (dayData.length > 0) {
      navigation.navigate("DiaryDetail", {
        date: date,
        dayData: dayData,
      })
    }
  }

  const moveDiaryCreate = () => {
    navigation.navigate("DiaryCreate")
  }

  return (
    <Container>
      <JustifyView>
        <Title>나의 요리 달력</Title>
        <BtnContainer>
          <Btn onPress={moveDiaryCreate}>
            <Icon name="add" size={24} color="white" />
          </Btn>
        </BtnContainer>
      </JustifyView>

      <CalendarContainer>
        <MyCalendar
          onMonthChange={(month) => {
            getDate(month.year, month.month)
          }}

          dayComponent={({date, state}) => {
            const dayData = calendarData.filter(food => food.photoDate === date.dateString)

            let textColor = '#000' // 기본 텍스트 색상

            if (state === 'disabled') {
              textColor = '#d9e1e8' // 비활성화된 날짜(저번달/다음달 날짜)의 색상
            } else if (state === 'today') {
              textColor = 'black'
            }

            return (
              <TouchableOpacity onPress={() => moveDiaryDetail(date, dayData)}>
                <DayStyle isSelected={state === 'selected'}>
                  <DayNum textColor={textColor} isToday={state === 'today'}>
                    {date.day}
                  </DayNum>
                  {state !== 'disabled' && dayData[0] &&
                    <CalendarImage
                      key={dayData[0].id}
                      source={{ uri: `${dayData[0].photoUrl}` }}
                    />
                  }
                </DayStyle>
              </TouchableOpacity>
            )
          }}
        />
      </CalendarContainer>
    </Container>
  )
}

export default DiaryScreen