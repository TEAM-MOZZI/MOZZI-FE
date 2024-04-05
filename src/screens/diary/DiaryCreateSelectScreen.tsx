import React, { useEffect, useState } from 'react'
import styled from 'styled-components/native'
import { TouchableOpacity, Text } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { useNavigation } from '@react-navigation/native'

import SmallButton from '../../components/Button/SmallButton'
import { Header } from '../../components/Header/Header'
import { SearchBar } from '../../components/AutoWord/SearchRecipe'
import axios from '../../../axios'
import useRecipeStore from '../../store/RecipeStore'

interface FoodItem {
  photoUrl: string
  foodName: string
}

function DiaryCreateSelectScreen () {
  const navigation = useNavigation()
  const [recipeData, setRecipeData] = useState<FoodItem[] | null>(null)
  const [selectedRecipeName, setSelectedRecipeName] = useState<string>('')
  
  const handleSearch = () => {
    navigation.navigate('DiaryCreate', {
      recipeName: selectedRecipeName,
    })
  }

  const handleSelectRecipe = (recipeName: string) => {
    setSelectedRecipeName(recipeName)
  }

  const getRecipeList = async () => {
    try {
      const response = await axios.get('recommend/datas/get_recipe_list/')
      setRecipeData(response.data.foods)
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getRecipeList()
  }, [])

  return (
    <>
      <Header>
        <Header.Icon iconName="arrow-back" onPress={navigation.goBack} />
      </Header>
      <Container>
        {recipeData && <SearchBar data={recipeData} onSelect={handleSelectRecipe} />}
        <EnterContainer>
          <SmallButton
            text="확인"
            onPress={handleSearch}
            style={{
              marginTop: 70,
              zIndex: -10,
            }}
          />
        </EnterContainer>
      </Container>
    </>
  )
}

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.theme.palette.background};
  padding: 10px 16px 0 16px;
`

const EnterContainer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: flex-end;
`

export default DiaryCreateSelectScreen
