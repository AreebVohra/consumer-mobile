import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function creditCardIcon(props) {
  return (

    <Svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M13 14H19V16H13V14Z" fill="#AA8FFF" />
      <Path d="M11 14H7V16H11V14Z" fill="#AA8FFF" />
      <Path fill-rule="evenodd" clip-rule="evenodd" d="M4.00008 4C2.34543 4 1.00001 5.33751 1.00002 6.99665L1.00002 8.99379L1 9L1.00002 9.00621L1 17.0037C0.999987 18.663 2.34557 20 4 20H20C21.6544 20 23 18.663 23 17.0037V9.00592L23 9L23 8.99408V6.99654C23 5.33743 21.6546 4 20 4H4.00008ZM21 8V6.99654C21 6.44651 20.5545 6 20 6H4.00008C3.44552 6 3.00002 6.44655 3.00002 6.99663L3.00002 8H21ZM3.00002 10L3 17.0037C3 17.5536 3.44528 18 4 18H20C20.5547 18 21 17.5536 21 17.0037V10H3.00002Z" fill="#AA8FFF" />
    </Svg>
  );
}
