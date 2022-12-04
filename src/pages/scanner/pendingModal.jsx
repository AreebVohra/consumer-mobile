/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';
import { AppState, View, Text, StatusBar } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { pollDraftStatus, reset } from 'reducers/scanner';
import {
  DRAFT_STATUS_REJECTED,
  DRAFT_STATUS_COMPLETED,
  DRAFT_STATUS_PENDING_MERCHANT,
  DRAFT_STATUS_CANCELLED,
  DRAFT_STATUS_IN_PROGRESS,
  DRAFT_STATUS_PENDING_PAYMENT,
} from 'utils/constants';

import {
  CHECKOUT_STATUS_APPROVED,
  CHECKOUT_STATUS_DECLINED,
} from 'reducers/checkout';

import handleLogEvent from 'utils/handleLogEvent';
import PropTypes from 'prop-types';
import { t } from 'services/i18n';
import { patchDraftPlan, getDraft } from 'api';
import {
  Button,
  Spinner,
  Modal,
} from '@ui-kitten/components';
import { showMessage } from 'react-native-flash-message';
import styles from './styles';

const PendingModal = ({
  visible, setVisible, navigation, merchantScanData, status, addCardVisible, setAddCardVisible, // fromStaticMerchantQr, fromDynamicPaymentLinkQr,
}) => {
  const dispatch = useDispatch();
  const currLang = useSelector((state) => state.language.language);
  const currentDraft = useSelector(state => state.scanner.draftData);
  const expectedVersion = useSelector(state => state.scanner.expectedVersion);
  const fromStaticMerchantQr = useSelector(state => state.scanner.fromStaticMerchantQr);
  const currentUser = useSelector(state => state.application.currentUser);
  const [pollingStarted, setPollingStarted] = useState(false);
  const [cancelDisabled, setCancelDisabled] = useState(false);
  // const [addCardVisible, setAddCardVisible] = useState(false);
  // const [payTabsURI, setPayTabsUri] = useState();

  const handleAppStateChange = nextAppState => {
    if ((nextAppState === 'inactive' || nextAppState === 'background') && visible) {
      handleCancel();
    }
  };

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
    // Specify how to clean up after this effect:
    return function cleanup() {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const handleCancel = async () => {
    if (fromStaticMerchantQr === true) {
      const resp = await getDraft(currentDraft.draft_id);
      if (resp.data.status === DRAFT_STATUS_IN_PROGRESS) {
        setCancelDisabled(true);
        showMessage({
          message: 'Sorry the merchant has already started submitting the order',
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

        return;
      }
      try {
        await patchDraftPlan(currentDraft.draft_id, { status: DRAFT_STATUS_CANCELLED });
      } catch (e) {
        console.error('e', e);
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
    }
    dispatch(reset());
    setCancelDisabled(false);
    setVisible(false);
    navigation.navigate('ScannerCamera');
  };

  useEffect(() => {
    if (fromStaticMerchantQr === true) {
      const pollDraft = async () => {
        await dispatch(pollDraftStatus(currentDraft.draft_id));
      };
      if (visible && status === DRAFT_STATUS_PENDING_MERCHANT && !pollingStarted && currentDraft) {
        setPollingStarted(true);
        pollDraft();
      }
    }
  }, [currentDraft]);

  // moving the visible condition to individual static QR conditions as we show the pendingModal only for static QR, for dynamic QR we don't use the pending modal
  useEffect(() => {
    if (visible && status === DRAFT_STATUS_COMPLETED) {
      handleLogEvent('SpotiiMobileCheckoutSuccess', {
        merchant_id: merchantScanData.id,
        email: currentUser.email,
      });
      setVisible(false);
      setAddCardVisible(false);
      // setPayTabsUri(null);
      navigation.navigate('OrderApproved');
    }

    if (visible && (status === DRAFT_STATUS_CANCELLED || status === DRAFT_STATUS_REJECTED || expectedVersion)) {
      handleLogEvent('SpotiiMobileCheckoutFailure', {
        merchant_id: merchantScanData.id,
        email: currentUser.email,
      });
      setVisible(false);
      setAddCardVisible(false);
      // setPayTabsUri(null);
      navigation.navigate('OrderDeclined');
    }

    if (visible && status === DRAFT_STATUS_PENDING_PAYMENT && !addCardVisible) { // && currentDraft.pt2_redirect_url) {
      // setPayTabsUri(currentDraft.pt2_redirect_url);
      setAddCardVisible(true);
    }

    if (status === CHECKOUT_STATUS_APPROVED) {
      setVisible(false);
      setAddCardVisible(false);
      // setPayTabsUri(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'OrderApproved' }],
      }, {
        index: 1,
        routes: [{ name: 'Shop' }],
      });
    }

    if (status === CHECKOUT_STATUS_DECLINED) {
      setVisible(false);
      setAddCardVisible(false);
      // setPayTabsUri(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'OrderDeclined' }],
      }, {
        index: 1,
        routes: [{ name: 'Shop' }],
      });
    }
  }, [visible, currentDraft, status, expectedVersion]);

  return (

    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
    >
      <View>
        <View style={{ margin: '30%', alignItems: 'center' }}>
          <Spinner size="giant" style={{ color: '#AA8FFF' }} />
        </View>

        {fromStaticMerchantQr && (
          <View style={{ marginHorizontal: '6%' }}>
            <Text style={{ fontSize: 20, color: '#353535', marginHorizontal: '6%', textAlign: currLang === 'ar' ? 'right' : 'left' }}>
              {t('common.qrWaiting')}
              {'\n'}
              {'\n'}
              <Text style={{ fontSize: 15, textAlign: currLang === 'ar' ? 'right' : 'left' }}>
                {t('common.qrWaitingMerchant')}
              </Text>
            </Text>
            <Button style={{ marginTop: '60%' }} size="large" onPress={handleCancel} disabled={cancelDisabled}>
              {t('common.cancel')}
            </Button>
          </View>
        )}
      </View>
    </Modal>

  );
};

PendingModal.propTypes = {
  status: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  // fromStaticMerchantQr: PropTypes.bool,
  // fromDynamicPaymentLinkQr: PropTypes.bool,
  merchantScanData: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    reset: PropTypes.func,
    goBack: PropTypes.func,
  }),
  addCardVisible: PropTypes.bool.isRequired,
  setAddCardVisible: PropTypes.func.isRequired,
};

PendingModal.defaultProps = {
  navigation: null,
  // fromStaticMerchantQr: false,
  // fromDynamicPaymentLinkQr: false,
};

export default PendingModal;
