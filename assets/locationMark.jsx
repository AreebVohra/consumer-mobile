import * as React from 'react';
import Svg, {
  Path, G, Defs, Stop, LinearGradient,
} from 'react-native-svg';

export default function LocationMark(props) {
  return (
    <Svg width="18" height="19" viewBox="0 0 18 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M9 10.1C9.99411 10.1 10.8 9.29411 10.8 8.3C10.8 7.30589 9.99411 6.5 9 6.5C8.00588 6.5 7.2 7.30589 7.2 8.3C7.2 9.29411 8.00588 10.1 9 10.1Z" stroke="#411361" stroke-linecap="round" stroke-linejoin="round" />
      <Path d="M9 3.5C7.72696 3.5 6.50606 4.00571 5.60588 4.90589C4.70571 5.80606 4.2 7.02696 4.2 8.3C4.2 9.4352 4.4412 10.178 5.1 11L9 15.5L12.9 11C13.5588 10.178 13.8 9.4352 13.8 8.3C13.8 7.02696 13.2943 5.80606 12.3941 4.90589C11.4939 4.00571 10.273 3.5 9 3.5V3.5Z" stroke="#411361" stroke-linecap="round" stroke-linejoin="round" />
    </Svg>
  );
}
