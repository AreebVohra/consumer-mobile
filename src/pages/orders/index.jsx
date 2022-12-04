import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack';
import TopScreenSwitcher from 'components/topScreenSwitcher';
import {
  changeTab,
} from 'reducers/instalments';
import {
  INSTALLMENTS_STATUS_ACTIVE,
  INSTALLMENTS_STATUS_COMPLETE,
  INSTALLMENTS_STATUS_REFUNDED,
} from 'utils/constants';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import Orders from './orders';
import OrderDetails from './orderDetails';

const OrdersNav = ({ navigation }) => {
  const dispatch = useDispatch();
  // Do not remove: although not used it triggers re-render on Language change
  const currLang = useSelector(state => state.language.language);
  const {
    currentPage,
    isResolved,
    currentTab,
  } = useSelector(state => state.instalments);

  const Stack = createStackNavigator();

  const screenOptions = [
    {
      text: t('common.active'),
      navigateToScreen: 'Orders',
      title: 'Active',
    },
    {
      text: t('common.completed'),
      navigateToScreen: 'Orders',
      title: 'Completed',
    },
    {
      text: t('common.allOrders'),
      navigateToScreen: 'Orders',
      title: 'All Orders',
    },
  ];

  const [activeScreenIndex, setActiveScreenIndex] = useState(screenOptions.findIndex(option => option.title === currentTab));

  const handleOnSelect = (index) => {
    if (currentPage === null && !isResolved) {
      return;
    }

    setActiveScreenIndex(index);
    const pageTitle = screenOptions[index].title;

    if (pageTitle === 'Active') {
      dispatch(changeTab({ fetchParamsStatus: INSTALLMENTS_STATUS_ACTIVE, currentPage: null, currentTab: 'Active' }));
    } else if (pageTitle === 'All Orders') {
      dispatch(changeTab({ fetchParamsStatus: [INSTALLMENTS_STATUS_ACTIVE, INSTALLMENTS_STATUS_COMPLETE, INSTALLMENTS_STATUS_REFUNDED], currentPage: null, currentTab: 'All Orders' }));
    } else if (pageTitle === 'Completed') {
      dispatch(changeTab({ fetchParamsStatus: INSTALLMENTS_STATUS_COMPLETE, currentPage: null, currentTab: 'Completed' }));
    }
    navigation.navigate(pageTitle);
  };

  return (
    <>
      <TopScreenSwitcher
        options={screenOptions}
        activeScreenIndex={activeScreenIndex}
        setActiveScreenIndex={(tabIdx) => handleOnSelect(tabIdx)}
        navigation={navigation}
      />
      <Stack.Navigator
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
        <Stack.Screen
          name="Active"
          component={Orders}
        />
        <Stack.Screen
          name="All Orders"
          component={Orders}
        />
        <Stack.Screen
          name="Completed"
          component={Orders}
        />
        <Stack.Screen
          name="Order Details"
          component={OrderDetails}
        />
      </Stack.Navigator>
    </>
  );
};

OrdersNav.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

OrdersNav.defaultProps = {
  navigation: null,
};

export default OrdersNav;
