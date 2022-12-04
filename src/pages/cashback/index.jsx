/* eslint-disable arrow-body-style */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Cashback from './cashback';
import HowItWorks from './howItWorks';
import BankWithdrawalForm from './bankWithdrawal';

const Stack = createStackNavigator();

const CashbackNavigator = () => {
  return (
    <>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="Cashbacks" component={Cashback} />
        <Stack.Screen name="HowItWorks" component={HowItWorks} />
        <Stack.Screen name="BankWithdrawalForm" component={BankWithdrawalForm} />
      </Stack.Navigator>
    </>
  );
};

export default CashbackNavigator;
