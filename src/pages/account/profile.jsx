/* eslint-disable no-lonely-if */
/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable object-curly-newline */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-multiple-empty-lines */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { View, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Text, Avatar, Card, Button, Linking, Select, SelectItem, IndexPath, Spinner } from '@ui-kitten/components';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Divider } from 'react-native-elements';
import Icon from 'components/Icon';
import UploadPhotoIcon from 'assets/uploadPhotoIcon';
import GreenTickIcon from 'assets/greenTickIcon';
import SmallTrashIcon from 'assets/smallTrashIcon';
import RedExclamationMarkIcon from 'assets/redExclamationMarkIcon';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import { setScreen } from 'utils/handleLogEvent';
import {
  FRONT_AND_BACK_COUNTRIES,
  BACK_COUNTRIES,
  CONSUMER_RISK_DATA_UPLOAD_URL,
  SCORE_DATA_UPLOADED,
  SCORE_DATA_VERIFIED,
  SCORE_DATA_REJECTED,
  PASSPORT_DECLINE_MESSAGES,
  NFC_ENROLLMENT_ERRORS,
  PROFILE_LANGUAGES_TEXT,
} from 'utils/constants';
import { showMessage } from 'react-native-flash-message';
import { nameAbbreviation } from 'utils/misc';
import { resetUserDataDataAndTriggerEvent } from 'reducers/user';
import { getCameraRollPermission } from 'utils/permissions';
import { fetchBillingAddresses } from 'reducers/billingAddresses';
import { reset } from 'reducers/checkout';
import { t } from 'services/i18n';
import { unlinkLeanCustomer, unlinkLeanCustomerReset } from 'reducers/lean';
import * as ImagePicker from 'expo-image-picker';
import { changeLanguage } from 'reducers/language';
import {
  refreshUserProfileAfterUpload,
  retrieveConsumerScore,
  switchRedirectToPasswordRecovery,
  resolveHasIdentitiesAndExpired,
  setTMSessionString,
  showLeanModal,
  setCurrentUserScoreResolved,
} from 'reducers/application';
import { deleteUserAccount } from 'api';
import authApi, { AVATAR_UPLOAD_URL } from 'api/auth';
import PropTypes from 'prop-types';
import { isEmiratesFromPhone, isSaudiFromPhone } from 'utils/countries';
import { useIsFocused } from '@react-navigation/native';
import snakeToCamel from 'utils/snakeToCamel';
import commonStyles from 'utils/commonStyles';
import { handleNfcScan } from 'utils/uqudo';
import DeleteAccountBottomSheetContent from 'components/BottomSheet/deleteAccountBottomSheetContent';
import ChangeEmail from './modals/changeEmail';
import ChangePassword from './modals/changePassword';
import UploadId from './modals/uploadId';
import UploadFile from './modals/uploadFile';
import styles from './styles';
import DeleteAccountModal from './modals/deleteAccountModal';

const SmartechSDK = require('smartech-reactnative-module');

