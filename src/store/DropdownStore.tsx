import { create } from 'zustand'
import axios from '../../axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const useDropdownStore = create((set) => ({
  
  dropdownData: [],
  setDropdownData: (data) => {
    set({ dropdownData: data })
  },

  isVeganData: [],
  setIsVeganData: (data) => {
    set({ isVeganData: data })
  },

  // 탈퇴 시 로직
  dropdownReset: () => set({ dropdownData: [], }),
}))

export default useDropdownStore
