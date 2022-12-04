/* eslint-disable arrow-body-style */
import axios from 'axios';
import React from 'react';
import { View, Platform, StatusBar } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Text,
  Card,
  Modal,
  Button,
} from '@ui-kitten/components';
import PropTypes from 'prop-types';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getCameraRollPermission, getCameraPermission } from 'utils/permissions';
import { showMessage } from 'react-native-flash-message';
import { t } from 'services/i18n';
import authApi from 'api/auth';
import styles from './styles';

const UploadFile = ({
  visible,
  setVisible,
  params,
  uploadUrl,
  setLoader,
  heading,
  onSuccess,
  onError,
}) => {
  const currLang = useSelector(state => state.language.language);

  const upload = async (res, source = 'default') => {
    const localUri = res.uri;
    const cleanURL = localUri.replace('file://', '');
    const imageName = localUri.split('/').pop();
    // // Infer the type of the image
    const match = /\.(\w+)$/.exec(imageName);
    const imageType = match ? `image/${match[1]}` : 'image';

    const formData = new FormData();
    const file = {
      uri: Platform.OS === 'ios' ? cleanURL : localUri,
      type: source === 'document-picker' ? `application/${imageType}` : imageType,
      filename: imageName,
      name: Platform.OS === 'ios' ? imageName : res.name,
    };

    if (params) {
      Object.keys(params).forEach(key => {
        formData.append(key, params[key]);
      });
    }
    formData.append('file', file);

    try {
      const token = await authApi.getToken();

      const resp = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (onSuccess) {
        setLoader(false);
        onSuccess();
      }
    } catch (e) {
      setLoader(false);
      let code = null;
      if (e && e.response && e.response.data) {
        code = e.response.data.code;
      }
      onError(code);
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
          upload(res);
        } else {
          setLoader(false);
        }
      } else {
        setLoader(false);
        onError();
      }
    } catch (e) {
      setLoader(false);
      let code = null;
      if (e && e.response && e.response.data) {
        code = e.response.data.code;
      }
      onError(code);
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
          upload(res);
        } else {
          setLoader(false);
        }
      } else {
        setLoader(false);
        onError();
      }
    } catch (e) {
      setLoader(false);
      let code = null;
      if (e && e.response && e.response.data) {
        code = e.response.data.code;
      }
      onError(code);
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
        upload(res, 'document-picker');
      } else {
        setLoader(false);
      }
    } catch (e) {
      setLoader(false);
      let code = null;
      if (e && e.response && e.response.data) {
        code = e.response.data.code;
      }
      onError(code);
    }
  };

  const onBackDropPress = () => {
    setVisible(false);
    setLoader(false);
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
          <Text style={[styles.heading, { textAlign: currLang === 'ar' ? 'right' : 'left' }]} category="h6">{heading}</Text>
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
            <Button
              status="basic"
              style={styles.enSecondaryCancel}
              onPress={() => { setVisible(false); setLoader(false); }}
              size="small"
            >
              {t('common.cancel')}
            </Button>
          </View>
        </Card>
      </Modal>
    </>
  );
};

UploadFile.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  params: PropTypes.shape({}),
  heading: PropTypes.string,
  uploadUrl: PropTypes.string.isRequired,
  setLoader: PropTypes.func,
  onSuccess: PropTypes.func,
  onError: PropTypes.func,
};

UploadFile.defaultProps = {
  params: undefined,
  heading: '',
  setLoader: () => {},
  onSuccess: undefined,
  onError: () => {
    showMessage({
      message: t('errors.somethingWrongContactSupport'),
      type: 'danger',
      backgroundColor: '#FFFFFF',
      color: '#FF4D4A',
      statusBarHeight: StatusBar.currentHeight,
      style: {
        borderColor: '#FF4D4A',
        borderLeftWidth: 2,
      },
    });
  },
};

export default UploadFile;
