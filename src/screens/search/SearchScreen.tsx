import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import styled from 'styled-components/native'

import SmallButton from '../../components/Button/SmallButton'
import { SearchBar } from '../../components/AutoWord/SearchRecipe'
import { Header } from '../../components/Header/Header'
import { useNavigation } from '@react-navigation/native'

import useRecipeStore from '../../store/RecipeStore'


const Container = styled(View)`
  flex: 1;
  background-color: ${(props) => props.theme.palette.background};
  padding: 10px 16px 0 16px;
`

const SearchView = styled(View)`
  width: 100%;
`

const SelectedText = styled(Text)`
  padding-left: 15px;
  font-size: 16;
  font-family: ${(props) => props.theme.fonts.content};
  color: ${(props) => props.theme.palette.font};
  margin-bottom: 20;
  z-index: -10;
`

function SearchScreen () {
  
  const navigation = useNavigation()
  const { getRecipe, recipeData, ingredientData, getRecipeDetail } = useRecipeStore()

  const [ selectedRecipeName, setSelectedRecipeName ] = useState<string>('')

  const handleSelectRecipe = (recipeName: string) => {
    setSelectedRecipeName(recipeName)
  }

  const moveRecipe = () => {
    if (selectedRecipeName) {
      getRecipeDetail(selectedRecipeName)
    }
    navigation.navigate("Recipe")
  }

  useEffect(() => {
    getRecipe()
  }, [])
  
  return (
    <>
      <Header>
        <Header.Icon iconName="arrow-back" onPress={navigation.goBack} />
      </Header>
      <Container>

        <SearchView>
          <SearchBar data={recipeData} onSelect={handleSelectRecipe}/>
        </SearchView>

        {selectedRecipeName && (selectedRecipeName === ingredientData) ?
        <SelectedText>
          {selectedRecipeName}의 레시피로 이동할까요?
        </SelectedText> : ''
        }
        <SmallButton
          text="이동"
          onPress={moveRecipe}
          style={{
            marginTop: 20,
            zIndex: -10,
          }}
        />
      </Container>
    </>
  )
}

export default SearchScreen