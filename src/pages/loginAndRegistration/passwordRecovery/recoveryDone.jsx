/* eslint-disable no-shadow */
import React, { useRef, useEffect } from 'react';
import { View } from 'react-native';
import {
  Button,
  Layout,
  Text,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import LottieView from 'lottie-react-native';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import PropTypes from 'prop-types';
import styles from './styles';

const Welcome = ({ navigation }) => {
  const animation = useRef(null);

  useEffect(() => {
    animation.current.play();
  }, []);

  return (
    <Layout
      style={styles.layout}
      level="1"
    >
      <KeyboardAvoidingView>
        <View style={[styles.form, { height: '100%' }]}>
          <View style={styles.header}>
            <Text style={[styles.text, { textAlign: 'center' }]}>{t('common.passwordUpdated')}</Text>
          </View>
          <View style={styles.lottieViewContainer}>
            <LottieView
              ref={animation}
              source={require('assets/lottie/order-approved.json')}
              style={styles.lottieView}
              loop={false}
            />
          </View>
          <Text style={styles.subHeader}>{t('common.newPasswordSet')}</Text>
          <Text style={styles.subSubheader}>{t('common.signInUsingNewPassword')}</Text>
          <Button
            style={[styles.signInButton, { marginTop: 100 }]}
            onPress={() => navigation.navigate('LoginForm')}
            size="large"
          >
            {evaProps => <Text {...evaProps} category="p1" style={{ fontSize: 16, color: 'white', fontWeight: '700' }}>{t('common.login')}</Text>}
          </Button>
        </View>
      </KeyboardAvoidingView>

    </Layout>
  );
};

Welcome.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

Welcome.defaultProps = {
  navigation: null,
};

export default Welcome;
