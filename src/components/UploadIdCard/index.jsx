/* eslint-disable max-len */
/* eslint-disable no-nested-ternary */
/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'components/Icon';
import snakeToCamel from 'utils/snakeToCamel';
import { useSelector, useDispatch } from 'react-redux';
import { getNfcHardwareStatus } from 'reducers/nfcId';
import { resolveHasIdentitiesAndExpired } from 'reducers/application';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import {
  View,
  Linking,
  StatusBar,
} from 'react-native';
import {
  Button,
  Text,
  Divider,
  Spinner,
} from '@ui-kitten/components';
import {
  BACK_COUNTRIES,
  NFC_ENROLLMENT_ERRORS,
} from 'utils/constants';
import UploadId from 'pages/account/modals/uploadId';
import { showMessage } from 'react-native-flash-message';
import { handleNfcScan } from 'utils/uqudo';
import { t } from 'services/i18n';
import commonStyles from 'utils/commonStyles';
import PropTypes from 'prop-types';
import styles from './styles';

const UploadIdCard = ({ navigation }) => {
  const currLang = useSelector(state => state.language.language);
  const isRTL = currLang === 'ar';
  const dispatch = useDispatch();
  const { currentUser } = useSelector(state => state.application);
  const [useNfc, setUseNfc] = useState(false);
  const [uploadEmId, setUploadEmId] = useState(false);
  const [identitiesLoader, setIdentitiesLoader] = useState(false);
  const {
    hasNfcScan,
    nfcHardwareStatusResolved,
    nfcSupported,
  } = useSelector(state => state.nfcId);
  const {
    hasIdentitiesUploaded,
    isIdExpired,
    phoneNumber,
    userId,
  } = currentUser;
  const userCountry = alpha3FromISDPhoneNumber(phoneNumber);
  const showBack = BACK_COUNTRIES.includes(userCountry);

  useEffect(() => {
    if (!nfcHardwareStatusResolved) {
      dispatch(getNfcHardwareStatus(userCountry));
    }
  }, [nfcHardwareStatusResolved]);

  useEffect(() => {
    if (userCountry === 'UAE' && nfcSupported) {
      setUseNfc(true);
    }
  }, [userCountry, nfcSupported]);

  const handleNfcEnrollment = async () => {
    setIdentitiesLoader(true);
    const resp = await handleNfcScan(userId);

    if (!resp.success) {
      let message = t('errors.somethingWrongContactSupport');
      if (resp.error && Object.values(NFC_ENROLLMENT_ERRORS).includes(resp.error)) {
        if (resp.error === NFC_ENROLLMENT_ERRORS.SESSION_INVALIDATED_READING_NOT_SUPPORTED
            || resp.error === NFC_ENROLLMENT_ERRORS.SESSION_INVALIDATED_FACE_RECOGNITION_TOO_MANY_ATTEMPTS) {
          message = (
            <Text style={styles.scannerDisclaimer}>
              {`${t(`errors.${snakeToCamel(resp.error)}NfcError`)} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          );
        } else if (resp.error === NFC_ENROLLMENT_ERRORS.USER_CANCEL && hasNfcScan) {
          message = t(`errors.${snakeToCamel(resp.error)}NfcErrorUploaded`);
        } else {
          message = t(`errors.${snakeToCamel(resp.error)}NfcError`);
        }
      }
      showMessage({
        message,
        backgroundColor: '#FFFFFF',
        color: '#FF4D4A',
        statusBarHeight: StatusBar.currentHeight,
        style: {
          borderColor: '#FF4D4A',
          width: '100%',
          alignItems: `flex-${isRTL ? 'end' : 'start'}`,
          textAlign: isRTL ? 'right' : 'left',
          borderLeftWidth: isRTL ? 0 : 2,
          borderRightWidth: isRTL ? 2 : 0,
        },
      });
      setIdentitiesLoader(false);
    } else {
      showMessage({
        message: t('success.nfcScanSuccess'),
        backgroundColor: '#FFFFFF',
        color: '#0EBD8F',
        statusBarHeight: StatusBar.currentHeight,
        style: {
          borderColor: '#0EBD8F',
          width: '100%',
          alignItems: `flex-${isRTL ? 'end' : 'start'}`,
          textAlign: isRTL ? 'right' : 'left',
          borderLeftWidth: isRTL ? 0 : 2,
          borderRightWidth: isRTL ? 2 : 0,
        },
      });
      dispatch(resolveHasIdentitiesAndExpired(true));
      setIdentitiesLoader(false);
    }
  };

  const handleIdButtonPress = () => {
    if (useNfc) {
      handleNfcEnrollment();
    } else {
      setIdentitiesLoader(true);
      setUploadEmId(true);
    }
  };

  return (
    <View style={styles.card}>
      <LinearGradient colors={['#411361', '#EDE6FF']} style={styles.linearGradient}>
        <Text category="h5" style={[styles.header, { textAlign: isRTL ? 'right' : 'left' }]}>
          {isIdExpired && hasIdentitiesUploaded ? t('common.nationalIdExpired') : t('common.uploadPersonalId')}
        </Text>
        <Divider />
        <Text category="p1" style={[styles.headerDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
          {useNfc ? t('common.scanPersonalIdDesc') : t('common.uploadPersonalIdDesc')}
        </Text>
        {useNfc ? (<></>) : (
          <Text category="p1" style={[styles.headerDesc, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('common.identityAcceptType')}
          </Text>
        )}
        <Button
          appearance="outline"
          status="control"
          style={styles.button}
          accessoryLeft={props => Icon({
            ...props, width: 25, height: 25, fill: '#FFFFFF',
          }, 'credit-card-outline')}
          accessoryRight={() => (identitiesLoader ? <Spinner status="basic" size="tiny" /> : null)}
          onPress={handleIdButtonPress}
        >
          {useNfc ? t('common.startScan') : t('common.upload')}
        </Button>
      </LinearGradient>
      <UploadId visible={uploadEmId} setVisible={setUploadEmId} setIdentitiesLoader={setIdentitiesLoader} side={showBack ? 'back' : 'front'} />
    </View>
  );
};

UploadIdCard.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

UploadIdCard.defaultProps = {
  navigation: null,
};

export default UploadIdCard;
