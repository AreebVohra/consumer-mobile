import * as React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export default function UploadPhotoIcon() {
  return (
    <Svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="15" cy="15" r="15" fill="#AA8FFF" />
      <Path d="M15 7.44141V15.001V22.5607" stroke="white" />
      <Path d="M7 15L15 15L23 15" stroke="white" />
    </Svg>
  );
}
