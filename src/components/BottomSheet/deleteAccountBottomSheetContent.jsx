/* eslint-disable no-multiple-empty-lines */
import React, { useEffect } from 'react';
import { BackHandler, View } from 'react-native';
import { Button, Spinner, Text } from '@ui-kitten/components';
import BigTrashIcon from 'assets/bigTrashIcon';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import styles from './styles';

const DeleteAccountBottomSheetContent = ({ isDeletingAccount, deleteAccount, bottomSheetRef }) => {
  useEffect(() => {
    const backAction = () => {
      bottomSheetRef.current.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);


  return (
    <View style={styles.touchableCard}>
      <View style={styles.deleteAccountView}>
        <BigTrashIcon width="100" height="100" />

        <Text style={styles.deleteAccountHeader}>
          {t('common.deleteYourAccount')}
        </Text>

        <Text style={styles.deleteAccountSub}>
          {t('common.deleteAccountInfo')}
        </Text>

        <Button
          appearance="filled"
          size="large"
          style={styles.deleteAccountBtn}
          accessoryLeft={() => (isDeletingAccount ? <Spinner status="control" style={{ color: '#FFFFFF' }} size="tiny" /> : null)}
          onPress={deleteAccount}
        >
          {(evaProps) => (
            <Text {...evaProps} style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700', lineHeight: 18 }}>
              {t('common.deleteAccountAndSignOut')}
            </Text>
          )}
        </Button>

        <Text category="s1" style={styles.deleteAccountKeepIt} onPress={() => bottomSheetRef.current.close()}>
          {t('common.keepAccount')}
        </Text>
      </View>

      <View style={{ marginBottom: '25%' }}>
        <Text category="s2" style={styles.deleteAccountFooter}>
          {t('common.ifYouWishToRetrieve')}
        </Text>

        <Text category="s2" style={[styles.deleteAccountFooter, { fontWeight: '400', color: '#411361' }]}>
          {t('common.contactPhoneNumbers')}
        </Text>
      </View>
    </View>
  );
};

DeleteAccountBottomSheetContent.propTypes = {
  bottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      expand: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
  isDeletingAccount: PropTypes.bool,
  deleteAccount: PropTypes.func,
};

DeleteAccountBottomSheetContent.defaultProps = {
  bottomSheetRef: null,
  isDeletingAccount: false,
  deleteAccount: () => {},
};

export default DeleteAccountBottomSheetContent;
