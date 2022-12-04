import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function cashIcon({ color }) {
  return (
    <Svg width="38" height="38" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M21.75 6H2.25C1.83579 6 1.5 6.33579 1.5 6.75V17.25C1.5 17.6642 1.83579 18 2.25 18H21.75C22.1642 18 22.5 17.6642 22.5 17.25V6.75C22.5 6.33579 22.1642 6 21.75 6Z" stroke={color} stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={color} stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M16.5 6L22.5 11.25" stroke={color} stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M16.5 18L22.5 12.75" stroke={color} stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M7.5 6L1.5 11.25" stroke={color} stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M7.5 18L1.5 12.75" stroke={color} stroke-width="1.125" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
  );
}
