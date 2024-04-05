import { View, Text, Button, TouchableOpacity, Platform } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet, Image  } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialIcons'
import { launchImageLibrary } from 'react-native-image-picker'
import { format } from 'date-fns'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import { Header } from '../../components/Header/Header'
import LongButton from '../../components/Button/LongButton'
import SmallButton from '../../components/Button/SmallButton'
import axios from 'axios'
import styled from 'styled-components/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ImagePicker from 'react-native-image-crop-picker'
 
// Styled components definitions
const Container = styled(View)`
  flex: 1;
  background-color: ${(props) => props.theme.palette.background};
  align-items: center;
  padding: 16px;
`

const DateContainer = styled(View)`
  width: 100%;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
`;

const DateText = styled(Text)`
  font-weight: 600;
  color: ${(props) => props.theme.palette.font};
  font-family: ${(props) => props.theme.fonts.content};
`

const Line = styled(View)`
  border-bottom-color: ${(props) => props.theme.palette.light};
  border-bottom-width: 1px;
  width: 100%;
  align-self: center;
  margin-bottom: 20px;
`

const ImageContainer = styled(View)`
  border: 1px solid ${(props) => props.theme.palette.light};;
  background-color: ${(props) => props.theme.palette.background};
  width: 100%;
  aspect-ratio: 1;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
`

const ImageInnerContainer = styled(TouchableOpacity)`
  border-width: 1px;
  border-color: ${(props) => props.theme.palette.light};;
  border-radius: 10px;
  border-style: dotted;
  width: 90%;
  height: 90%;
  justify-content: center;
  align-items: center;
`

const ImageButton = styled(TouchableOpacity)`
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`

const ImagePlaceholderText = styled(Text)`
  font-size: 24px;
  color: ${(props) => props.theme.palette.light};
  font-family: ${(props) => props.theme.fonts.content};
`

const EnterContainer = styled(View)`
  width: 100%;
  margin-top: 50px;
  flex-direction: row;
  justify-content: flex-end;
`

const CalendarButton = styled(TouchableOpacity)`
  padding: 10px;
  border-radius: 20px;
`

function DiaryCreateScreen () {
  
  const navigation = useNavigation()

  const moveDiaryCreateSelect = () => {
    navigation.navigate("DiaryCreateSelect")
  }

  const goBack = () => {
   navigation.goBack()
  }

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true)
  }

  const hideDatePicker = () => {
    setDatePickerVisibility(false)
  }

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedrecipe, setSelectedrecipe] = useState<number | null>(null)
  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date)
    setSelectedDate(date)
    hideDatePicker()
  }


  const [imageUri, setImageUri] = useState<string | undefined>()
  const [imageType, setImageType] = useState<string | undefined>()
  const [imageName, setImageName] = useState<string | undefined>()
  const route = useRoute()
  const [selectedRecipeName, setSelectedRecipeName] = useState<string>('')

  const [isButtonEnabled, setIsButtonEnabled] = useState(false)

  useEffect(() => {
    // route.params에서 데이터 가져오기
    if (route.params) {
      const { recipeName } = route.params as { recipeName: string }
      setSelectedRecipeName(recipeName)
    }

    return () => {
      selectedRecipeName
    }
  }, [route.params])

  useEffect(() => {
    // 모든 조건(날짜 선택, 레시피 선택, 사진 첨부)이 충족되었는지 확인
    if (selectedDate && selectedRecipeName && imageUri) {
      setIsButtonEnabled(true) // 모든 조건이 충족되면 버튼을 활성화
    } else {
      setIsButtonEnabled(false) // 하나라도 충족되지 않으면 버튼을 비활성화
    }
  }, [selectedDate, selectedRecipeName, imageUri])

  const handleCreateDiaryPress = () => {
    if (isButtonEnabled) {
      createDiary()
    } else {
      console.log('모든 정보를 입력해주세요.')
    }
  }

  const handleChoosePhoto = () => {
    ImagePicker.openPicker({
      width: 768,
      height: 768,
      cropping: true,
      cropperCircleOverlay: false,
      compressImageMaxWidth: 768,
      compressImageMaxHeight: 768,
      mediaType: 'photo',
    }).then(image => {
      console.log(image.path)
      setImageUri(image.path)
      setImageType(image.mime)
      setImageName(image.path.split('/').pop()) // 이미지 경로에서 파일명 추출
    }).catch(error => {
      if (error.code === 'E_PICKER_CANCELLED') {
        console.log('User cancelled image picker')
      } else {
        console.error('ImagePicker Error: ', error.message)
      }
    })
  }

  // const storageData = AsyncStorage.getItem("accessToken")
  // console.log("--------------", JSON.parse({storageData}))


  const formData = new FormData()
    if (selectedDate) {
      formData.append('photoDate', format(selectedDate, 'yyyy-MM-dd'))
    }
    if (selectedRecipeName) {
      formData.append('foodName', selectedRecipeName)
    }
    // formData.append('nickName', nickName)
    if (imageUri && imageType && imageName) {
      // 안드로이드에서는 파일 경로의 수정이 필요함
      // const imagePath = Platform.OS === 'android' ? imageUri.replace('file://', '') : imageUri
      
      formData.append('photo', {
        name: imageName,
        type: imageType,
        uri: imageUri,
        // uri: 'http://www.foodsafetykorea.go.kr/uploadimg/20141118/20141118102019_1416273619379.jpg',
      }) 
    }

  const createDiary = async () => {
    const token = await AsyncStorage.getItem('accessToken')
    try {
      // console.log(formData)
      console.log(formData.getAll('photo'))

      //http://a304.site/api/mozzi/diary/setmydiary
      // axios.get('/recommend/get_ingredients_from_refrigerator/
      const response = await axios.post(`https://a304.site/api/mozzi/diary/setmydiary`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-type': 'multipart/form-data',
        },
        transformRequest: (data) => {
          return data
        },
      })
      console.log(response.data)
      navigation.reset({
        index: 0,
        routes: [{ name: 'Diary' }],
      })
    } catch (error) {
      //응답 실패
      console.error(error)
    }
  }

  return (
    <>
      <Header>
        <Header.Icon iconName="arrow-back" onPress={goBack} />
      </Header>
      <Container>
        <DateContainer>
          <CalendarButton onPress={showDatePicker}>
            <Icon name="calendar-month" size={32}/>
          </CalendarButton>
            {selectedDate && (
              <DateText>{format(selectedDate, 'yyyy-MM-dd')}</DateText>
            )}
        </DateContainer>
        <Line />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          maximumDate={new Date()}
        />
        <ImageContainer>
          <ImageInnerContainer onPress={handleChoosePhoto}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: '105%', height: '105%' }} 
              />
            ) : (
              <ImageButton onPress={handleChoosePhoto}>
                <ImagePlaceholderText>사진 첨부</ImagePlaceholderText>
              </ImageButton>
              
            )}
           </ImageInnerContainer>
        </ImageContainer>
        <LongButton
          onPress={moveDiaryCreateSelect}
          iconName="menu-book"
          text={selectedRecipeName ? selectedRecipeName : '레시피 불러오기'}
          style={{
            flexDirection: "row"
          }}
        />
        <EnterContainer>
          <LongButton 
            onPress={handleCreateDiaryPress}
            text="등록"
            disabled={!isButtonEnabled}
          />
        </EnterContainer>
      </Container>
    </>
  )
}

export default DiaryCreateScreen