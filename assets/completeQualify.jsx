import * as React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

export default function CompleteQualify(props) {
  return (
    <Svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Rect width="20" height="20" rx="8" fill="#411361" />
      <Path d="M15.7171 7.65086L8.98704 14.4435C8.61234 14.8219 8.01281 14.8219 7.6381 14.4435L4.28103 11.0253C3.90632 10.6469 3.90632 10.0361 4.28103 9.65822C4.65574 9.27981 5.25527 9.27981 5.62997 9.65822L8.32786 12.3929L14.3828 6.28381C14.7575 5.9054 15.357 5.9054 15.7318 6.28381C16.0918 6.66166 16.0918 7.27245 15.7171 7.65086H15.7171Z" fill="white" />
    </Svg>
  );
}
