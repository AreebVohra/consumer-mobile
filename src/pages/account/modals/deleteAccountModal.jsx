import React from 'react';
import { View } from 'react-native';
import { Text, Card, Modal, Button } from '@ui-kitten/components';
import BigTrashIcon from 'assets/bigTrashIcon';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import styles from './styles';

const DeleteAccountModal = ({ visible, setVisible, navigation }) => (
  <Modal visible={visible} onBackdropPress={() => setVisible(false)} backdropStyle={styles.backdrop} style={styles.addressModal}>
    <Card
      style={{
        flex: 1,
        alignItems: 'center',
        height: 260,
        borderRadius: 24,
      }}
    >
      <View style={{ flex: 1, justifyContent: 'space-around' }}>
        <View style={{ alignSelf: 'center' }}>
          <BigTrashIcon />
        </View>

        <Text
          style={{
            fontSize: 18,
            fontWeight: '700',
            lineHeight: 23,
            color: '#1A0826',
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 8,
          }}
        >
          {t('common.accountDeletionFailed')}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            lineHeight: 18,
            color: '#717171',
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          {t('common.pleaseClearOutstandingBeforeDelete')}
        </Text>

        <View style={[styles.actions]}>
          <Button
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
                  color: '#411361',
                  fontSize: 14,
                  fontWeight: '700',
                  paddingHorizontal: 24,
                }}
              >
                {t('common.cancel')}
              </Text>
            )}
          </Button>
          <Button
            size="large"
            status="control"
            style={{
              marginLeft: 14,
              borderRadius: 8,
              backgroundColor: '#411361',
              paddingHorizontal: 21,
            }}
            onPress={() => {
              setVisible(false);
              navigation.navigate('Orders');
            }}
          >
            {(evaProps) => (
              <Text
                {...evaProps}
                style={{
                  color: '#FFF',
                  fontSize: 14,
                  fontWeight: '700',
                }}
              >
                {t('common.goToMyOrders')}
              </Text>
            )}
          </Button>
        </View>
      </View>
    </Card>
  </Modal>
);

DeleteAccountModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }).isRequired,
};

export default DeleteAccountModal;
