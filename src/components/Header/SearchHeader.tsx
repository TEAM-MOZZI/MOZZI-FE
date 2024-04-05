import React, { ReactElement } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWindowDimensions } from 'react-native';
import styled from 'styled-components/native';
import { HeaderIcon } from './HeaderButton';
// import { HeaderTitle } from './HeaderTitle';

type CompoundComposition = {
  Icon: React.FC<{
    onPress: () => void;
    iconName: string;
  }>
}

const Container = styled.View<{ paddingTop: number }>`
  padding-top: ${({ paddingTop }) => paddingTop}px;
  background-color: #FFFEF2;
`

const HeaderContainer = styled.View<{ width: number }>`
  width: ${({ width }) => width}px;
  display: flex;
  align-items: flex-end;
  height: 40px;
  margin-top: 20px;
  padding-right: 16px;
  background-color: #FFFEF2;
`

export const SearchHeader: React.FC<{
  children: ReactElement[] | ReactElement;
}> &
  CompoundComposition = (props) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  return (
    <Container paddingTop={insets.top}>
      <HeaderContainer width={width}>
        {props.children}
      </HeaderContainer>
    </Container>
  );
};

SearchHeader.Icon = HeaderIcon;