const Profile = ({ navigation }) => {
  const {
    fullName,
    firstName,
    lastName,
    phoneNumber,
    email,
    isEmailVerified,
    userPics,
    hasIdentitiesUploaded,
    hasFrontIdentitiesUploaded,
    isIdExpired,
    userId,
  } = useSelector(
    (state) => state.application.currentUser,
  );
  const { nfcSupported } = useSelector((state) => state.nfcId);

  const dispatch = useDispatch();
  const [emailVerificationLoading, setEmailVerificationLoading] = useState(false);
  const [uploadEmId, setUploadEmId] = useState(false);
  const [identitiesLoader, setIdentitiesLoader] = useState(false);
  const [nfcEnrollmentLoading, setNfcEnrollmentLoading] = useState(false);
  const [leanDeleteLoading, setLeanDeleteLoading] = useState(false);
  const [changeEmailVisible, setChangeEmailVisible] = useState(false);
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const [uploadFileParams, setUploadFileParams] = useState({});
  const [uploadFileHeading, setUploadFileHeading] = useState('');
  const [uploadPassportLoading, setUploadPassportLoading] = useState(() => {});
  const [uploadSalaryLoading, setUploadSalaryLoading] = useState(() => {});
  const [currFileUploadType, setCurrFileUploadType] = useState();
  const [uploadFileVisible, setUploadFileVisible] = useState(false);
  const [leanIsLinked, setLeanIsLinked] = useState(false);
  const [isEmiratesUser, setIsEmiratesUser] = useState(false);
  const [isSaudiUser, setIsSaudiUser] = useState(false);
  const [idSide, setIdSide] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);

  const billingAddresses = useSelector((state) => state.billingAddresses);
  const abbreviation = nameAbbreviation(firstName, lastName);
  const userCountry = alpha3FromISDPhoneNumber(phoneNumber);
  const { currentUserScore, currentUserScoreLoading, currentUserScoreResolved } = useSelector((state) => state.application);
  const { unlinkIsResolved, isLoading } = useSelector((state) => state.lean);
  const nextPayments = useSelector(state => state.nextPayments);
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(new IndexPath(isRTL ? 1 : 0));
  const languageSelectOptions = [
    [0, 'English'],
    [1, 'العربية'],
  ];

  const [
    languageIndexValue,
    languageTextValue,
  ] = languageSelectOptions[selectedLanguageIndex.row];

  const {
    uploadedSalaryStatus,
    lean,
    leanCustomerId,
  } = currentUserScore;

  const leanEntityId = lean.entities.length ? lean.entities[0].entity_id : null;

  const isFocused = useIsFocused();

  const showBack = BACK_COUNTRIES.includes(userCountry) || FRONT_AND_BACK_COUNTRIES.includes(userCountry);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '75%'], []);


  const getRiskUploadDesc = (status, type) => {
    switch (status) {
      case SCORE_DATA_UPLOADED:
        switch (type) {
          case 'passport':
            return t('common.uploadPassportDescUploaded');
          case 'salary':
            return isSaudiUser ? t('common.uploadSalaryGosiDescUploaded') : t('common.uploadSalaryDescUploaded');
          case 'linkedIn':
            return t('common.submitLinkedInDescUploaded');
          default:
            return null;
        }
      case SCORE_DATA_VERIFIED:
        switch (type) {
          case 'passport':
            return t('common.uploadPassportDescVerified');
          case 'salary':
            return isSaudiUser ? t('common.uploadSalaryGosiDescVerified') : t('common.uploadSalaryDescVerified');
          case 'linkedIn':
            return t('common.submitLinkedInDescVerified');
          default:
            return null;
        }
      case SCORE_DATA_REJECTED:
        switch (type) {
          case 'passport':
            return t('common.uploadPassportDescRejected');
          case 'salary':
            return isSaudiUser ? t('common.uploadSalaryGosiDescRejected') : t('common.uploadSalaryDescRejected');
          case 'linkedIn':
            return t('common.submitLinkedIntDescRejected');
          default:
            return null;
        }
      default:
        switch (type) {
          case 'passport':
            return t('common.uploadPassportDesc');
          case 'salary':
            return isSaudiUser ? t('common.uploadSalaryGosiDesc') : t('common.uploadSalaryDesc');
          case 'linkedIn':
            return t('common.submitLinkedInDesc');
          default:
            return null;
        }
    }
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


  useEffect(() => {
    dispatch(fetchBillingAddresses());
    if (!currentUserScoreResolved) {
      dispatch(retrieveConsumerScore());
    }
  }, []);


  useEffect(() => {
    setLeanIsLinked(lean && lean.entities && lean.entities.length);
  }, [lean]);


  useEffect(() => {
    setIsEmiratesUser(isEmiratesFromPhone(phoneNumber));
  }, [phoneNumber]);

  useEffect(() => {
    setIsSaudiUser(isSaudiFromPhone(phoneNumber));
  }, [phoneNumber]);


  // useEffect(() => {
  //   if (!nfcHardwareStatusResolved) {
  //     dispatch(getNfcHardwareStatus(userCountry));
  //   }
  // }, [nfcHardwareStatusResolved]);


  useEffect(() => {
    if (isFocused) {
      setScreen('Profile');
    }
  }, [isFocused]);


  useEffect(() => {
    if (unlinkIsResolved && !currentUserScoreLoading) {
      dispatch(unlinkLeanCustomerReset());
      showMessage({
        message: t('success.leanUnlinked'),
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
    }
    if (unlinkIsResolved === false) {
      setLeanDeleteLoading(false);
      showMessage({
        message: t('errors.somethingWrongContactSupport'),
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
    }
  }, [unlinkIsResolved, currentUserScoreLoading]);


  const handleVerificationResend = async () => {
    try {
      setEmailVerificationLoading(true);
      await authApi.resendVerificationEmail();
      setEmailVerificationLoading(false);
      showMessage({
        message: t('success.verificationEmailSuccess'),
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
    } catch (err) {
      showMessage({
        message: t('errors.somethingWrongContactSupport'),
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
      setEmailVerificationLoading(false);
    }
  };


  const handleAvatarUpload = async () => {
    try {
      const permission = await getCameraRollPermission();
      if (permission === 'granted') {
        const res = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Image,
          allowsEditing: true,
        });

        if (!res.cancelled) {
          const localUri = res.uri;
          const cleanURL = localUri.replace('file://', '');
          const imageName = localUri.split('/').pop();
          // // Infer the type of the image
          const match = /\.(\w+)$/.exec(imageName);
          const imageType = match ? `image/${match[1]}` : 'image';

          const formData = new FormData();
          const file = {
            uri: Platform.OS === 'ios' ? cleanURL : localUri,
            type: imageType,
            filename: imageName,
            name: imageName,
          };

          formData.append('file', file);
          formData.append('type', 'back');
          const token = await authApi.getToken();
          const data = {
            method: 'POST',
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          };
          return fetch(AVATAR_UPLOAD_URL, data)
            .then((response) => {
              if (response.status === 201) {
                dispatch(refreshUserProfileAfterUpload());
                showMessage({
                  message: t('success.avatarUploadSuccess'),
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
              } else {
                showMessage({
                  message: t('errors.avatarUploadError'),
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
              }
            })
            .catch((err) => {
              showMessage({
                message: t('errors.avatarUploadError'),
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
            });
        }
      }
    } catch (e) {
      showMessage({
        message: t('errors.somethingWrongContactSupport'),
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
    }
  };


  const handleUploadPress = (side) => {
    setIdentitiesLoader(true);
    setUploadEmId(true);
    setIdSide(side);
  };


  const handleUploadFilePress = (fileType) => {
    setCurrFileUploadType(fileType);
    const params = {};
    let heading;

    if (fileType === 'salary') {
      params.type = 'salary_file';
      heading = t('common.uploadSalary');
      setUploadSalaryLoading(true);
    } else if (fileType === 'passport') {
      params.type = 'passport_file';
      params.country = userCountry.toLowerCase();
      heading = t('common.uploadPassport');
      setUploadPassportLoading(true);
    }

    setUploadFileParams(params);
    setUploadFileHeading(heading);
    setUploadFileVisible(true);
  };


  const onFileUploadSuccess = () => {
    let message = '';

    if (currFileUploadType === 'salary') {
      message = t('success.salaryUploadSuccess');
    } else if (currFileUploadType === 'passport') {
      message = t('success.passportUploadSuccess');
    }

    dispatch(retrieveConsumerScore());
    showMessage({
      message,
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
  };


  const onFileUploadError = (code = null) => {
    let message = t('errors.somethingWrongContactSupport');
    let redirect = false;

    if (currFileUploadType === 'salary') {
      message = t('errors.somethingWrongContactSupport');
    } else if (currFileUploadType === 'passport') {
      const { NO_MRZ, BAD_SCORE, DUPLICATE_PASSPORT } = PASSPORT_DECLINE_MESSAGES;
      switch (code) {
        case DUPLICATE_PASSPORT:
          redirect = true;
          message = (
            <>
              {`${t('errors.duplicateIdMsgBeforeLink')} `}
              <Text style={{ color: '#AA8FFF', textDecorationLine: 'underline', fontWeight: 'bold' }} category="p1">
                {t('errors.linkToPasswordRecovery')}
              </Text>
              {` ${t('errors.duplicateIdMsgAfterLink')}`}
            </>
          );
          break;
        case NO_MRZ:
        case BAD_SCORE:
          message = <>{t('errors.badPassportImgAndMRZ')}</>;
          break;
        default:
          message = <>{t('errors.somethingWrongContactSupport')}</>;
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
      message: <Text style={{ color: '#FF4D4A', textAlign: isRTL ? 'right' : 'left' }}>{message}</Text>,
      duration: () => (redirect ? 20000 : 4000),
      statusBarHeight: StatusBar.currentHeight,
      backgroundColor: '#FFFFFF',
      color: '#FF4D4A',
      style: {
        borderColor: '#FF4D4A',
        width: '100%',
        alignItems: `flex-${isRTL ? 'end' : 'start'}`,
        textAlign: isRTL ? 'right' : 'left',
        borderLeftWidth: isRTL ? 0 : 2,
        borderRightWidth: isRTL ? 2 : 0,
      },
    });
  };


  const fileUploadSetLoading = (isVisible) => {
    if (currFileUploadType === 'salary') {
      setUploadSalaryLoading(isVisible);
    } else if (currFileUploadType === 'passport') {
      setUploadPassportLoading(isVisible);
    }
  };


  const logout = async () => {
    dispatch(setTMSessionString(null));
    setIsLoggingOut(true);
    await authApi.revoke();
    setIsLoggingOut(false);
    dispatch(reset());
    dispatch(resetUserDataDataAndTriggerEvent());
    dispatch(setCurrentUserScoreResolved(false));
    SmartechSDK.clearUserIdentity();
  };


  const toggleDeleteAccountPage = () => {
    if (!(nextPayments || { list: [] }).list.length) {
      bottomSheetRef.current.present();
    } else {
      setDeleteAccountModalVisible(true);
    }
  };


  const deleteAccount = async () => {
    if (!(nextPayments || { list: [] }).list.length) {
      setIsDeletingAccount(true);
      try {
        await deleteUserAccount(userId);
        logout();
        SmartechSDK.clearUserIdentity();
      } catch (e) {
        showMessage({
          message: t('errors.somethingWrongContactSupport'),
          type: 'danger',
          backgroundColor: '#FF4D4A',
          statusBarHeight: StatusBar.currentHeight,
        });
      }
      setIsDeletingAccount(false);
    }
  };


  const uploadIdButtonText = () => {
    if (nfcSupported && isEmiratesUser) {
      if (hasIdentitiesUploaded) {
        return t('common.update');
      } else {
        return t('common.startScan');
      }
    } else {
      if (hasIdentitiesUploaded) {
        return t('common.update');
      } else {
        return t('common.upload');
      }
    }
  };

  const getEntityDetails = () => {
    if (!lean.entities || !lean.entities.length) {
      return '';
    }

    const entity = lean.entities[0];

    return entity.bank_details.name;
  };


  return (
    <>
      <View style={styles.layout}>
        <KeyboardAvoidingView>

          {/* //# Profile photo, username and email */}

          <Card style={{ borderRadius: 12, marginBottom: 4 }}>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignContent: 'center',
                marginTop: 8,
              }}
            >

              {/* //? Profile picture and upload button */}
              <View style={{ alignSelf: 'center', marginRight: 20 }}>
                {userPics && userPics.image144x144 ? (
                  <Avatar size="medium" source={{ uri: userPics.image144x144 }} />
                ) : (
                  <View style={styles.avatarPlaceHolder}>
                    <Text appearance="hint" category="h5">
                      {abbreviation || 'SP'}
                    </Text>
                  </View>
                )}
                <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0 }} onPress={handleAvatarUpload}>
                  <UploadPhotoIcon />
                </TouchableOpacity>
              </View>

              {/* //? Username, phone, email and logout button */}
              <View style={{ display: 'flex', justifyContent: 'center', marginLeft: 20, flex: 1 }}>
                <Text
                  style={{
                    color: '#1A0826',
                    fontSize: 20,
                    fontWeight: '600',
                    lineHeight: 25,
                  }}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {fullName || 'Your Spotii Account'}
                </Text>
                <View style={styles.profileRow}>
                  <Text style={[styles.profileInfo]}>
                    {phoneNumber && `+${phoneNumber.replace(/\+(\d{3})(\d{2})(\d{3})(\d{4})/, '$1 $2 $3 $4')}`}
                  </Text>
                  <Text style={[styles.profileInfo]}>{email}</Text>
                </View>

                <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, justifyContent: `flex-${isRTL ? 'end' : 'start'}`, marginVertical: 4, alignItems: 'center', width: 180 }}>
                  <Text style={[styles.profileInfo, { textAlign: isRTL ? 'right' : 'left' }]}>{t('common.language')}</Text>
                  <Select
                    status="control"
                    style={{ transform: isRTL ? [{ rotateY: '180deg' }] : [] }}
                    selectedIndex={selectedLanguageIndex}
                    onSelect={(option) => {
                      if (option.row !== selectedLanguageIndex.row) {
                        setSelectedLanguageIndex(option);
                        dispatch(changeLanguage({ lang: `${option.row === 0 ? 'en' : 'ar'}`, shouldFetchMerchantDetailsList: true }));
                      }
                    }}
                    value={() => (
                      <Text
                        style={{
                          color: '#1A0826',
                          fontSize: 15,
                          paddingLeft: isRTL ? 0 : 10,
                          paddingRight: !isRTL ? 0 : 10,
                          transform: isRTL ? [{ rotateY: '180deg' }] : [],
                        }}
                      >
                        {languageTextValue}
                      </Text>
                    )}
                    size="tiny"
                  >
                    {Object.values(PROFILE_LANGUAGES_TEXT).map((lang) => (
                      <SelectItem key={lang} title={lang} />
                    ))}
                  </Select>
                </View>

                <TouchableOpacity
                  style={{
                    display: 'flex',
                    alignSelf: 'flex-start',
                    flexDirection: `row${isRTL ? '-reverse' : ''}`,
                    alignItems: 'center',
                    marginVertical: 8,

                  }}
                  onPress={logout}
                >
                  <Text style={[styles.profileInfo, { color: '#AA8FFF', fontSize: 16 }]}>
                    {t('common.logout')}
                  </Text>
                  {/* only for english */}
                  {isLoggingOut ? (
                    <View style={{ justifyContent: 'center', alignContent: 'center', paddingLeft: 6, height: 23 }}>
                      <Spinner size="tiny" status="info" />
                    </View>
                  ) : (
                    Icon(
                      {
                        fill: '#AA8FFF',
                        width: 20,
                        height: 20,
                        margin: 3,
                      },
                      `arrow-${isRTL ? 'back' : 'forward'}-outline`,
                    )
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </Card>


          {/* //# Emirates ID card */}

          {currentUserScoreResolved ? (
            <>
              <Card style={{ borderRadius: 12, marginVertical: 4 }}>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: `row${isRTL ? '-reverse' : ''}`,
                    justifyContent: 'space-between',
                    height: 100,
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                      {
                        // ? the tick and exclamation marks
                        hasIdentitiesUploaded
                          ? isIdExpired
                            ? <RedExclamationMarkIcon />
                            : <GreenTickIcon />
                          : <RedExclamationMarkIcon />
                      }

                      <Text
                        category="s1"
                        style={{
                          marginLeft: isRTL ? 0 : 8,
                          marginRight: !isRTL ? 0 : 8,
                          color: '#717171',
                        }}
                      >
                        {isEmiratesUser ? t('common.emiratesId') : t('common.nationalId')}
                      </Text>
                    </View>

                    <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, justifyContent: 'space-between' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          color: '#1A0826',
                          marginTop: 12,
                          alignSelf: 'center',
                        }}
                      >
                        {isEmiratesUser ? t('common.uploadEmiratesId') : t('common.uploadYourNationalId')}
                      </Text>
                      <Button
                        onPress={() => (
                          nfcSupported && isEmiratesUser
                            ? handleNfcEnrollment()
                            : handleUploadPress(showBack ? 'back' : 'front')
                        )}
                        size="tiny"
                        status="control"
                      >
                        {(evaProps) => (
                          <Text
                            {...evaProps}
                            style={{
                              color: '#411351',
                              textAlign: isRTL ? 'right' : 'left',
                              borderBottomWidth: 1,
                              borderRadius: 0,
                              paddingLeft: isRTL ? 0 : 1,
                              paddingRight: isRTL ? 1 : 0,
                              paddingBottom: 1,
                              borderBottomColor: '#411351',
                            }}
                          >
                            {isRTL ? (
                              nfcEnrollmentLoading || identitiesLoader) ? (
                                <Spinner size="tiny" />
                              ) : (
                                Icon(
                                  {
                                    fill: '#411351',
                                    width: 20,
                                    height: 14,
                                  },
                                  `arrow-${isRTL ? 'back' : 'forward'}-outline`,
                                )
                              )
                              : <></>}
                            {uploadIdButtonText()}
                            {!isRTL ? (
                              nfcEnrollmentLoading || identitiesLoader) ? (
                                <Spinner size="tiny" />
                              ) : (
                                Icon(
                                  {
                                    fill: '#411351',
                                    width: 20,
                                    height: 14,
                                  },
                                  `arrow-${isRTL ? 'back' : 'forward'}-outline`,
                                )
                              )
                              : <></>}
                          </Text>
                        )}
                      </Button>
                    </View>

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        lineHeight: 15,
                        color: '#717171',
                        marginTop: 4,
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {
                        hasIdentitiesUploaded
                          ? isIdExpired
                            ? t('common.nationalIdExpired') 
                            : t('common.idAlreadyUploaded')
                          : <></>
                      }
                    </Text>

                  </View>
                </View>
                <UploadId visible={uploadEmId} setVisible={setUploadEmId} setIdentitiesLoader={setIdentitiesLoader} side={idSide} />
              </Card>
              {/* //# Bank account for UAE users card */}

              {isEmiratesUser && (leanEntityId || uploadedSalaryStatus !== SCORE_DATA_VERIFIED) && (
                <Card style={{ borderRadius: 12, marginVertical: 4 }}>
    
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: `row${isRTL ? '-reverse' : ''}`,
                      justifyContent: 'space-between',
                      height: 100,
                    }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                        {
                          // ? the tick and exclamation marks
                          leanIsLinked
                            ? <GreenTickIcon />
                            : <RedExclamationMarkIcon />
                        }
    
                        <Text
                          category="s1"
                          style={{
                            marginLeft: isRTL ? 0 : 8,
                            marginRight: !isRTL ? 0 : 8,
                            color: '#717171',
                          }}
                        >
                          {t('common.bankAccount')}
                        </Text>
                      </View>
    
                      <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#1A0826',
                            marginTop: 12,
                            height: 35,
                          }}
                        >
                          {t('common.linkBankAccount')}
                        </Text>
                        {!leanIsLinked ? (
                          <Button
                            onPress={() => {
                            // ? lean is connected, the press should unlink it
                              if (!lean.entities.length) {
                                setLeanDeleteLoading(false);
                                dispatch(showLeanModal(true));
                              }
                            }}
                            size="small"
                            status="control"
                            style={{
                              borderWidth: 1,
                              borderColor: '#411351',
                              borderRadius: 8,
                            }}
                            accessoryRight={() => ((!isRTL && (isLoading || leanDeleteLoading)) ? (
                              <Spinner size="tiny" />
                            ) : <></>)}
                            accessoryLeft={() => ((isRTL && (isLoading || leanDeleteLoading)) ? (
                              <Spinner size="tiny" />
                            ) : <></>)}
                          >
                            {(evaProps) => (
                              <Text {...evaProps} style={{ fontSize: 14, fontWeight: '600', lineHeight: 18, color: '#411351' }}>
                                {t('common.linkNow')}
                              </Text>
                            )}
                          </Button>
                        ) : <></>}
                        {leanIsLinked ? (
                          <View style={leanIsLinked ? styles.leanMultiButtonContainer : null}>
                            <View style={leanIsLinked ? styles.leanMainButton : null}>
                        
                              <Button
                                size="small"
                                style={{ backgroundColor: '#066', borderColor: '#066' }}
                                status="success"
                                accessoryLeft={props => Icon({
                                  ...props, ...styles.drawerIcon, fill: '#FFFFFF',
                                }, 'link-2-outline')}
                              >
                                {leanIsLinked ? getEntityDetails() : t('uploaded')}
                              </Button>
                            </View>
                        
                            {leanIsLinked ? (
                              <View style={styles.leanDeleteButton}>
                                <Button
                                  appearance="ghost"
                                  onPress={() => {
                                    dispatch(unlinkLeanCustomer(leanCustomerId));
                                    setLeanDeleteLoading(true);
                                  }}
                                  accessoryLeft={props => (isLoading || leanDeleteLoading ? <Spinner size="small" status="basic" /> : Icon({
                                    ...props, ...styles.drawerIcon,
                                  }, 'trash-outline'))}
                                />
                              </View>
                            ) : <></>}
                        
                          </View>
                        ) : <></>}
    
                      </View>
                      <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '400',
                            lineHeight: 15,
                            color: '#717171',
                            marginTop: 4,
                            textAlign: isRTL ? 'right' : 'left',
                          }}
                        >
                          {leanIsLinked ? t('common.uploadBankDescVerified') : t('common.notLinkedBankAccount')}
                        </Text>
                      </View>
    
                    </View>
                  </View>
                </Card>
              )}

              {/* //# Salary certificate card */}

              {!leanIsLinked ? (
                <Card style={{ borderRadius: 12, marginVertical: 4, paddingBottom: 8 }}>
    
                  <View
                    style={{
                      display: 'flex',
                      flexDirection: `row${isRTL ? '-reverse' : ''}`,
                      justifyContent: 'space-between',
                    }}
                  >
                    <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                      <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                        {
                        // ? the tick and exclamation marks
                        uploadedSalaryStatus === SCORE_DATA_VERIFIED
                          ? <GreenTickIcon />
                          : <RedExclamationMarkIcon />
                      }
    
                        <Text
                          category="s1"
                          style={{
                            marginLeft: isRTL ? 0 : 8,
                            marginRight: !isRTL ? 0 : 8,
                            color: '#717171',
                          }}
                        >
                          {isSaudiUser ? t('common.gosiBankAccountSalaryCert') : t('common.salaryCertificate')}
                        </Text>
                      </View>
    
                      <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, justifyContent: 'space-between' }}>
                        <Text
                          style={{
                            fontSize: 14,
                            fontWeight: '600',
                            color: '#1A0826',
                            marginTop: 12,
                            maxWidth: '65%',
                            height: 35,
                          }}
                        >
                          {isSaudiUser ? t('common.uploadGosiOrSalCert') : t('common.uploadSalaryCertificate')}
                        </Text>
                        {uploadedSalaryStatus !== SCORE_DATA_VERIFIED && (
                        <Button
                          onPress={() => handleUploadFilePress('salary')}
                          size="small"
                          status="control"
                          style={{
                            borderWidth: 1,
                            borderColor: '#411351',
                            borderRadius: 8,
                          }}
                          accessoryRight={() => (!isRTL && uploadSalaryLoading ? (
                            <Spinner size="tiny" />
                          ) : <></>)}
                          accessoryLeft={() => (isRTL && uploadSalaryLoading ? (
                            <Spinner size="tiny" />
                          ) : <></>)}
                        >
                          {(evaProps) => (
                            <Text {...evaProps} style={{ fontSize: 14, fontWeight: '600', lineHeight: 18, color: '#411351' }}>
                              {t('common.uploadNow')}
                            </Text>
                          )}
                        </Button>
                        )}
                      </View>
    
                      <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                        <Text
                          style={{
                            fontSize: 12,
                            fontWeight: '400',
                            lineHeight: 15,
                            color: '#717171',
                            marginTop: 4,
                            textAlign: isRTL ? 'right' : 'left',                    
                          }}
                        >
                          {getRiskUploadDesc(uploadedSalaryStatus, 'salary')}
                        </Text>
                      </View>
    
                    </View>
                  </View>
                  <UploadFile
                    visible={uploadFileVisible}
                    setVisible={setUploadFileVisible}
                    heading={uploadFileHeading}
                    params={uploadFileParams}
                    setLoader={(isVisible) => fileUploadSetLoading(isVisible)}
                    onSuccess={onFileUploadSuccess}
                    onError={onFileUploadError}
                    uploadUrl={CONSUMER_RISK_DATA_UPLOAD_URL}
                  />
                </Card>
              ) : <></>}

              {/* //# Email card */}

              {/* <Card style={{ borderRadius: 12, marginVertical: 4 }}>

                <View
                  style={{
                    display: 'flex',
                    flexDirection: `row${isRTL ? '-reverse' : ''}`,
                    justifyContent: 'space-between',
                    height: 100,
                  }}
                >
                  <View style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}` }}>
                      {
                        // ? the tick and exclamation marks
                        isEmailVerified
                          ? <GreenTickIcon />
                          : <RedExclamationMarkIcon />
                      }

                      <Text
                        category="s1"
                        style={{
                          marginLeft: isRTL ? 0 : 8,
                          marginRight: !isRTL ? 0 : 8,
                          color: '#717171',
                        }}
                      >
                        {t('common.email')}
                      </Text>
                    </View>

                    <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, justifyContent: 'space-between' }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '600',
                          lineHeight: 23,
                          color: '#1A0826',
                          marginTop: 12,
                          alignSelf: 'center',
                        }}
                      >
                        {email}
                      </Text>
                      <Button
                        onPress={() => setChangeEmailVisible(true)}
                        size="large"
                        status="control"
                        style={{
                          borderBottomWidth: 1,
                          borderRadius: 0,
                          paddingLeft: isRTL ? 0 : 1,
                          paddingRight: isRTL ? 1 : 0,
                          paddingBottom: 1,
                          borderBottomColor: '#411351',
                        }}
                        accessoryRight={() => (
                          !isRTL ? Icon(
                            {
                              fill: '#411351',
                              width: 20,
                              height: 20,
                            },
                            `arrow-${isRTL ? 'back' : 'forward'}-outline`,
                          ) : <></>
                        )}
                        accessoryLeft={() => (
                          isRTL ? Icon(
                            {
                              fill: '#411351',
                              width: 20,
                              height: 20,
                            },
                            `arrow-${isRTL ? 'back' : 'forward'}-outline`,
                          ) : <></>
                        )}
                      >
                        {(evaProps) => (
                          <Text {...evaProps} style={{ color: '#411351', textAlign: isRTL ? 'right' : 'left' }}>
                            {t('common.update')}
                          </Text>
                        )}
                      </Button>
                    </View>

                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: '400',
                        lineHeight: 15,
                        color: '#717171',
                        marginTop: 4,
                        textAlign: isRTL ? 'right' : 'left',
                      }}
                    >
                      {isEmailVerified ? t('common.emailVerified') : t('common.verificationRequired')}
                    </Text>

                  </View>
                </View>
                <ChangeEmail visible={changeEmailVisible} setVisible={setChangeEmailVisible} />
              </Card> */}
              {/* //# Manage your account */}
              <Card style={{ backgroundColor: '#F2F2F2', borderWidth: 0, borderRadius: 12, marginVertical: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '400', lineHeight: 18, color: '#717171' }}>{t('common.manageAccount')}</Text>
                <Divider orientation="horizontal" color="#CCC" style={{ marginTop: 8, marginBottom: 15, flexGrow: 0 }} width={1} />
                <TouchableOpacity onPress={toggleDeleteAccountPage} style={{ flexDirection: `row${isRTL ? '-reverse' : ''}`, alignItems: 'center' }}>
                  <SmallTrashIcon fill="#411351" />
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: '4oo',
                      lineHeight: 18,
                      color: '#411351',
                      textDecorationLine: 'underline',
                      marginLeft: !isRTL ? 12 : 0,
                      marginRight: isRTL ? 12 : 0,
                    }}
                  >
                    {t('common.deleteAccount')}
                  </Text>
                </TouchableOpacity>
              </Card>
            </>
          ) : (
            <View style={{ alignItems: 'center', marginTop: 16 }}>
              <Spinner size="giant" />
            </View>
          )}

        </KeyboardAvoidingView>
      </View>

      <DeleteAccountModal visible={deleteAccountModalVisible} setVisible={setDeleteAccountModalVisible} navigation={navigation} />

      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
        )}
      >
        <DeleteAccountBottomSheetContent isDeletingAccount={isDeletingAccount} deleteAccount={deleteAccount} bottomSheetRef={bottomSheetRef} />
      </BottomSheetModal>
    </>
  );
};

Profile.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

Profile.defaultProps = {
  navigation: null,
};

export default Profile;
