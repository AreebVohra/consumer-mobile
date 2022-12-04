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
import Icon from 'components/Icon';
import BigTrashIcon from 'assets/bigTrashIcon';
import { setAsDefaultPaymentMethod, removePaymentMethod } from 'reducers/paymentMethods';
import { showMessage } from 'react-native-flash-message';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import styles from './styles';

const DeleteCardModal = ({
  visible,
  setVisible,
  currentAddress,
  handleBack,
}) => {
  const dispatch = useDispatch();
  const currLang = useSelector((state) => state.language.language);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleRemove = async (id) => {
    setDeleteLoading(true);
    try {
      await dispatch(removePaymentMethod(id));
      setVisible(false);
      showMessage({
        message: t('success.cardDeleteSuccess'),
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
      <Modal visible={visible} onBackdropPress={() => setVisible(false)} backdropStyle={styles.backdrop} style={styles.addressModal}>
        <Card
          style={{
            flex: 1,
            alignItems: 'center',
            height: 224,
            borderRadius: 24,
          }}
        >
          <View style={{ flex: 1, justifyContent: 'space-around' }}>
            <View style={{ alignSelf: 'center' }}>
              <BigTrashIcon />
            </View>

            <Text
              style={{
                fontSize: 14,
                color: '#1A0826',
                alignSelf: 'center',
                marginVertical: 14,
              }}
            >
              {t('common.areYouSureDeletePaymentMethod')}
            </Text>

            <View style={[styles.actions]}>
              <Button
                disabled={deleteLoading}
                onPress={() => setVisible(false)}
                size="large"
                status="control"
                style={{
                  marginRight: 14,
                  borderRadius: 8,
                }}
              >
                {(evaProps) => (
                  <Text
                    {...evaProps}
                    style={{
                      color: '#411361', fontSize: 14, fontWeight: '700', paddingHorizontal: 24,
                    }}
                  >
                    {t('common.cancel')}
                  </Text>
                )}
              </Button>
              <Button
                disabled={deleteLoading}
                onPress={() => handleRemove(currentAddress.id)}
                size="large"
                status="control"
                style={{
                  marginLeft: 14,
                  borderRadius: 8,
                  backgroundColor: deleteLoading ? '#CCCCCC' : '#411361',
                }}
              >
                {(evaProps) => (
                  <View
                    style={{
                      display: 'flex', flexDirection: 'row', paddingLeft: 24, paddingRight: 12,
                    }}
                  >
                    <Text
                      {...evaProps}
                      style={{
                        color: deleteLoading ? '#411361' : '#FFF', fontSize: 14, fontWeight: '700', marginRight: 12,
                      }}
                    >
                      {t('common.delete')}
                    </Text>
                    {deleteLoading && <Spinner size="tiny" />}
                  </View>
                )}
              </Button>
            </View>
          </View>
        </Card>
      </Modal>
    </>
  );
};

DeleteCardModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  currentAddress: PropTypes.shape({
    id: PropTypes.string,
  }),
  handleBack: PropTypes.func.isRequired,
};

DeleteCardModal.defaultProps = {
  currentAddress: null,
};

export default DeleteCardModal;
