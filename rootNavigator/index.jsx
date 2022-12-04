/* eslint-disable object-curly-newline */
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Platform, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomNavigation, BottomNavigationTab, Text } from '@ui-kitten/components';
import { BottomSheetModalProvider, BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import LinkSDK from 'lean-react-native';
import { retrieveConsumerScore, setFirebaseDynamicLink, showLeanModal, retrieveInitConsumerSpendLimit } from 'reducers/application';
import { fetchPaymentMethods } from 'reducers/paymentMethods';
import { fetchNextPayments } from 'reducers/nextPayments';
import { retrieveConsumerCashbacks } from 'reducers/user';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';

import Shop from 'pages/shop';
import Orders from 'pages/orders';
import Account from 'pages/account';
import Scanner from 'pages/scanner';
import Support from 'pages/support';
import Icon from 'components/Icon';
import TopBar from 'components/TopBar';
import NotificationBottomSheetContent from 'components/BottomSheet/notificationBottomSheetContent';
import * as Linking from 'expo-linking';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { STACK_STEPS, GIFT_CARDS } from 'utils/constants';
import LoginAndRegistrationScreen from '../src/pages/loginAndRegistration';
import config from '../utils/config';
import Cashback from '../src/pages/cashback';
import styles from './styles';

const Smartech = require('smartech-reactnative-module');

const Tab = createBottomTabNavigator();

const prefix = Linking.createURL('https');

const deepLinkingConfig = {
  screens: {
    Scanner: {
      screens: {
        DeepLinkPaymentForm: {
          path: 'checkout',
        },
        GiftCard: {
          path: 'maf',
        },
        LecGiftCard: {
          path: 'lec',
        },
      },
    },
    Account: {
      path: 'account',
    },
    Rewards: {
      path: 'rewards',
    },
    Orders: {
      path: 'orders',
    },
    Shop: '*', // this is also spotii.page.link/app in firebase
  },
};

const RootNavigator = ({ netcoreDeeplink }) => {
  const linking = {
    prefixes: [prefix, 'consumer-mobile://', config('public_checkout_base_url')],

    // Custom function to get the URL which was used to open the app
    async getInitialURL() {
      // Check if app was opened from a firebase dynamic link
      let link = '';

      // eslint-disable-next-line max-len
      // for ios version 15, dynamicLinks().getInitialLink() is returning the short links instead of the long link, so we need to resolve the short link manually
      if (Platform.OS === 'ios') {
        const shortDynamicLink = await Linking.getInitialURL();
        link = await dynamicLinks().resolveLink(shortDynamicLink);
      } else {
        link = await dynamicLinks().getInitialLink();
      }

      if (link && link.url) {
        dispatch(setFirebaseDynamicLink(link.url));
        return link.url;
      }

      if (netcoreDeeplink) {
        return netcoreDeeplink;
      }

      // if the app is opened using a normal deep link
      const url = await Linking.getInitialURL();
      if (url) {
        return url;
      }

      return 'consumer-mobile://';
    },

    // Custom function to subscribe to incoming links
    subscribe(listener) {
      // First, you may want to do the default deep link handling
      const onReceiveURL = ({ url }) => listener(url);

      // Listen to incoming links from deep linking
      Linking.addEventListener('url', onReceiveURL);

      // Then, handle firebase dynamic links
      const handleDynamicLink = (dynamicLink) => {
        dispatch(setFirebaseDynamicLink(dynamicLink.url));
        listener(dynamicLink.url);
      };

      const unsubscribeToDynamicLinks = dynamicLinks().onLink(handleDynamicLink);

      return () => {
        unsubscribeToDynamicLinks();
        Linking.removeEventListener('url', onReceiveURL);
      };
    },

    config: deepLinkingConfig,
  };

  const { currentUserScore, showLean, currentUser } = useSelector((state) => state.application);
  const { mobileLimit, lean, currency } = currentUserScore;
  const { hasIdentitiesUploaded } = currentUser;

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(retrieveInitConsumerSpendLimit());
    dispatch(retrieveInitConsumerSpendLimit(GIFT_CARDS.LEC));
    dispatch(fetchNextPayments());
    dispatch(fetchPaymentMethods());
    dispatch(retrieveConsumerCashbacks());
  }, []);

  useEffect(() => {
    if (showLean && lean?.customer_id) {
      LeanRef.current.link({
        customer_id: lean.customer_id,
        permissions: ['identity', 'accounts', 'transactions', 'balance'],
      });
    }
  }, [showLean, lean?.customer_id]);

  const leanAppToken = config('lean_app_token');
  const currEnv = config('current_env');

  const LeanRef = useRef(null);

  const leanCallback = (payload) => {
    const { status, message, method } = payload;
    if (method === 'LINK' && status === 'SUCCESS') {
      dispatch(retrieveConsumerScore());
    }
    dispatch(showLeanModal(false));
  };

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '50%'], []);

  const showNotificationBottomSheetHandler = useCallback(() => {
    bottomSheetRef?.current?.present();
  }, [bottomSheetRef]);

  const tabBar = ({ state, navigation }) => (
    <BottomNavigation
      style={styles.bottomNavigation}
      selectedIndex={state.index}
      indicatorStyle={{ width: '70%' }}
      onSelect={(index) => {
        // navigation.navigate(state.routeNames[index]);
        navigation.reset({
          index: 0,
          routes: [{ name: state.routeNames[index] }],
        });
      }}
    >
      <BottomNavigationTab
        style={{ marginHorizontal: 10 }}
        title={(evaProps) => (
          <Text {...evaProps} style={{ fontSize: 14, color: state.index === 0 ? '#411361' : '#AA8FFF' }}>
            {t('common.shop')}
          </Text>
        )}
        // icon={() => <ShopNavIcon size={state.index === 0 ? '32' : '28'} color={state.index === 0 ? '#411361' : '#AA8FFF'} />}
        icon={(props) => (
          <View style={{ paddingTop: 5 }}>
            {Icon(
              {
                ...props,
                fill: state.index === 0 ? '#411361' : '#AA8FFF',
                width: state.index === 0 ? 26 : 24,
                height: state.index === 0 ? 26 : 24,
              },
              'shopping-cart-outline',
            )}
          </View>
        )}
      />
      <BottomNavigationTab
        style={{ marginHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}
        title={(evaProps) => (
          <Text {...evaProps} style={{ fontSize: 14, color: state.index === 1 ? '#411361' : '#AA8FFF' }}>
            {t('common.rewards')}
          </Text>
        )}
        // icon={() => <RewardsNavIcon size={tabIndex === 1 ? '27' : '24'} color={tabIndex === 1 ? '#411361' : '#AA8FFF'} />}
        icon={(props) => (
          <View style={{ paddingTop: 5 }}>
            {Icon(
              {
                ...props,
                fill: state.index === 1 ? '#411361' : '#AA8FFF',
                width: state.index === 1 ? 26 : 24,
                height: state.index === 1 ? 26 : 24,
              },
              'gift-outline',
            )}
          </View>
        )}
      />
      <BottomNavigationTab
        style={{ marginHorizontal: 10 }}
        title={(evaProps) => (
          <Text {...evaProps} style={{ fontSize: 14, color: state.index === 2 ? '#411361' : '#AA8FFF' }}>
            {t('common.orders')}
          </Text>
        )}
        // icon={() => <OrderNavIcon size={state.index === 2 ? '30' : '26'} color={state.index === 2 ? '#411361' : '#AA8FFF'} />}
        icon={(props) => (
          <View style={{ paddingTop: 5 }}>
            {Icon(
              {
                ...props,
                fill: state.index === 2 ? '#411361' : '#AA8FFF',
                width: state.index === 2 ? 26 : 24,
                height: state.index === 2 ? 26 : 24,
              },
              'shopping-bag-outline',
            )}
          </View>
        )}
      />
      <BottomNavigationTab
        style={{ marginHorizontal: 10 }}
        title={(evaProps) => (
          <Text {...evaProps} style={{ fontSize: 14, color: state.index === 3 ? '#411361' : '#AA8FFF' }}>
            {t('common.account')}
          </Text>
        )}
        // icon={() => <AccountNavIcon size={tabIndex === 3 ? '32' : '26'} color={tabIndex === 3 ? '#411361' : '#AA8FFF'} />}
        icon={(props) => (
          <View style={{ paddingTop: 5 }}>
            {Icon(
              {
                ...props,
                fill: state.index === 3 ? '#411361' : '#AA8FFF',
                width: state.index === 3 ? 26 : 24,
                height: state.index === 3 ? 26 : 24,
              },
              'person-outline',
            )}
          </View>
        )}
      />
    </BottomNavigation>
  );

  if (!hasIdentitiesUploaded) {
    return <LoginAndRegistrationScreen stackStep={STACK_STEPS.ID_UPLOAD} />;
  }

  return (
    <>
      <BottomSheetModalProvider>
        <NavigationContainer linking={linking}>
          <Tab.Navigator
            screenOptions={() => ({
              tabBarItemStyle: { marginHorizontal: 14 },
            })}
            tabBar={tabBar}
          >
            <Tab.Screen
              name="Shop"
              component={Shop}
              options={({ navigation }) => ({
                headerTitle: (props) => <TopBar {...props} spendLimit={mobileLimit || ''} currency={currency} navigation={navigation} showNotificationBottomSheetHandler={showNotificationBottomSheetHandler} />,
                headerStyle: {
                  backgroundColor: '#AA8FFF',
                  borderBottomStartRadius: 12,
                  borderBottomEndRadius: 12,
                  height: mobileLimit && mobileLimit > 0 ? 185 : 125,
                },
              })}
            />
            <Tab.Screen
              name="Rewards"
              component={Cashback}
              options={({ navigation }) => ({
                headerTitle: (props) => <TopBar {...props} navigation={navigation} showNotificationBottomSheetHandler={showNotificationBottomSheetHandler} />,
                headerStyle: {
                  backgroundColor: '#AA8FFF',
                  borderBottomStartRadius: 12,
                  borderBottomEndRadius: 12,
                  height: 125,
                },
              })}
            />
            <Tab.Screen
              name="Orders"
              component={Orders}
              options={({ navigation }) => ({
                headerTitle: (props) => <TopBar {...props} navigation={navigation} showNotificationBottomSheetHandler={showNotificationBottomSheetHandler} />,
                headerStyle: {
                  backgroundColor: '#AA8FFF',
                  borderBottomStartRadius: 12,
                  borderBottomEndRadius: 12,
                  height: 125,
                },
              })}
            />
            <Tab.Screen
              name="Account"
              component={Account}
              options={({ navigation }) => ({
                headerTitle: (props) => <TopBar {...props} navigation={navigation} showNotificationBottomSheetHandler={showNotificationBottomSheetHandler} />,
                headerStyle: {
                  backgroundColor: '#AA8FFF',
                  borderBottomStartRadius: 12,
                  borderBottomEndRadius: 12,
                  height: 125,
                },
              })}
            />
            <Tab.Screen
              name="Scanner"
              component={Scanner}
              options={({ navigation }) => ({
                headerTitle: (props) => <TopBar {...props} navigation={navigation} showNotificationBottomSheetHandler={showNotificationBottomSheetHandler} />,
                headerStyle: {
                  backgroundColor: '#AA8FFF',
                  borderBottomStartRadius: 12,
                  borderBottomEndRadius: 12,
                  height: 125,
                },
              })}
            />
            <Tab.Screen
              name="Support"
              component={Support}
              options={({ navigation }) => ({
                headerTitle: (props) => <TopBar {...props} navigation={navigation} showNotificationBottomSheetHandler={showNotificationBottomSheetHandler} />,
                headerStyle: {
                  backgroundColor: '#AA8FFF',
                  borderBottomStartRadius: 12,
                  borderBottomEndRadius: 12,
                  height: 125,
                },
              })}
            />
          </Tab.Navigator>
        </NavigationContainer>

        <LinkSDK
          webViewProps={{
            androidHardwareAccelerationDisabled: true,
          }}
          ref={LeanRef}
          appToken={leanAppToken}
          sandbox={currEnv !== 'PROD'}
          callback={leanCallback}
        />
        <BottomSheetModal
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose
          backdropComponent={(backdropProps) => (
            <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
          )}
        >
          <NotificationBottomSheetContent bottomSheetRef={bottomSheetRef} />
        </BottomSheetModal>

      </BottomSheetModalProvider>
    </>
  );
};

RootNavigator.propTypes = {
  netcoreDeeplink: PropTypes.string,
};

RootNavigator.defaultProps = {
  netcoreDeeplink: null,
};

export default RootNavigator;
