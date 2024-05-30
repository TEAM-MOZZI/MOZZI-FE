import React from 'react';
import { Dimensions, Text, TouchableOpacityProps, TouchableOpacity } from 'react-native';
import Svg, { Rect, Circle } from 'react-native-svg'
import styled from 'styled-components/native'
import { useNavigation } from '@react-navigation/native'

// 이미지 리소스 import
import bread from '../../assets/fridge/bread.png'
import fruit from '../../assets/fridge/fruit.png'
import meat from '../../assets/fridge/meat.png'
import milk from '../../assets/fridge/milk.png'
import noodle from '../../assets/fridge/noodle.png'
import rice from '../../assets/fridge/rice.png'
import sauce from '../../assets/fridge/sauce.png'
import seafood from '../../assets/fridge/seafood.png'
import vege from '../../assets/fridge/vege.png'

// TouchableItem의 props에 대한 인터페이스 정의
interface TouchableItemProps extends TouchableOpacityProps {
  top: number;
  left?: number;
  right?: number;
}

// 화면 크기에 따른 상대적 위치 계산을 위한 변수들
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const fridgeWidth = 320; // 20px margin on each side
const fridgeHeight = 590; // 가상의 높이, 비율은 조정 필요
const shelfHeight = fridgeHeight / 5; // 선반의 높이

const Container = styled.View`
  flex: 1;
  align-items: center;
  background-color: ${(props) => props.theme.palette.background};
`;

const Title = styled(Text)`
  color: ${(props) => props.theme.palette.font};
  font-family: ${(props) => props.theme.fonts.title};
  font-size: 36px;
  margin: 40px 0 20px 0;
  padding-left: 32px;
  width: 100%;
`;

const StyledSvg = styled(Svg).attrs({
  height: fridgeHeight,
  width: fridgeWidth,
  viewBox: `0 0 ${fridgeWidth} ${fridgeHeight}`,
})``;

const StyledRect = styled(Rect)``;
const StyledCircle = styled(Circle)``;

const ImageIcon = styled.Image`
  width: 50px;
  height: 50px;
`;

const ShelfItemText = styled(Text)`
  font-family: ${(props) => props.theme.fonts.title};
  font-size: 12px;
  color: ${(props) => props.theme.palette.font};
  margin-top: 4px;
  text-align: center;
`;

const TouchableItem = styled.TouchableOpacity<TouchableItemProps>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left ? props.left + 'px' : undefined};
  right: ${props => props.right ? props.right + 'px' : undefined};
`;

const FridgeScreen = () => {
  const navigation = useNavigation();

  const navigateToFridgeDetail = (item) => {
    navigation.navigate('FridgeDetail', { item });
  };

  return (
    <Container>
      <Title>나의 냉장고</Title>
      <StyledSvg>
        {/* 냉장고 테두리 */}
        <StyledRect
          x="10"
          y="10"
          width={fridgeWidth - 20}
          height={fridgeHeight - 20}
          fill="#FFFEF2"
          stroke="#CFDEEE"
          strokeWidth="20"
          rx="30"
          ry="30"
        />
        {/* 선반들 */}
        {[1.1, 2.2, 3.3].map((multiplier, index) => (
          <StyledRect
            key={index}
            x="20"
            y={(fridgeHeight / 5) * multiplier}
            width={fridgeWidth - 40}
            height="5"
            fill="#CFDEEE"
          />
        ))}
        {/* 야채칸, 서랍 손잡이 */}
        {/* 야채칸 */}
        <StyledRect
          x="30"
          y={fridgeHeight / 5 * 3.3 + 16}
          width={(fridgeWidth - 90) / 2 + 10}
          height={shelfHeight + 35}
          fill="#FFFEF2"
          stroke="#CFDEEE"
          strokeWidth="2"
          rx="5"
        />
        {/* 서랍 손잡이 */}
        <StyledCircle
          cx={fridgeWidth / 4 + 15}
          cy={fridgeHeight / 5 * 3.3 + 40}
          r="8"
          stroke="#CFDEEE"
          strokeWidth="2"
          fill="#FFFEF2"
        />
        <StyledRect
          x={fridgeWidth / 2 + 5}
          y={fridgeHeight / 5 * 3.3 + 16}
          width={(fridgeWidth - 90) / 2 + 10}
          height={shelfHeight + 35}
          fill="#FFFEF2"
          stroke="#CFDEEE"
          strokeWidth="2"
          rx="5"
        />
        <StyledCircle
          cx={fridgeWidth / 2 * 1.5 - 10}
          cy={fridgeHeight / 5 * 3.3 + 40}
          r="8"
          stroke="#CFDEEE"
          strokeWidth="2"
          fill="#FFFEF2"
        />
      </StyledSvg>

      {/* 아이템들 */}
      <TouchableItem top={160} left={60} onPress={() => navigateToFridgeDetail({ name: '정육/계란류', img: meat, storedPos: 1 })}>
        <ImageIcon source={meat} />
        <ShelfItemText>정육/계란류</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={160} left={0} onPress={() => navigateToFridgeDetail({ name: '수산물/건해산', img: seafood, storedPos: 2 })}>
        <ImageIcon source={seafood} />
        <ShelfItemText>수산물/건해산</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={290} left={0} onPress={() => navigateToFridgeDetail({ name: '쌀/잡곡/견과', img: rice, storedPos: 3 })}>
        <ImageIcon source={rice} />
        <ShelfItemText>쌀/잡곡/견과</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={290} right={60} onPress={() => navigateToFridgeDetail({ name: '우유/유제품', img: milk, storedPos: 4 })}>
        <ImageIcon source={milk} />
        <ShelfItemText>우유/유제품</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={420} left={60} onPress={() => navigateToFridgeDetail({ name: '베이커리/간식', img: bread, storedPos: 5 })}>
        <ImageIcon source={bread} />
        <ShelfItemText>베이커리/간식</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={420} left={0} onPress={() => navigateToFridgeDetail({ name: '양념/오일', img: sauce, storedPos: 6 })}>
        <ImageIcon source={sauce} />
        <ShelfItemText>양념/오일</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={420} right={60} onPress={() => navigateToFridgeDetail({ name: '통조림/면류', img: noodle, storedPos: 7 })}>
        <ImageIcon source={noodle} />
        <ShelfItemText>통조림/면류</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={580} left={85} onPress={() => navigateToFridgeDetail({ name: '야채', img: vege, storedPos: 8 })}>
        <ImageIcon source={vege} />
        <ShelfItemText>야채</ShelfItemText>
      </TouchableItem>

      <TouchableItem top={580} right={85} onPress={() => navigateToFridgeDetail({ name: '과일', img: fruit, storedPos: 9 })}>
        <ImageIcon source={fruit} />
        <ShelfItemText>과일</ShelfItemText>
      </TouchableItem>
    </Container>
  );
};

export default FridgeScreen;
