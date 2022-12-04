import * as React from 'react';
import Svg, { Circle, Line, Path } from 'react-native-svg';

export default function Percentage(props) {
  return (
    <Svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Circle cx="13.4613" cy="12.6928" r="4.23091" stroke="#1A0826" strokeWidth="1.53846" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="26.539" cy="27.3081" r="4.23091" stroke="#1A0826" strokeWidth="1.53846" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M9.23035 30.3872L29.6156 10.002" stroke="#1A0826" strokeWidth="1.53846" strokeLinecap="round" strokeLinejoin="round" />
      <Line x1="0.961534" y1="39.8077" x2="39.0385" y2="39.8077" stroke="#1A0826" strokeWidth="0.384615" strokeLinecap="round" />
    </Svg>
  );
}
