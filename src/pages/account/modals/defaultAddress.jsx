/* eslint-disable arrow-body-style */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, StatusBar } from 'react-native';
import {
  Text,
  Card,
  Modal,
  Button,
  Spinner,
} from '@ui-kitten/components';
import { setAsDefaultBillingAddress, removeBillingAddress } from 'reducers/billingAddresses';
import { showMessage } from 'react-native-flash-message';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import styles from './styles';

const DefaultAddress = ({ visible, setVisible, currentAddress }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [defaultLoading, setDefaultLoading] = useState(false);

  const handleUseDefault = async id => {
    setDefaultLoading(true);
    try {
      await dispatch(setAsDefaultBillingAddress(id));
      setVisible(false);
      showMessage({
        message: t('success.defaultBillingAddressSuccess'),
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
      setDefaultLoading(false);
    } catch (err) {
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
      setDefaultLoading(false);
    }
  };

  const handleRemove = async id => {
    setDeleteLoading(true);
    try {
      await dispatch(removeBillingAddress(id));
      setVisible(false);
      showMessage({
        message: t('success.deleteBillingAddressSuccess'),
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
      setDeleteLoading(false);
    } catch (err) {
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
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        onBackdropPress={() => setVisible(false)}
        backdropStyle={styles.backdrop}
        style={styles.addressModal}
      >
        <Card disabled>
          <View style={{ marginBottom: '10%' }}>
            <Text style={{ textAlign: currLang === 'ar' ? 'right' : 'left' }} category="h6">{t('common.editAddress')}</Text>
            <Text style={[commonStyles.subTextColor, { textAlign: currLang === 'ar' ? 'right' : 'left', marginTop: '2%' }]} category="s1">{t('common.changeOrDeleteAddress')}</Text>
          </View>

          <View style={[styles.actions, { justifyContent: currLang === 'ar' ? 'flex-end' : 'flex-start' }]}>
            <Button
              disabled={deleteLoading || defaultLoading}
              onPress={() => handleUseDefault(currentAddress.id)}
              size="small"
              appearance="primary"
              accessoryRight={() => { return defaultLoading ? <Spinner size="tiny" /> : null; }}
            >
              {evaProps => <Text category="s1" {...evaProps} style={{ color: '#fff' }}>{t('common.setAsDefault')}</Text>}
            </Button>
            <Button
              style={{ marginLeft: '2%' }}
              disabled={deleteLoading || defaultLoading}
              onPress={() => handleRemove(currentAddress.id)}
              size="small"
              appearance="outline"
              accessoryRight={() => { return deleteLoading ? <Spinner size="tiny" /> : null; }}
            >
              {t('common.delete')}
            </Button>
          </View>
        </Card>
      </Modal>
    </>

  );
};

DefaultAddress.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  currentAddress: PropTypes.shape({
    id: PropTypes.string,
  }),
};

DefaultAddress.defaultProps = {
  currentAddress: null,
};

export default DefaultAddress;
