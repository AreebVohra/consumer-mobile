/* eslint-disable object-curly-newline */
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import TopScreenSwitcher from 'components/topScreenSwitcher';
import Profile from './profile';
import PaymentMethods from './paymentMethods';

const AccountScreen = ({ navigation }) => {
  const Stack = createStackNavigator();
  // Do not remove: although not used it triggers re-render on Language change
  const currLang = useSelector((state) => state.language.language);

  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

  const screenOptions = [
    {
      text: t('common.accountSettings'),
      navigateToScreen: 'Profile',
    },
    {
      text: t('common.paymentDetails'),
      navigateToScreen: 'PaymentMethods',
    },
  ];

  return (
    <>
      <TopScreenSwitcher
        options={screenOptions}
        activeScreenIndex={activeScreenIndex}
        setActiveScreenIndex={setActiveScreenIndex}
        navigation={navigation}
      />
      <Stack.Navigator
        initialRouteName="Profile"
        headerMode="none"
        screenOptions={{
          headerShown: false,
          cardStyleInterpolator: ({ current }) => ({
            cardStyle: {
              opacity: current.progress,
            },
          }),
        }}
      >
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethods} />
      </Stack.Navigator>
    </>
  );
};

AccountScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
};

AccountScreen.defaultProps = {
  navigation: null,
};

export default AccountScreen;
