/* eslint-disable import/prefer-default-export */
import React, { useState } from 'react';

export const useForceUpdate = () => {
  const [value, setValue] = useState(0); // integer state
  return () => setValue(value + 1); // update the state to force render
};
