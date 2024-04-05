import React, { useState, useRef } from 'react'
import { View, Image, TouchableOpacity, PermissionsAndroid, ToastAndroid, Text } from 'react-native';
import Share from 'react-native-share'
import Snackbar from 'react-native-snackbar'
import { CameraRoll } from '@react-native-camera-roll/camera-roll'
import { captureRef } from 'react-native-view-shot'
import LongButton from '../../components/Button/LongButton';
import { Header } from '../../components/Header/Header'
import styled from 'styled-components/native'

const Container = styled(View)`
  flex: 1;
  background-color: ${(props) => props.theme.palette.background};
  align-items: center;
  padding: 0 16px 0 16px;
`;

const HeaderText = styled(Text)`
  color: ${(props) => props.theme.palette.font};
  font-family: ${(props) => props.theme.fonts.title};
  font-size: 28px;
  margin-bottom: 20px;
  align-self: flex-start;
`

const Body = styled.View`
  position: relative;
  align-self: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  /* aspect-ratio: 1; */
  border-radius: 20px;
  background-color: ${(props) => props.theme.palette.point};;
`
const FoodTitle = styled(Text)`
  font-family: ${(props) => props.theme.fonts.title};
  padding: 5px;
  position: absolute;
  font-size: 16px;
  z-index: 1001;
  left: 5%;
  top: ${({ frameType }) => {
    switch (frameType) {
      case '화이트':
        return '5%';
      case '스페셜':
        return '87%';
      default:
        return '5%';
    }
  }};
  color: ${({ frameType }) => {
    switch (frameType) {
      case '화이트':
        return 'white';
      case '스페셜':
        return 'black';
      default:
        return 'black';
    }
  }};
`;

const Day = styled(Text)`
  font-family: ${(props) => props.theme.fonts.content};
  padding: 5px;
  position: absolute;
  font-size: 12px;
  z-index: 1001;
  left: 5%;
  top: ${({ frameType }) => {
    switch (frameType) {
      case '화이트':
        return '12%';
      case '스페셜':
        return '5%';
      default:
        return '12%';
    }
  }};
  color: ${({ frameType }) => {
    switch (frameType) {
      case '화이트':
        return 'white';
      case '스페셜':
        return 'black';
      default:
        return 'black';
    }
  }};
`

const FoodImage = styled.Image`
  width: 100%;
  aspect-ratio: 1;
`

const FramesContainer = styled(View)`
  width: 100%;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 20px;
  margin-bottom: 20px;
`;

const FrameButton = styled.TouchableOpacity`
  background-color: ${(props) => props.theme.palette.pointDark};
  border-radius: 10px;
  padding: 5px;
  width: 100px;
`

const FrameText = styled(Text)`
  color: ${(props) => props.theme.palette.font};
  font-family: ${(props) => props.theme.fonts.content};
  text-align: center;
`

const ShareButton = styled(TouchableOpacity)`
  height: 60px;
  width: 100%;
  border-radius: 20px;
  padding: 16px;
  margin-top: 5px;
  margin-bottom: 5px;
  align-items: center;
  background-color: ${(props) => props.theme.palette.point};;
`;

const ShareButtonText = styled(Text)`
  color: ${(props) => props.theme.palette.font};
  font-family: ${(props) => props.theme.fonts.content};
  font-size: 16px;
`;

const FrameImage = styled.Image`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Stamp = ({ navigation, route }) => {
  const { date, data } = route.params;
  const viewRef = useRef();
  const [selectedFrame, setSelectedFrame] = useState('기본');

  // props 받아온 정보
  console.log('이거보여줘', date, data)

  // 선택 가능한 프레임 목록
  // 프레임 이미지 경로를 객체로 관리
  const frameImages = {
    '기본': require('../../assets/frames/defaultframe.png'),
    '화이트': require('../../assets/frames/whiteframe_1.png'),
    '스페셜': require('../../assets/frames/speacialframe.png'),
  };

  // 권한 확인
  const hasStoragePermission = async () => {
    // console.log(Data)
    if (Platform.OS === 'android') {
      const hasPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        
      )
      // console.log('hi')
      if (!hasPermission) {
        const status = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
        )
        return status === PermissionsAndroid.RESULTS.GRANTED
      }
      return true
    }
    return true
  }
  
  // 사진 저장 함수
  const saveEditedImg = async () => {
    if (!(Platform.OS === 'android') && !(await hasStoragePermission())) {
      console.log('hi')
      return
    }  

    try {
      // viewRef를 이용하여 현재 보여지는 화면을 캡쳐
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.8,
      });
      console.log('캡처된 이미지 URI:', uri)

      // 캡쳐된 이미지를 갤러리에 저장
      const result = await CameraRoll.save(uri, { type: 'photo' })
      console.log('갤러리에 저장된 이미지:', result)

      // 저장 성공 알림
      Snackbar.show({
        text: '사진이 갤러리에 저장되었습니다.',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (error) {
      console.error('사진 저장 중 오류 발생:', error)
      Snackbar.show({
        text: '사진을 저장하는 중 오류가 발생했습니다.',
        duration: Snackbar.LENGTH_SHORT,
      });
    }
  };

  // 이미지 공유 함수
  const shareEditedImg = async () => {
    if (!(Platform.OS === 'android') && !(await hasStoragePermission())) {
      console.log('hi')
      return
    }  

    try {
      // viewRef를 이용하여 현재 보여지는 화면을 캡쳐
      const uri = await captureRef(viewRef.current, {
        format: 'png',
        quality: 0.8,
      });
      console.log('캡처된 이미지 URI:', uri)

      // 캡쳐된 이미지를 공유 옵션에 설정
      const shareOptions = {
        title: '공유하기',
        message: '모찌에서 레시피 구경할래?',
        url: uri,
      };
  

      // 공유 실행
      const result = await Share.open(shareOptions)
      console.log('공유 결과:', result)
    } catch (error) {
      console.error('이미지 공유 중 오류 발생:', error)
    }
  };


  return (
    <>
      <Header>
        <Header.Icon iconName="arrow-back" onPress={navigation.goBack} />
      </Header>

      <Container>
        <HeaderText>공유 프레임 선택하기</HeaderText>
        

        <Body ref={viewRef}>
          {/* store에서 불러온 food title로 수정하면 됨 */}
          <FoodTitle frameType={selectedFrame}>{data.foodName}</FoodTitle> 
          <Day frameType={selectedFrame}>{data.photoDate}</Day>
          <FoodImage
            source={{ uri: `${data.photoUrl}` }}
          />
          {/* <FoodImage source={photo} /> */}
          {/* 선택된 프레임을 이미지 위에 표시 */}
          {selectedFrame && (
            <FrameImage source={frameImages[selectedFrame]} resizeMode="contain" />
          )}
        </Body>

        <FramesContainer>
          {Object.keys(frameImages).map((frame, index) => (
            <FrameButton key={index} onPress={() => setSelectedFrame(frame)}>
              <FrameText>{frame}</FrameText>
            </FrameButton>
          ))}
        </FramesContainer>

        {/* 이미지 공유하기 버튼 */}
        <LongButton 
          text="공유하기"
          onPress={shareEditedImg}
        />
        <LongButton 
          text="저장하기"
          onPress={saveEditedImg}
        />
      </Container>
    </>
  );
};

export default Stamp;
