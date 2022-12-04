/* eslint-disable react/prop-types */
import React from 'react';
import { Input } from '@ui-kitten/components';

const OtpNumberInputField = ({ otpInputRef, nextInputRef, value, setValue, prevOtpInputRef, setPrevValue, handleSubmit }) => (
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
      borderColor: '#CCC',
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
    maxLength={1}
    onKeyPress={({ nativeEvent }) => {
      const { key } = nativeEvent;
      if (key === 'Backspace') {
        if (value) {
          setValue('');
        } else {
          setPrevValue('');
          prevOtpInputRef.current.focus();
        }
      } else {
        setValue(key);
        if (nextInputRef) {
          nextInputRef.current.focus();
        } else {
          handleSubmit(key);
        }
      }
    }}
    onChangeText={(text) => {
    }}
    blurOnSubmit={false}
  />
);

export default OtpNumberInputField;
