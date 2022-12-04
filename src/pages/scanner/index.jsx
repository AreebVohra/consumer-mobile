/* eslint-disable arrow-body-style */
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import ScannerCamera from './scannerCamera';
import PaymentForm from './paymentForm';
import DeepLinkPaymentForm from './deepLinkPaymentForm';
import OrderDeclined from './orderDeclined';
import OrderApproved from './orderApproved';
import GiftCard from '../giftcards';
import LecGiftCard from '../giftcards/lecGiftCard';
import WhereItWorks from '../giftcards/whereItWorks';

const Stack = createStackNavigator();

const ScannerNavigator = () => {
  return (
    <>
      <Stack.Navigator headerMode="none">
        <Stack.Screen name="ScannerCamera" component={ScannerCamera} />
        <Stack.Screen name="PaymentForm" component={PaymentForm} />
        <Stack.Screen name="DeepLinkPaymentForm" component={DeepLinkPaymentForm} />
        <Stack.Screen name="OrderDeclined" component={OrderDeclined} />
        <Stack.Screen name="OrderApproved" component={OrderApproved} />
        <Stack.Screen name="GiftCard" component={GiftCard} />
        <Stack.Screen name="WhereItWorks" component={WhereItWorks} />
        <Stack.Screen name="LecGiftCard" component={LecGiftCard} />
      </Stack.Navigator>
    </>
  );
};

export default ScannerNavigator;
