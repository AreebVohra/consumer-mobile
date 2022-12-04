/* eslint-disable object-curly-newline */
/* eslint-disable no-multiple-empty-lines */
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { ScrollView, View, TouchableOpacity, StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { showMessage } from 'react-native-flash-message';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Text, Card, Button } from '@ui-kitten/components';
import { PAYMENT_TYPES } from 'utils/constants';
import { t } from 'services/i18n';
import { useIsFocused } from '@react-navigation/native';
import SmallTrashIcon from 'assets/smallTrashIcon';
import PropTypes from 'prop-types';
import { setAsDefaultPaymentMethod, fetchPaymentMethods } from 'reducers/paymentMethods';
import { setScreen } from 'utils/handleLogEvent';
import VisaLogo from 'assets/visaLogo';
import MasterCardLogo from 'assets/masterCardLogo';
import Icon from 'components/Icon';
import TileSelector from 'components/TileSelector';
import { resetRedirectData } from 'reducers/vgs';
import AddPaymentMethodBottomSheetContent from 'components/BottomSheet/addPaymentMethodBottomSheetContent';

import DeleteCardModal from './modals/deleteCardModal';

import styles from './styles';

const PaymentMethods = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const paymentMethods = useSelector((state) => state.paymentMethods);
  const isFocused = useIsFocused();

  // Do not remove: although not used it triggers re-render on Language change
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const [deleteCardModalVisible, setDeleteCardModalVisible] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [showVgsPaymentForm, setShowVgsPaymentForm] = useState(null);
  const [defaultLoading, setDefaultLoading] = useState(false);

  const [cards, setCards] = useState([]);
  const [defaultCard, setDefaultCard] = useState([]);

  const [showVgsForm, setShowVgsForm] = useState(true);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ['10%', '75%'], []);

  const showBottomSheetHandler = useCallback(() => {
    bottomSheetRef?.current?.present();
    setShowVgsForm(true);
  }, [bottomSheetRef]);

  useEffect(() => {
    dispatch(resetRedirectData());
  }, []);

  useEffect(() => {
    dispatch(fetchPaymentMethods());
  }, []);


  useEffect(() => {
    setCards(paymentMethods.list.filter((pm) => !pm.isDefault && (pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY)));
    setDefaultCard(paymentMethods.list.find((pm) => pm.isDefault && (pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY)));
  }, [paymentMethods]);


  useEffect(() => {
    if (isFocused) {
      setScreen('PaymentMethods');
    }
  }, [isFocused]);


  const listCards = cards.map(method => ({
    title: (
      <>
        <Text style={{ fontSize: 20, fontWeight: '700', lineHeight: 25, paddingHorizontal: 14 }}>•••• •••• ••••</Text>
        <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 20 }}>
          {` ${method.number ? method.number.slice(-4) : ''}`}
        </Text>
      </>
    ),
    item: method,
  }));


  const renderListItemIcon = (props, item) => {
    if (!item) return null;
    if (item.type) {
      let logo = <Text category="s2">{item.type.slice(0, 1).toUpperCase() + item.type.slice(1)}</Text>;
      if (item.type === 'visa') {
        logo = <VisaLogo />;
      }
      if (item.type === 'mastercard') {
        logo = <MasterCardLogo />;
      }
      return <View style={styles.cardLogo}>{logo}</View>;
    }
    return null;
  };


  const handleUseDefault = async id => {
    setDefaultLoading(true);
    try {
      await dispatch(setAsDefaultPaymentMethod(id));
      showMessage({
        message: t('success.defaultPaymentMethodSuccess'),
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
      setDefaultLoading(false);
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
      setDefaultLoading(false);
    }
  };


  const renderPaymentMethodSelectHeader = (item, _, __) => (
    <View style={styles.paymentMethodHeader}>
      {renderListItemIcon(null, item.item)}
      {item.title}
    </View>
  );


  const renderPaymentMethodSelectBody = ({ item }, _, __) => (
    <Card
      status="control"
      style={{
        display: 'flex',
        borderColor: '#CCCCCC',
        borderRadius: 12,
        marginTop: 12,
      }}
    >
      <View
        style={{
          display: 'flex',
          flexDirection: `row${isRTL ? '-reverse' : ''}`,
          justifyContent: 'space-between',
        }}
      >
        <Text
          style={{
            fontSize: 13,
            fontWeight: '400',
            lineHeight: 15,
            color: '#411361',
            paddingBottom: 18,
          }}
        >
          {t('common.paymentMethod')}
        </Text>
        <TouchableOpacity
          onPress={() => { setDeleteCardModalVisible(true); setCurrentCard(item); }}
          style={{
            width: 34,
            alignItems: 'center',
            // backgroundColor: 'red',
          }}
        >
          <SmallTrashIcon />
        </TouchableOpacity>
      </View>

      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#F9F9F9',
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 9,
        }}
      >
        {renderListItemIcon(null, item)}
        <Text style={{ fontSize: 20, fontWeight: '700', lineHeight: 25, paddingHorizontal: 14 }}>•••• •••• ••••</Text>
        <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 20 }}>
          {` ${item.number ? item.number.slice(-4) : ''}`}
        </Text>
      </View>

      <Button
        onPress={() => handleUseDefault(item.id)}
        size="large"
        status="control"
        style={{
          marginTop: 14,
        }}
        accessoryRight={() => (
          !isRTL ? Icon(
            {
              fill: '#1A0826',
              width: 20,
              height: 20,
            },
            'arrow-forward-outline',
          ) : <></>
        )}
        accessoryLeft={() => (
          isRTL ? Icon(
            {
              fill: '#1A0826',
              width: 20,
              height: 20,
            },
            'arrow-back-outline',
          ) : <></>
        )}
      >
        {(evaProps) => (
          <Text
            {...evaProps}
            style={{
              fontSize: 14,
              fontWeight: '600',
              lineHeight: 18,
              color: '#1A0826',
              paddingRight: !isRTL ? 16 : 0,
              paddingLeft: isRTL ? 16 : 0,
            }}
          >
            {t('common.makeDefaultPaymentMethod')}
          </Text>
        )}
      </Button>
    </Card>
  );


  return (
    <>
      <View style={styles.layout}>
        <View style={{ flex: 1, borderRadius: 12, marginBottom: 4, backgroundColor: '#FFF', padding: 10 }}>

          <View style={{ marginTop: 8, marginBottom: 28, paddingHorizontal: 42 }}>
            <Text
              style={{
                textAlign: 'center', fontSize: 18, fontWeight: '700', lineHeight: 24, color: '#1A0826', marginBottom: 8,
              }}
            >
              {t('common.paymentDetails')}
            </Text>

            <Text
              style={{
                textAlign: 'center', fontSize: 14, fontWeight: '400', lineHeight: 18, color: '#353535', marginTop: 8,
              }}
            >
              {t('common.addNewCardDesc')}
            </Text>
          </View>

          <Button
            onPress={showBottomSheetHandler}
            size="large"
            status="control"
            style={{
              backgroundColor: '#F9F9F9',
            }}
            accessoryLeft={() => (
              !isRTL ? Icon(
                {
                  fill: '#1A0826',
                  width: 20,
                  height: 20,
                },
                'plus-outline',
              ) : <></>
            )}
            accessoryRight={() => (
              isRTL ? Icon(
                {
                  fill: '#1A0826',
                  width: 20,
                  height: 20,
                },
                'plus-outline',
              ) : <></>
            )}
          >
            {(evaProps) => (
              <Text
                {...evaProps}
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  lineHeight: 18,
                  color: '#1A0826',
                  paddingLeft: !isRTL ? 16 : 0,
                  paddingRight: isRTL ? 16 : 0,
                }}
              >
                {t('common.addNewCard')}
              </Text>
            )}
          </Button>

          <ScrollView overScrollMode="never">
            {defaultCard ? (
              <Card
                status="control"
                style={{
                  display: 'flex',
                  borderColor: '#CCCCCC',
                  borderRadius: 12,
                  marginTop: 12,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: '400', lineHeight: 15, color: '#411361', paddingBottom: 18 }}>{t('common.defaultPaymentMethod')}</Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#F9F9F9',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 9,
                  }}
                >
                  {renderListItemIcon(null, defaultCard)}
                  <Text style={{ fontSize: 20, fontWeight: '700', lineHeight: 25, paddingHorizontal: 14 }}>•••• •••• ••••</Text>
                  <Text style={{ fontSize: 16, fontWeight: '400', lineHeight: 20 }}>
                    {` ${defaultCard && defaultCard.number ? defaultCard.number.slice(-4) : ''}`}
                  </Text>
                </View>

                <View style={{ display: 'flex', flexDirection: `row${isRTL ? '-reverse' : ''}`, alignItems: 'center', justifyContent: 'center', marginTop: 26, marginBottom: 12 }}>
                  {Icon(
                    {
                      fill: '#717171',
                      width: 16,
                      height: 14,
                      marginRight: !isRTL ? 4 : 0,
                      marginLeft: isRTL ? 4 : 0,
                    },
                    'alert-triangle-outline',
                  )}
                  <Text
                    style={{ fontSize: 12,
                      fontWeight: '300',
                      lineHeight: 15,
                      color: '#717171',
                      marginLeft: !isRTL ? 4 : 0,
                      marginRight: isRTL ? 4 : 0,
                    }}
                  >
                    {t('common.cannotDetachDefaultPaymentMethod')}
                  </Text>
                </View>
              </Card>
            ) : <></>}

            {listCards.length > 0 && (
              <View style={{ marginTop: 12, padding: 0, borderColor: '#CCCCCC', paddingBottom: '2%' }}>
                <TileSelector
                  list={listCards}
                  renderHeader={renderPaymentMethodSelectHeader}
                  renderBody={renderPaymentMethodSelectBody}
                  itemKey={item => `${item.item.id}`}
                  defaultIndex={-1}
                />
              </View>
            )}
          </ScrollView>
        </View>
        <DeleteCardModal visible={deleteCardModalVisible} setVisible={setDeleteCardModalVisible} currentAddress={currentCard} />
      </View>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={(backdropProps) => (
          <BottomSheetBackdrop {...backdropProps} enableTouchThrough />
        )}
      >
        <AddPaymentMethodBottomSheetContent showVgsForm={showVgsForm} setShowVgsForm={setShowVgsForm} bottomSheetRef={bottomSheetRef} />
      </BottomSheetModal>
    </>
  );
};

PaymentMethods.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      addCard: PropTypes.string,
    }),
  }),
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
  showBottomSheetHandler: PropTypes.func,
};

PaymentMethods.defaultProps = {
  route: null,
  navigation: null,
  showBottomSheetHandler: () => {},
};

export default PaymentMethods;
