import * as React from 'react';
import Svg, { Path, G, Circle } from 'react-native-svg';

export default function VisaLogo(props) {
  return (
    <Svg viewBox="0 0 52 32" xmlns="http://www.w3.org/2000/svg">
      <G fill="none" fillRule="evenodd">
        <Circle cx="36" cy="16" fill="#f79e1b" r="16" />
        <Circle cx="16" cy="16" fill="#eb001b" r="16" />
        <Path d="m26 3.50925809c3.6578499 2.93224206 6 7.43797271 6 12.49074191s-2.3421501 9.5584999-6 12.4907419c-3.6578499-2.932242-6-7.4379727-6-12.4907419s2.3421501-9.55849985 6-12.49074191z" fill="#ff5f00" />
      </G>
    </Svg>
  );
}
