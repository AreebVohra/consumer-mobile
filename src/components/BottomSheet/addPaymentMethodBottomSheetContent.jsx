/* eslint-disable no-multiple-empty-lines */
import React, { useEffect } from 'react';
import { BackHandler, View } from 'react-native';
import { useDispatch } from 'react-redux';
import { Spinner } from '@ui-kitten/components';
import VgsPaymentForm from 'components/VgsPaymentForm';
import { fetchPaymentMethods } from 'reducers/paymentMethods';
import { resetRedirectData } from 'reducers/vgs';
import { ScrollView } from 'react-native-gesture-handler';
import { t } from 'services/i18n';
import PropTypes from 'prop-types';
import styles from './styles';

const AddPaymentMethodBottomSheetContent = ({
  navigation,
  bottomSheetRef,
  showVgsForm,
  setShowVgsForm,
}) => {
  const dispatch = useDispatch();


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


  const handleBackFunction = () => {
    setShowVgsForm(false);
    dispatch(resetRedirectData());
    dispatch(fetchPaymentMethods());
    bottomSheetRef.current.close();
  };


  return (
    <ScrollView overScrollMode="never">
      {showVgsForm ? (
        <VgsPaymentForm
          handleBack={handleBackFunction}
          navigation={navigation}
          showHeader
        />
      ) : (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            margin: '25%',
            // backgroundColor: 'red',
          }}
        >
          <Spinner />
        </View>
      )}
    </ScrollView>
  );
};

AddPaymentMethodBottomSheetContent.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }),
  bottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      expand: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
  showVgsForm: PropTypes.bool,
  setShowVgsForm: PropTypes.func,
};

AddPaymentMethodBottomSheetContent.defaultProps = {
  navigation: null,
  bottomSheetRef: null,
  showVgsForm: true,
  setShowVgsForm: () => {},
};

export default AddPaymentMethodBottomSheetContent;
