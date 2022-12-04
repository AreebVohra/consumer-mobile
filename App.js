/* eslint-disable no-multiple-empty-lines */
/* eslint-disable object-curly-newline */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { I18nManager as RNI18nManager, Platform, NativeEventEmitter, NativeModules, View } from 'react-native';
import { Provider } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { PersistGate } from 'redux-persist/integration/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UqudoIdSDK } from 'react-native-uqudoid';

import * as Localization from 'expo-localization';
import * as Notifications from 'expo-notifications';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { ApplicationProvider, IconRegistry, Text, Input } from '@ui-kitten/components';

import authApi from './api/auth';
import Landing from './src/pages/landing';
import { setPersistedLoginAttempted } from './reducers/user';
import { BACK_COUNTRIES } from './utils/constants';
import handleLogEvent from './utils/handleLogEvent';
import { registerForPushNotificationsAsync } from './utils/pushNotifications';
import i18n, { t } from './services/i18n';
import { createInitPushToken, setPermission } from './reducers/pushNotification';
import { changeLanguage } from './reducers/language';
import {
  authUserLogout,
  authUserLogIn,
  authStatusChange,
  getRemoteMobileConfig,
  retrieveCurrencyConversions,
  triggerLoginEvent,
  retrieveConsumerScore,
} from './reducers/application';
import { alpha3FromISDPhoneNumber } from './utils/convertCurrency';
import LightTheme from './themes/light/theme.json';
import mapping from './themes/light/mapping.json';
import { getStore, getPersistor } from './store';
import appConfig from './app.json';

const SmartechSDK = require('smartech-reactnative-module');

RNI18nManager.allowRTL(false);
RNI18nManager.forceRTL(false);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default () => {
  const store = getStore();
  const persistor = getPersistor();

  const animation = useRef(null);
  const responseListener = useRef();
  const notificationListener = useRef();

  // Innit Uqudo NFC SDK
  useMemo(() => {
    new UqudoIdSDK().init();
    new NativeEventEmitter(NativeModules.UqudoId).addListener('TraceEvent', (event) => {
      console.log(JSON.stringify(event));
    });
  }, []);

  // Disable console warnings and Errors from covering the phone screen
  // To see them use a debugger
  // console.disableYellowBox = true;
  // console.reportErrorsAsExceptions = false;

  const [canStartPersistLogin, setCanStartPersistLogin] = useState(false);
  const [hideSplashScreen, setHideSplashScreen] = useState(false);
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);


  // useEffect(() => {
  //   Text.defaultProps = Text.defaultProps || {};
  //   Text.defaultProps.maxFontSizeMultiplier = 1.1;
  //   Input.defaultProps = Input.defaultProps || {};
  //   Input.defaultProps.maxFontSizeMultiplier = 1.1;
  //   View.defaultProps = View.defaultProps || {};
  //   View.defaultProps.maxFontSizeMultiplier = 1.1;
  // }, []);


  useEffect(() => {
    // AsyncStorage.clear();

    const setUpAnalytics = async () => {
      // This option is only available in Expo Go. Comment out when done.
      // allows events tracking using the DebugView in the Analytics dashboard
      // await Analytics.setDebugModeEnabled(true);

      // events for sanity
      await handleLogEvent('SpotiiMobileAppInitiated', {
        os_type: Platform.OS.toUpperCase(),
        os_version: Platform.Version.toString(),
        app_version: appConfig.expo.version,
        purpose: 'Sanity event that helps us make sure that events are being triggered in both Android and IOS',
      });
    };

    i18n
      .init()
      .then(async () => {
        const RNDir = RNI18nManager.isRTL ? 'RTL' : 'LTR';
        setIsI18nInitialized(true);
      })
      .catch((error) => console.error(error));
    setUpAnalytics();
  }, []);


  useEffect(() => {
    store.dispatch(getRemoteMobileConfig());
    store.dispatch(retrieveCurrencyConversions());
  }, []);


  // Set up push notifications
  useEffect(() => {
    const setUpPushNotifications = async () => {
      registerForPushNotificationsAsync().then(token => {
        if (token) {
          store.dispatch(createInitPushToken(token));
        } else {
          store.dispatch(setPermission({ permissionGranted: false }));
        }
      });
      setCanStartPersistLogin(true);
      // This listener is fired whenever a notification is received while the app is foregrounded
      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        // setNotification(notification);
      });

      // This listener is fired whenever a user taps on or interacts with a notification
      // works when app is foregrounded, backgrounded, or killed
      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        // TODO: use this later to take user to specific late order
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    };

    setUpPushNotifications();
  }, []);

  // eslint-disable-next-line arrow-body-style
  useEffect(() => {
    if (canStartPersistLogin) {
      return authApi.onAuthStatusChange(async user => {
        try {
          if (!user) {
            store.dispatch(authUserLogout());
          } else {
            await handleLogEvent('SpotiiMobileSignInInitiated', { email: user.email });
            await store.dispatch(authUserLogIn(user));
            // this condition means in all flows other than registration
            if (user.user && user.user.phone_verified) {
              await store.dispatch(triggerLoginEvent({ email: user.user.email }));
            }
            const userCountry = alpha3FromISDPhoneNumber(user.user.phone_number);
            if (userCountry === BACK_COUNTRIES[0]) {
              SmartechSDK.setUserIdentity(user.user.email);
            }
            store.dispatch(retrieveConsumerScore(user.user.user_id));
          }
          store.dispatch(authStatusChange(user));
        } catch (e) {
          if (user) {
            await handleLogEvent('SpotiiMobileSignInFailure', { email: user?.user?.email });
          }
        }
        await store.dispatch(setPersistedLoginAttempted({ persistedLoginAttempted: true }));
      });
    }
  }, [canStartPersistLogin]);


  // Use previously selected language if possible
  useEffect(() => {
    const fetchStoredLang = async () => {
      let storedLanguage = 'en';

      try {
        storedLanguage = await AsyncStorage.getItem('spotii-consumer-mobile-language');
      } catch (e) {
        // do nothing keep using 'en'
      }
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);

      let deviceLang = Localization.locale.split('-')[0];
      if (deviceLang !== 'en' && deviceLang !== 'ar') {
        deviceLang = 'en';
      }

      if (storedLanguage) {
        store.dispatch(changeLanguage({ lang: storedLanguage, shouldFetchMerchantDetailsList: false }));
      } else if (deviceLang === 'ar') {
        store.dispatch(changeLanguage({ lang: deviceLang, shouldFetchMerchantDetailsList: false }));
      }
    };
    fetchStoredLang();
  }, []);

  if (hideSplashScreen && isI18nInitialized) {
    return (
      <>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.light, ...LightTheme }} customMapping={mapping}>
              <Landing />
            </ApplicationProvider>
          </PersistGate>
        </Provider>
      </>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#AA8FFF' }}>
      <LottieView
        ref={animation}
        style={{ backgroundColor: '#AA8FFF' }}
        autoPlay
        loop={false}
        onAnimationFinish={() => setHideSplashScreen(true)}
        source={require('assets/lottie/spotii-animation.json')}
      />
    </SafeAreaView>
  );
};
