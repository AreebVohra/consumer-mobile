/* eslint-disable object-curly-newline */
/* eslint-disable no-nested-ternary */
/* eslint-disable no-multiple-empty-lines */
import React, { useEffect, useState } from 'react';
import { BackHandler, View, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { Button, Text, Linking, Spinner } from '@ui-kitten/components';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'components/Icon';
import { isEmiratesFromPhone } from 'utils/countries';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import snakeToCamel from 'utils/snakeToCamel';
import commonStyles from 'utils/commonStyles';
import { handleNfcScan } from 'utils/uqudo';
import {
  FRONT_AND_BACK_COUNTRIES,
  BACK_COUNTRIES,
  NFC_ENROLLMENT_ERRORS,
} from 'utils/constants';
import { resolveHasIdentitiesAndExpired } from 'reducers/application';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import UploadId from 'pages/account/modals/uploadId';
import styles from './styles';

const NotificationBottomSheetContent = ({
  bottomSheetRef,
}) => {
  const dispatch = useDispatch();

  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const { nfcSupported } = useSelector((state) => state.nfcId);
  const { hasIdentitiesUploaded, isIdExpired, phoneNumber, userId } = useSelector((state) => state.application.currentUser);
  const isEmiratesUser = isEmiratesFromPhone(phoneNumber);
  const userCountry = alpha3FromISDPhoneNumber(phoneNumber);

  const [idSide, setIdSide] = useState(null);
  const [identitiesLoader, setIdentitiesLoader] = useState(false);
  const [uploadEmId, setUploadEmId] = useState(false);
  const [nfcEnrollmentLoading, setNfcEnrollmentLoading] = useState(false);

  const showBack = BACK_COUNTRIES.includes(userCountry) || FRONT_AND_BACK_COUNTRIES.includes(userCountry);


  useEffect(() => {
    const backAction = () => {
      bottomSheetRef.current.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);


  const handleUploadPress = (side) => {
    setIdentitiesLoader(true);
    setUploadEmId(true);
    setIdSide(side);
  };


  const handleNfcEnrollment = async () => {
    setNfcEnrollmentLoading(true);
    const resp = await handleNfcScan(userId);

    if (!resp.success) {
      let message = t('errors.somethingWrongContactSupport');
      if (resp.error && Object.values(NFC_ENROLLMENT_ERRORS).includes(resp.error)) {
        if (
          resp.error === NFC_ENROLLMENT_ERRORS.SESSION_INVALIDATED_READING_NOT_SUPPORTED
          || resp.error === NFC_ENROLLMENT_ERRORS.SESSION_INVALIDATED_FACE_RECOGNITION_TOO_MANY_ATTEMPTS
        ) {
          message = (
            <Text style={styles.scannerDisclaimer}>
              {`${t(`errors.${snakeToCamel(resp.error)}NfcError`)} `}
              <Text style={[commonStyles.link, { fontSize: 18 }]} category="p1" onPress={() => Linking.openURL('mailto:shoppersupport@spotii.me')}>
                shoppersupport@spotii.me
              </Text>
              .
            </Text>
          );
        } else if (resp.error === NFC_ENROLLMENT_ERRORS.USER_CANCEL) {
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
      setNfcEnrollmentLoading(false);
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
      setNfcEnrollmentLoading(false);
    }
  };


  const handleClear = () => {
    bottomSheetRef.current.close();
  };

  return (
    <>
      <ScrollView overScrollMode="never" contentContainerStyle={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
        {(hasIdentitiesUploaded && !isIdExpired) ? (
          <Text style={styles.noNewNotifications}>
            {t('common.noNewNotifications')}
          </Text>
        ) : (
          <View style={{ flex: 1, marginHorizontal: 18 }}>
            <Text style={[styles.newNotifications, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('common.notificationsCount', { notificationsNumber: 1 })}
            </Text>

            <View
              style={[{
                height: 60,
                display: 'flex',
                flexDirection: `row${isRTL ? '-reverse' : ''}`,
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomColor: '#CCC',
                borderBottomWidth: 1,
              },
              isRTL ? {
                borderRightColor: '#FF4D4A',
                borderRightWidth: 4,
                borderTopRightRadius: 8,
                borderBottomRightRadius: 8,
              } : {
                borderLeftColor: '#FF4D4A',
                borderLeftWidth: 4,
                borderTopLeftRadius: 8,
                borderBottomLeftRadius: 8,
              }]}
            >
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  paddingLeft: isRTL ? 0 : 24,
                  paddingRight: isRTL ? 24 : 0,
                }}
              >
                <Text style={[styles.expiredId, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {isIdExpired
                    ? isEmiratesUser
                      ? t('common.expiredEmiratesID') : t('common.nationalIdExpired')
                    // id not expired, then it is not uploaded at all
                    : isEmiratesUser ? t('common.uploadEmiratesId') : t('common.uploadYourNationalId')}
                </Text>
                <Text style={[styles.pleaseUpdateId, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t('common.pleaseUpdateId')}
                </Text>
              </View>

              <Button
                onPress={() => (
                  nfcSupported && isEmiratesUser
                    ? handleNfcEnrollment()
                    : handleUploadPress(showBack ? 'back' : 'front')
                )}
                size="large"
                status="control"
                style={{
                  borderBottomWidth: 1,
                  borderRadius: 0,
                  paddingBottom: 1,
                  marginBottom: 22,
                }}
              >
                {(evaProps) => (
                  <Text
                    {...evaProps}
                    style={{
                      textDecorationLine: 'underline',
                      color: '#1A0826',
                      fontWeight: '600',
                      fontSize: 14,
                      lineHeight: 18,
                    }}
                  >
                    {t('common.uploadNow')}
                    {(nfcEnrollmentLoading || identitiesLoader) && (
                      <View
                        style={{
                          paddingLeft: isRTL ? 0 : 10,
                          paddingRight: isRTL ? 10 : 0,
                        }}
                      >
                        <Spinner size="tiny" />
                      </View>
                    )}
                  </Text>
                )}
              </Button>
            </View>

            <View style={{ flex: 1, justifyContent: 'flex-end' }}>
              <Button
                style={styles.clearButton}
                onPress={handleClear}
                size="large"
              >
                {(evaProps) => (
                  <Text {...evaProps} category="p1">
                    {t('common.clearAll')}
                  </Text>
                )}
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
      <UploadId visible={uploadEmId} setVisible={setUploadEmId} setIdentitiesLoader={setIdentitiesLoader} side={idSide} />
    </>
  );
};

NotificationBottomSheetContent.propTypes = {
  bottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      expand: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
};

NotificationBottomSheetContent.defaultProps = {
  bottomSheetRef: null,
};

export default NotificationBottomSheetContent;
