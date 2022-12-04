/* eslint-disable global-require */
import React from 'react';
import { Icon as UIKittenIcon } from '@ui-kitten/components';

// eslint-disable-next-line arrow-body-style
const Icon = (props, name, type = 'regular') => {
  return (
    <UIKittenIcon {...props} name={name} />
  );
};

export default Icon;
