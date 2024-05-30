import { create } from 'zustand'
import axios from '../../axios'
import AsyncStorage from '@react-native-async-storage/async-storage'


interface FoodItem {
  ingredientName: string
  isLike: number
  mainAllergy?: string
}

interface ProfileData {
  nickname?: string
  isVegan?: boolean
  foods?: FoodItem[]
}

interface Form {
  nickname: string
  Info: any[]
  isVegan: boolean
}

interface ProfileStore {
  profileData: ProfileData
  foodInfo: any[]
  setFoodInfo: (foodInfo: any[]) => void
  form: Form
  setForm: (newForm: Form) => void
  getProfile: () => Promise<void>
  editNickname: (nickname: string) => Promise<void>
  editIsVegan: (isVegan: boolean) => Promise<void>
  editFoodInfo: (foods: any[]) => Promise<void>
  profileReset: () => void
}


const useProfileStore = create<ProfileStore>((set) => ({
  profileData: {},
  foodInfo: [],
  setFoodInfo: (foodInfo) => {
    set({ foodInfo })
  },

  form: {
    nickname: '',
    Info: [],
    isVegan: false,
  },
  setForm: (newForm) => {
    set({ form: newForm })
  },
  
  getProfile: async () => {
    const token = await AsyncStorage.getItem('accessToken')
    try {
      const response = await axios.get('mozzi/auth/getUserProfile', {
        headers: {
          Authorization: `Bearer ${token}` // 헤더에 토큰 포함
        }
      })
      set({ profileData: response.data })
      set((state) => ({
        form: { // profileData를 사용하여 form 초기값 설정
          ...state.form,
          nickname: response.data.nickname,
          isVegan: response.data.isVegan
        }
      }))
    } catch (error) {
      console.error('프로필 데이터 요청 실패', error)
    }
  },

 // 닉네임 변경
  editNickname: async (nickname) => {
    const token = await AsyncStorage.getItem('accessToken')
    try {
      const response = await axios.patch('mozzi/auth/setnickname', {
        nickname
      }, {
        headers: {
          Authorization: `Bearer ${token}` // 헤더에 토큰 포함
        }
      })
      set((state) => ({
        profileData: {
          ...state.profileData,
          nickname: response.data.nickname,
        }
      }))
    } catch (error) {
      console.error('닉네임 변경 실패', error)
    }
  }, 
  
  // 비건 여부 변경
  editIsVegan: async (isVegan) => {
    const token = await AsyncStorage.getItem('accessToken')
    try {
      const response = await axios.patch('mozzi/auth/setvegan', {
        isVegan
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      })

      set((state) => ({
        profileData: {
          ...state.profileData,
          isVegan: response.data.isVegan,
        }
      }))
    } catch (error) {
      console.error('비건 여부 변경 실패', error)
    }
  },

   // 음식 정보 변경
   editFoodInfo: async (foods) => {
    const token = await AsyncStorage.getItem('accessToken')
    try {
      const response = await axios.post('mozzi/auth/setfood', {
        foods
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('음식 정보 변경 성공', response.data)

    } catch (error) {
      console.error('음식 정보 변경 실패', error)
    }
  },

  // 탈퇴 시 로직
  profileReset: () => set({
    profileData: {},
    foodInfo: [],
    form: {
      nickname: '',
      Info: [],
      isVegan: false,
    }
  }),
  
}))

export default useProfileStore
