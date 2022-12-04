/* eslint-disable arrow-body-style */
import React, { useState, useEffect } from 'react';
import { Linking, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Spinner, Text,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import { WebView } from 'react-native-webview';
import { setScreen } from 'utils/handleLogEvent';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import styles from './styles';

const SupportScreen = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';

  const isFocused = useIsFocused();
  const [showBody, setShowBody] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setTimeout(() => setShowBody(true), 5000);
      setScreen('Support');
    }

    if (!isFocused) {
      setShowBody(false);
    }
  }, [isFocused]);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ paddingTop: 20, paddingHorizontal: 18, paddingBottom: 8 }}>
        <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
          <Text style={styles.getInTouch}>
            {t('common.getInTouch')}
          </Text>
        </View>

        <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
          <Text style={styles.callUs}>
            {t('common.callUs')}
          </Text>
        </View>

        <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
          <Text style={styles.country}>
            {`${t('common.uaeDelivery')} : `}
          </Text>
          <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel:+971 4275 3550')}>
            +971 4275 3550 (9:00AM - 12:00AM)
          </Text>
        </View>

        <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
          <Text style={styles.country}>
            {`${t('common.ksaDelivery')} : `}
          </Text>
          <Text style={styles.phoneNumber} onPress={() => Linking.openURL('tel:+966 11 520 9914')}>
            +966 11 520 9914 (9:00AM - 6:00PM)
          </Text>
        </View>

        <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
          <Text style={styles.emailUs}>
            {`${t('common.emailUs')} `}
            <Text style={[commonStyles.link, { color: '#717171', fontWeight: '400' }]} onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
              shoppersupport@spotii.me
            </Text>
          </Text>
        </View>

      </View>

      {isFocused ? (
        <>
          <WebView
            style={{ opacity: showBody ? 1 : 0, marginTop: 12 }}
            source={{ uri: 'https://static.zdassets.com/web_widget/latest/liveChat.html?v=10#key=spotii.zendesk.com&settings=JTdCJTIyd2ViV2lkZ2V0JTIyJTNBJTdCJTIyY2hhdCUyMiUzQSU3QiUyMnRpdGxlJTIyJTNBbnVsbCUyQyUyMm1lbnVPcHRpb25zJTIyJTNBJTdCJTIyZW1haWxUcmFuc2NyaXB0JTIyJTNBdHJ1ZSU3RCUyQyUyMmRlcGFydG1lbnRzJTIyJTNBJTdCJTdEJTJDJTIycHJlY2hhdEZvcm0lMjIlM0ElN0IlMjJkZXBhcnRtZW50TGFiZWwlMjIlM0FudWxsJTJDJTIyZ3JlZXRpbmclMjIlM0FudWxsJTdEJTJDJTIyb2ZmbGluZUZvcm0lMjIlM0ElN0IlMjJncmVldGluZyUyMiUzQW51bGwlN0QlMkMlMjJjb25jaWVyZ2UlMjIlM0ElN0IlMjJhdmF0YXJQYXRoJTIyJTNBbnVsbCUyQyUyMm5hbWUlMjIlM0FudWxsJTJDJTIydGl0bGUlMjIlM0FudWxsJTdEJTdEJTJDJTIyY29sb3IlMjIlM0ElN0IlMjJhcnRpY2xlTGlua3MlMjIlM0ElMjIlMjIlMkMlMjJidXR0b24lMjIlM0ElMjIlMjIlMkMlMjJoZWFkZXIlMjIlM0ElMjIlMjIlMkMlMjJsYXVuY2hlciUyMiUzQSUyMiUyMiUyQyUyMmxhdW5jaGVyVGV4dCUyMiUzQSUyMiUyMiUyQyUyMnJlc3VsdExpc3RzJTIyJTNBJTIyJTIyJTJDJTIydGhlbWUlMjIlM0FudWxsJTdEJTdEJTdE&&locale=en-US&title=Web%20Widget%20Live%20Chat' }}
            startInLoadingState
            originWhitelist={['https://static.zdassets.com*', 'http://static.zdassets.com*']}
            cacheEnabled
            onMessage={() => {}} // must have this for injected To Work On Iphone
            // renderLoading={() => (
            //   <View style={styles.center}>
            //     <Spinner />
            //   </View>
            // )}
          />
          <View style={{
            position: 'absolute', marginLeft: '47%', marginTop: '50%', opacity: !showBody ? 1 : 0,
          }}
          >
            <Spinner size="giant" />
          </View>
        </>
      ) : (
        <View style={{ alignItems: 'center', marginTop: '50%' }}>
          <Spinner size="giant" />
        </View>
      )}
    </View>
  );
};

SupportScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

SupportScreen.defaultProps = {
  navigation: null,
};

export default SupportScreen;
