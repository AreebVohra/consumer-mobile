/* eslint-disable no-multiple-empty-lines */
import React, {
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, ScrollView } from 'react-native';
import { Spinner, Text } from '@ui-kitten/components';
import { useIsFocused } from '@react-navigation/native';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { fetchMerchantDetailsList } from 'reducers/directory';
import { retrieveInitConsumerSpendLimit, retrieveConsumerScore, resetGiftCardCheckout } from 'reducers/application';
import PropTypes from 'prop-types';
import ShopDirectory from 'components/shopDirectory';
import FiltrationBottomSheetContent from 'components/BottomSheet/filtrationBottomSheetContent';

import styles from './styles';

const ShopScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const appState = useSelector(state => state.application);

  const currLang = useSelector(state => state.language.language);

  const { phoneNumber = '' } = appState.currentUser;
  const { isLoading, detailsIsResolved } = useSelector(state => state.directory);

  const isFocused = useIsFocused();

  useEffect(() => {
    dispatch(fetchMerchantDetailsList(currLang, phoneNumber));
  }, [currLang]);

  useEffect(() => {
    dispatch(retrieveConsumerScore());
    dispatch(resetGiftCardCheckout());
  }, [isFocused, phoneNumber]);


  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['15%', '75%'], []);


  return (
    <>
      {isLoading && !detailsIsResolved ? (
        <View style={styles.center}>
          <Spinner size="giant" />
        </View>
      ) : (
        <>
          <ScrollView overScrollMode="never" style={styles.layout} showsVerticalScrollIndicator={false}>
            <GestureHandlerRootView>
              <ShopDirectory categoryFiltrationBottomSheetRef={bottomSheetRef} navigation={navigation} />
            </GestureHandlerRootView>
          </ScrollView>

          <BottomSheetModal
            ref={bottomSheetRef}
            index={1}
            snapPoints={snapPoints}
            enablePanDownToClose
            backdropComponent={(backdropProps) => (
              <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
            )}
          >
            <FiltrationBottomSheetContent bottomSheetRef={bottomSheetRef} />
          </BottomSheetModal>
        </>
      )}
    </>
  );
};

ShopScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

ShopScreen.defaultProps = {
  navigation: null,
};

export default ShopScreen;
