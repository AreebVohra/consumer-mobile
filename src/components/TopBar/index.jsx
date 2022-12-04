/* eslint-disable object-curly-newline */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { Text } from '@ui-kitten/components';
import PropTypes from 'prop-types';
import SpotiiZipPayWhiteLogo from 'assets/spotiiZipPayWhiteLogo';
import QrCodeIcon from 'assets/qrCodeIcon';
import QuestionMarkIcon from 'assets/questionMarkIcon';
import NoNotificationsIcon from 'assets/noNotificationsIcon';
import NewNotificationsIcon from 'assets/newNotificationsIcon';
import { t } from 'services/i18n';
import styles from './styles';

const TopBar = ({ spendLimit, currency, navigation, showNotificationBottomSheetHandler }) => {
  const currLang = useSelector(state => state.language.language);
  const { hasIdentitiesUploaded, isIdExpired, phoneNumber, userId } = useSelector((state) => state.application.currentUser);
  const isRTL = currLang === 'ar';

  return (
    <View style={styles.TopNavigationStyle}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
        <SpotiiZipPayWhiteLogo />

        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            onPress={() => navigation.reset({
              index: 0,
              routes: [{ name: 'Scanner' }],
            })}
            style={styles.navigationButton}
          >
            <QrCodeIcon />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => showNotificationBottomSheetHandler()} style={styles.navigationButton}>
            {(hasIdentitiesUploaded && !isIdExpired) ? <NoNotificationsIcon /> : <NewNotificationsIcon />}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Support')} style={styles.navigationButton}>
            <QuestionMarkIcon />
          </TouchableOpacity>
        </View>
      </View>

      {spendLimit !== '' && spendLimit > 0 && (
        <Text style={{ textAlign: isRTL ? 'right' : 'left', color: '#FFF', fontWeight: '400', fontSize: 16, lineHeight: 20, paddingTop: 20 }}>
          {t('common.welcomeSpendUpto')}
          <Text style={{ color: '#FFF', fontWeight: '700' }}>{` ${currency} ${spendLimit}`}</Text>
        </Text>
      )}
    </View>
  );
};

TopBar.propTypes = {
  navigation: PropTypes.shape({
    reset: PropTypes.func,
    navigate: PropTypes.func,
  }),
  spendLimit: PropTypes.string,
  currency: PropTypes.string,
  showNotificationBottomSheetHandler: PropTypes.func,
};

TopBar.defaultProps = {
  navigation: null,
  spendLimit: '',
  currency: '',
  showNotificationBottomSheetHandler: () => {},
};

export default TopBar;
