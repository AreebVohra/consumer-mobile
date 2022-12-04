/* eslint-disable react/prop-types */
/* eslint-disable arrow-body-style */
import axios from 'axios';
import React, { useEffect } from 'react';
import { View, Platform, BackHandler, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { setRegistrationFields } from 'reducers/registration';
import {
  Text,
  Card,
  Modal,
  Button,
} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import { getCameraRollPermission, getCameraPermission } from 'utils/permissions';
import { refreshUserProfileAfterUpload, switchRedirectToPasswordRecovery, retrieveConsumerScore } from 'reducers/application';
import * as DocumentPicker from 'expo-document-picker';
import { showMessage } from 'react-native-flash-message';
import { resetUserDataDataAndTriggerEvent } from 'reducers/user';
import { t } from 'services/i18n';
import authApi, { IDENTITY_UPLOAD_URL } from 'api/auth';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import {
  EXPIRED_EID,
  WRONG_SIDE,
  DATA_MISMATCH,
  DUPLICATE_ID,
  BAD_IMG,
} from 'utils/constants';
import snakeToCamel from 'utils/snakeToCamel';
import styles from './styles';

const UploadId = ({
  visible,
  setVisible,
  setIdentitiesLoader,
  side,
  hasFormCheck = false,
  customNavigation = null,
  password = null,
}) => {
  const dispatch = useDispatch();
  const appState = useSelector(state => state.application);
  const currLang = useSelector(state => state.language.language);
  const {
    currentUser: { phoneNumber },
  } = appState;

  const userCountry = alpha3FromISDPhoneNumber(phoneNumber);

  const uploadEmId = async (res, source = 'default') => {
    const localUri = res.uri;
    const cleanURL = localUri.replace('file://', '');
    const imageName = localUri.split('/').pop();
    // // Infer the type of the image
    const match = /\.(\w+)$/.exec(imageName);
    const imageType = match ? `image/${match[1]}` : 'image';

    // useEffect(() => {
    //   const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    //   return () => backHandler.remove();
    // }, []);

    const formData = new FormData();
    const file = {
      uri: Platform.OS === 'ios' ? cleanURL : localUri,
      type: source === 'document-picker' ? `application/${imageType}` : imageType,
      filename: imageName,
      name: imageName,
    };

    formData.append('file', file);
    formData.append('type', side);
    formData.append('country', userCountry);

    try {
      setIdentitiesLoader(true);
      const token = await authApi.getToken();

      const resp = await axios.post(hasFormCheck ? `${IDENTITY_UPLOAD_URL}?checkout=${true}` : IDENTITY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!hasFormCheck) {
        dispatch(refreshUserProfileAfterUpload());
      } else {
        const idData = resp.data;
        dispatch(
          setRegistrationFields({
            // phoneNumber: idDetails.data.cardNumber,
            dateOfBirth: idData.dob,
            cardNumber: idData.card_number,
            idNumber: idData.id_number,
            cardExpiryDate: idData.expiry_date,
            nationality: idData.nationality,
            sex: idData.sex,
            fullName: idData.name,
            editableFields: idData.meta_data.editable || '',
            showFields: idData.meta_data.show || '',
          }),
        );
      }

      setIdentitiesLoader(false);
      if (!hasFormCheck) {
        showMessage({
          message: t('success.identitySuccess'),
          backgroundColor: '#FFFFFF',
          color: '#0EBD8F',
          statusBarHeight: StatusBar.currentHeight,
          style: {
            borderColor: '#0EBD8F',
            alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
            textAlign: currLang === 'ar' ? 'right' : 'left',
            borderLeftWidth: currLang === 'ar' ? 0 : 2,
            borderRightWidth: currLang === 'ar' ? 2 : 0,
          },
        });
      } else {
        customNavigation.navigate('Welcome', { password });
      }
    } catch (err) {
      setIdentitiesLoader(false);

      let message = t('errors.somethingWrongContactSupport');

      let redirect = false;
      if (err.response.data && err.response.data.code) {
        const { code } = err.response.data;
        switch (snakeToCamel(code)) {
          case DATA_MISMATCH:
            message = t('errors.mismatchIdMsg');
            break;
          case EXPIRED_EID:
            message = t('errors.expiredIdMsg');
            break;
          case WRONG_SIDE:
            message = t('errors.wrongSideIdMsg');
            break;
          case DUPLICATE_ID:
            message = (
              <>
                {`${t('errors.duplicateIdMsgBeforeLink')} `}
                <Text style={{ color: '#AA8FFF', textDecorationLine: 'underline', fontWeight: 'bold' }} category="p1">
                  {t('errors.linkToPasswordRecovery')}
                </Text>
                {` ${t('errors.duplicateIdMsgAfterLink')}`}
              </>
            );
            redirect = true;
            break;
          case BAD_IMG:
            message = t('errors.badImgMsg');
            break;
          default:
            message = t('errors.somethingWrongContactSupport');
        }
      }

      dispatch(retrieveConsumerScore());

      showMessage({
        onPress: () => {
          if (redirect) {
            authApi.revoke().then(() => {
              dispatch(resetUserDataDataAndTriggerEvent());
              dispatch(switchRedirectToPasswordRecovery({ switchTo: true }));
            });
          }
        },
        message,
        duration: () => {
          if (redirect) {
            return 20000;
          }
          return 4000;
        },
        backgroundColor: '#FFFFFF',
        color: '#FF4D4A',
        statusBarHeight: StatusBar.currentHeight,
        style: {
          borderColor: '#FF4D4A',
          alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
          textAlign: currLang === 'ar' ? 'right' : 'left',
          borderLeftWidth: currLang === 'ar' ? 0 : 2,
          borderRightWidth: currLang === 'ar' ? 2 : 0,
        },
      });
    }
  };

  const handleIdUploadGallery = async () => {
    setVisible(false);
    try {
      const permission = await getCameraRollPermission();
      if (permission === 'granted') {
        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Image,
          allowsEditing: true,
        });
        if (!res.cancelled) {
          uploadEmId(res);
        } else {
          setIdentitiesLoader(false);
        }
      } else {
        setIdentitiesLoader(false);
        showMessage({
          message: t('errors.somethingWrongContactSupport'),
          backgroundColor: '#FFFFFF',
          color: '#FF4D4A',
          statusBarHeight: StatusBar.currentHeight,
          style: {
            borderColor: '#FF4D4A',
            alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
            textAlign: currLang === 'ar' ? 'right' : 'left',
            borderLeftWidth: currLang === 'ar' ? 0 : 2,
            borderRightWidth: currLang === 'ar' ? 2 : 0,
          },
        });
      }
    } catch (e) {
      setIdentitiesLoader(false);
      showMessage({
        message: t('errors.somethingWrongContactSupport'),
        backgroundColor: '#FFFFFF',
        color: '#FF4D4A',
        statusBarHeight: StatusBar.currentHeight,
        style: {
          borderColor: '#FF4D4A',
          alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
          textAlign: currLang === 'ar' ? 'right' : 'left',
          borderLeftWidth: currLang === 'ar' ? 0 : 2,
          borderRightWidth: currLang === 'ar' ? 2 : 0,
        },
      });
    }
  };

  const handleIdUploadCamera = async () => {
    setVisible(false);
    try {
      const permission = await getCameraPermission();
      if (permission === 'granted') {
        const res = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Image,
          allowsEditing: true,
        });
        if (!res.cancelled) {
          uploadEmId(res);
        } else {
          setIdentitiesLoader(false);
        }
      } else {
        setIdentitiesLoader(false);
        showMessage({
          message: t('errors.identityPermissionError'),
          backgroundColor: '#FFFFFF',
          color: '#FF4D4A',
          statusBarHeight: StatusBar.currentHeight,
          style: {
            borderColor: '#FF4D4A',
            alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
            textAlign: currLang === 'ar' ? 'right' : 'left',
            borderLeftWidth: currLang === 'ar' ? 0 : 2,
            borderRightWidth: currLang === 'ar' ? 2 : 0,
          },
        });
      }
    } catch (e) {
      setIdentitiesLoader(false);
      showMessage({
        message: t('errors.somethingWrongContactSupport'),
        backgroundColor: '#FFFFFF',
        color: '#FF4D4A',
        statusBarHeight: StatusBar.currentHeight,
        style: {
          borderColor: '#FF4D4A',
          alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
          textAlign: currLang === 'ar' ? 'right' : 'left',
          borderLeftWidth: currLang === 'ar' ? 0 : 2,
          borderRightWidth: currLang === 'ar' ? 2 : 0,
        },
      });
    }
  };

  const handleIdUploadBrowseFiles = async () => {
    setVisible(false);
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: false,
      });
      if (res.type !== 'cancel') {
        uploadEmId(res, 'document-picker');
      } else {
        setIdentitiesLoader(false);
      }
    } catch (e) {
      setIdentitiesLoader(false);
      showMessage({
        message: t('errors.somethingWrongContactSupport'),
        backgroundColor: '#FFFFFF',
        color: '#FF4D4A',
        statusBarHeight: StatusBar.currentHeight,
        style: {
          borderColor: '#FF4D4A',
          alignItems: `flex-${currLang === 'ar' ? 'end' : 'start'}`,
          textAlign: currLang === 'ar' ? 'right' : 'left',
          borderLeftWidth: currLang === 'ar' ? 0 : 2,
          borderRightWidth: currLang === 'ar' ? 2 : 0,
        },
      });
    }
  };

  const onBackDropPress = () => {
    setVisible(false);
    setIdentitiesLoader(false);
  };

  return (
    <>
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => onBackDropPress()}
        style={styles.modalView}
      >
        <Card disabled>
          <Text style={[styles.heading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="h6">{side === 'front' ? t('common.uploadIdFront') : t('common.uploadIdBack')}</Text>

          <View>
            <Text category="s1" style={[styles.modalTextButton, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} onPress={handleIdUploadCamera}>
              {t('common.identityCamera')}
            </Text>
            {Platform.OS === 'ios' ? (
              <Text category="s1" style={[styles.modalTextButton, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} onPress={handleIdUploadGallery}>
                {t('common.identityGallery')}
              </Text>
            ) : <></>}
            <Text category="s1" style={[styles.modalTextButton, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} onPress={handleIdUploadBrowseFiles}>
              {t('common.identityFiles')}
            </Text>
          </View>
          <View style={[styles.actions, { justifyContent: currLang === 'ar' ? 'flex-end' : 'flex-start' }]}>
            <Button status="basic" style={styles.enSecondaryCancel} onPress={() => { setVisible(false); setIdentitiesLoader(false); }} size="small">{t('common.cancel')}</Button>
          </View>
        </Card>
      </Modal>
    </>
  );
};

UploadId.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  setIdentitiesLoader: PropTypes.func,
  side: PropTypes.string,
};

UploadId.defaultProps = {
  setIdentitiesLoader: () => {},
  side: null,
};

export default UploadId;
