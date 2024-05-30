import { create } from 'zustand'
import axios from '../../axios'
import AsyncStorage from '@react-native-async-storage/async-storage'


const useDiaryStore = create((set) => ({
  calendarData: [],
  getCalendar: async (foodYear:string, foodMonth:string) => {
    console.log('년도와 월 잘받았나?', foodYear, foodMonth)
    const token = await AsyncStorage.getItem('accessToken')
    try {
      const response = await axios.get('mozzi/diary/getmydiary', {
        headers: {
          Authorization: `Bearer ${token}` // 헤더에 토큰 포함
        },
        params: { 
          foodYear,
          foodMonth,
        }
      })
      set({ calendarData: response.data.foods })
    } catch (error) {
      console.error('캘린더 데이터 요청 실패', error)
    }
  },
  deleteCalendar: async (id:string) => {
    console.log('딜리트 아이디 잘 받았나?', id)
    const token = await AsyncStorage.getItem('accessToken')
    try {
      const response = await axios.delete('mozzi/diary/deletemydiary', {
        headers: {
          Authorization: `Bearer ${token}` // 헤더에 토큰 포함
        },
        params: { 
          id,
        }
      })
    } catch (error) {
      console.error('다이어리 디테일 삭제 실패', error)
    }
  }, 
}))

export default useDiaryStore
