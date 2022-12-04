import React, { useEffect, useRef } from 'react';
import { BackHandler, View } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Layout, Text } from '@ui-kitten/components';
import { t } from 'services/i18n';
import handleLogEvent from 'utils/handleLogEvent';
import { triggerLoginEvent, refreshUserProfile } from 'reducers/application';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import styles from './styles';

const Welcome = ({ route, navigation }) => {
  const { password } = route.params;

  const dispatch = useDispatch();
  const animation = useRef(null);
  const { email, token } = useSelector(state => state.registration);

  useEffect(() => {
    dispatch(refreshUserProfile());
    animation.current.play();
  }, []);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    return () => backHandler.remove();
  }, []);

  return (
    <Layout
      style={styles.form}
      level="1"
    >
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{t('common.accountCreated')}</Text>
      </View>

      <View style={styles.lottieViewContainer}>
        <LottieView
          ref={animation}
          source={require('assets/lottie/order-approved.json')}
          style={styles.lottieView}
          loop={false}
        />
      </View>

      <View style={styles.headerContainer}>
        <Text style={styles.welcomeHeader}>{t('common.welcomeToSpotii')}</Text>
        <Text style={styles.welcomeSub}>{t('common.welcomeSub')}</Text>
      </View>

      <Button
        style={[styles.signInButton, { marginTop: 70 }]}
        size="large"
        onPress={async () => {
          await handleLogEvent('SpotiiMobileSignUpCompleted', {
            email,
          });
          dispatch(triggerLoginEvent({ email }));
        }}
      >
        {t('common.getStarted')}
      </Button>
    </Layout>
  );
};

Welcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
  route: PropTypes.shape({
    params: PropTypes.shape({
      password: PropTypes.string,
    }),
  }),
};

Welcome.defaultProps = {
  navigation: null,
  route: null,
};

export default Welcome;
