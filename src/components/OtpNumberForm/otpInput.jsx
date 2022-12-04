/* eslint-disable react/prop-types */
import React from 'react';
import { Input } from '@ui-kitten/components';

const OtpInput = ({ otpInputRef, nextInputRef, value, setValue, prevOtpInputRef, setPrevValue, handleSubmit, maxLength = 1 }) => (
  <Input
    ref={otpInputRef}
    status="control"
    style={{
      fontWeight: '600',
      textAlign: 'center',
      width: 30,
      height: 40,
      borderRadius: 4,
      border: 2,
      borderColor: value ? '#AA8FFF' : '#CCC',
      backgroundColor: value ? '#AA8FFF' : '#FFF',
      marginRight: 16,
    }}
    textStyle={{
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 25,
      color: '#FFF',
    }}
    textAlign="center"
    keyboardType="numeric"
    value={value}
    maxLength={maxLength}
    onKeyPress={({ nativeEvent }) => {
      const { key } = nativeEvent;
      if (key === 'Backspace') {
        if (value) {
          setValue('');
        } else if (setPrevValue && prevOtpInputRef) {
          setPrevValue('');
          prevOtpInputRef.current.focus();
        }
      }
    }}
    onChangeText={(text) => {
      setValue(text);
      if (nextInputRef) {
        nextInputRef.current.focus();
      } else {
        handleSubmit(text);
      }
    }}
    blurOnSubmit={false}
  />
);

export default OtpInput;
