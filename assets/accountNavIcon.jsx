import * as React from 'react';
import Svg, { Path } from 'react-native-svg';
import PropTypes from 'prop-types';

function AccountNavIcon({ size, color }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <Path d="M15.6693 14.6667C12.7238 14.6667 10.3359 12.2789 10.3359 9.33333C10.3359 6.38781 12.7238 4 15.6693 4C18.6147 4 21.0026 6.38781 21.0026 9.33333C21.0026 12.2789 18.6147 14.6667 15.6693 14.6667Z" stroke={color} stroke-width="2" stroke-linecap="round" />
      <Path d="M5 27.9974V26.6641C5 22.2458 8.58172 18.6641 13 18.6641H18.3333C22.7516 18.6641 26.3333 22.2458 26.3333 26.6641V27.9974" stroke={color} stroke-width="2" stroke-linecap="round" />
    </Svg>
  );
}

AccountNavIcon.propTypes = {
  size: PropTypes.string,
  color: PropTypes.string,
};

AccountNavIcon.defaultProps = {
  size: '32',
  color: '#AA8FFF',
};

export default AccountNavIcon;
