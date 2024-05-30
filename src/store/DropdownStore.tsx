import { create } from 'zustand'


interface DropdownState {
  dropdownData: string[]
  isVeganData: boolean
  setDropdownData: (data: string[]) => void
  setIsVeganData: (data: boolean) => void
  dropdownReset: () => void
}


const useDropdownStore = create<DropdownState>((set) => ({
  dropdownData: [],
  setDropdownData: (data) => {
    set({ dropdownData: data })
  },

  isVeganData: false,
  setIsVeganData: (data) => {
    set({ isVeganData: data })
  },

  // 탈퇴 시 로직
  dropdownReset: () => set({ dropdownData: [], isVeganData: false }),
}))

export default useDropdownStore
