/* eslint-disable operator-linebreak */
/* eslint-disable operator-linebreak */
/* eslint-disable camelcase */
/* eslint-disable arrow-body-style */
import React, { useEffect, useState } from 'react';
import { View, BackHandler, TouchableOpacity } from 'react-native';
import Icon from 'components/Icon';
import {
  reset,
  requestDraftPlans,
  requestMerchantInfo,
  selectPlan,
  selectPaymentMethod,
  createDraftCheckout,
  setIsNoCard,
  setPseudoDraftError,
  fetchOrderEstimations,
  resetOrderEstimations,
} from 'reducers/scanner';
import {
  Input,
  Text,
  Spinner,
  Card,
  Button,
  SelectItem,
  Layout,
  Popover,
} from '@ui-kitten/components';
import { t } from 'services/i18n';
import { delay } from 'utils/delay';
import formatCurrency from 'utils/formatCurrency';
import { PLAN_SLUGS, PAYMENT_TYPES, BLOCKING_CODES, ZERO_DOWN_PLANS } from 'utils/constants';
import config from 'utils/config';
import preFillFields from 'utils/preFillFields';
import { useSelector, useDispatch } from 'react-redux';
import { fetchPaymentMethods } from 'reducers/paymentMethods';
import { resetRedirectData } from 'reducers/vgs';
import handleLogEvent from 'utils/handleLogEvent';
import KeyboardAvoidingView from 'components/KeyBoardAvoidingView';
import VisaLogo from 'assets/visaLogo';
import MasterCardLogo from 'assets/masterCardLogo';
import { getConsumerSpendLimit } from 'api';
import 'moment/locale/ar';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import commonStyles from 'utils/commonStyles';
import VgsPaymentForm from 'components/VgsPaymentForm';
import PendingModal from './pendingModal';
import styles from './styles';
import Timeline from '../../components/Timeline';
import TileSelector from '../../components/TileSelector';
import AddNew from '../../../assets/addNew';

const PaymentForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const currLang = useSelector(state => state.language.language);
  const {
    merchantScanData,
    estimations,
    selectedPlan,
    selectedPaymentMethod,
    isMerchantInfoRequestLoading,
    isMerchantInfoPosted,
    merchantInfo,
    isRequestLoading,
    currentDraftStatus: draftStatus,
    isEstimationsResolved,
  } = useSelector(state => state.scanner);

  const appState = useSelector(state => state.application);
  const fieldData = preFillFields(appState);
  const { currentUserScore } = useSelector(state => state.application);

  const {
    consumerSpendLimitCeiling,
  } = currentUserScore;

  const [amount, setCurrAmount] = useState(null);
  const amountPlaceHolder = 100;
  const [amountError, setAmountError] = useState(false);
  const [popOverVisible, setPopOverVisible] = useState(false);
  const [amountErrorMessage, setAmountErrorMessage] = useState(false);
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
  const [displayPaymentMethod, setDisplayPaymentMethod] = useState(<Text>{t('common.selectCard')}</Text>);
  const [pendingModalVisible, setPendingModalVisible] = useState(false);
  const [consumerSpendLimit, setConsumerSpendLimit] = useState(false);
  const [consumerSpendLimitResolved, setConsumerSpendLimitResolved] = useState(false);
  const { currentUser } = useSelector(state => state.application);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredEstimates, setFilteredEstimates] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [isPayNowSelected, setIsPayNowSelected] = useState(false);
  const [addCardVisible, setAddCardVisible] = useState(false);
  const [showVgsPaymentForm, setShowVgsPaymentForm] = useState(false);
  const [newCardAttempt, setNewCardAttempt] = useState(false);
  const [defaultPMIndex, setDefaultPMIndex] = useState(0);
  const [cvvOnly, setCvvOnly] = useState(false);

  const isRTL = currLang === 'ar';

  const paymentMethods = useSelector(state => state.paymentMethods);

  const cards = paymentMethods.list.filter(pm => pm.pmType === PAYMENT_TYPES.PAYTABS_2 || pm.pmType === PAYMENT_TYPES.HYPER_PAY);

  const listData = cards.map(method => ({
    title: <Text style={{ paddingHorizontal: 14 }}>{`﹡﹡﹡﹡${method.number ? method.number.slice(-4) : ''}`}</Text>,
    item: method,
  }));

  listData.push({
    title: <Text style={{ fontSize: 14 }}>{t('common.addNewCard')}</Text>,
    newCard: true,
  });

  const backAction = () => {
    if (isEstimationsResolved) {
      dispatch(resetOrderEstimations());
      return true;
    }
    dispatch(reset());
    navigation.navigate('ScannerCamera');
    return true;
  };

  useEffect(() => {
    dispatch(resetRedirectData());
    dispatch(resetOrderEstimations());
  }, []);

  useEffect(() => {
    const trigger = async () => {
      await handleLogEvent('SpotiiMobileQRCodeScanned', {
        email: currentUser.email,
      });
    };
    if (currentUser.email) {
      trigger();
    }
  }, [currentUser.email]);

  useEffect(() => {
    const retrieveConsumerSpendLimit = async () => {
      try {
        const resp = await getConsumerSpendLimit(merchantScanData.id, merchantScanData.currency, currentUser.userId, merchantScanData.employeeId);
        setConsumerSpendLimit(resp.consumer_spend_limit);
        setConsumerSpendLimitResolved(true);
        if (resp && (resp.reason || parseFloat(resp.consumer_spend_limit) <= 0)) {
          dispatch(setPseudoDraftError(resp.reason ? resp.reason : BLOCKING_CODES.SAL_RQD));
          navigation.navigate('OrderDeclined');
          return;
        }
      } catch (e) {
        console.error(e);
      }
    };

    // Detect Back button pressed on android phone and clear state accordingly
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    if (merchantScanData && merchantScanData.currency) {
      dispatch(requestDraftPlans(merchantScanData.currency));
    }

    if (merchantScanData && merchantScanData.id) {
      dispatch(requestMerchantInfo(merchantScanData.id));
      retrieveConsumerSpendLimit(merchantScanData);
    }

    dispatch(fetchPaymentMethods('checkout'));

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    if (merchantInfo) {
      const acceptedInStoreEstimations = [];
      if (merchantInfo.plans.length && estimations) {
        const allMerchantPlans = merchantInfo.plan_dictionary.filter(dictionaryPlan => merchantInfo.plans.includes(dictionaryPlan.plan_id));
        allMerchantPlans.forEach(plan => {
          const { plan_id } = plan;
          estimations.forEach(estimate => {
            if (estimate.id === plan_id) {
              acceptedInStoreEstimations.push(estimate);
            }
          });
        });
      } else if (estimations) {
        const temp = merchantInfo.plan_dictionary.filter(plan => plan.slug === PLAN_SLUGS.MONTHLY);
        temp.forEach(plan => {
          const { plan_id } = plan;
          estimations.forEach(estimate => {
            if (estimate.id === plan_id) {
              acceptedInStoreEstimations.push(estimate);
            }
          });
        });
      }

      if (acceptedInStoreEstimations.length > 0) {
        const defaultPlan =
          acceptedInStoreEstimations.find(({ slug }) => [PLAN_SLUGS.MONTHLY_3, PLAN_SLUGS.BI_WEEKLY].includes(slug)) ||
          acceptedInStoreEstimations.find(({ slug }) => !ZERO_DOWN_PLANS.includes(slug)) ||
          acceptedInStoreEstimations[0];

        const orderedEstimations = [
          acceptedInStoreEstimations.find(estimation => estimation.id === defaultPlan.id),
          ...acceptedInStoreEstimations.filter(estimation => estimation.id !== defaultPlan.id),
        ];

        setFilteredEstimates(orderedEstimations);
      }
    }
  }, [merchantInfo, estimations]);

  useEffect(() => {
    if (paymentMethods && paymentMethods.isResolved && listData.length) {
      const defaultMethod = paymentMethods.list.find(method => method.isDefault);
      let defaultMethodIndex = cards.findIndex(method => method.isDefault);
      if (!defaultMethodIndex || defaultMethodIndex === -1) {
        defaultMethodIndex = 0;
      }

      if (cards.length > 0) {
        handlePaymentMethodSelect(cards[defaultMethodIndex]);
      }

      setDefaultPMIndex(defaultMethodIndex);

      setDisplayPaymentMethod(renderListItemTest(listData[defaultMethodIndex], defaultMethodIndex, true));
    }
  }, [paymentMethods]);

  useEffect(() => {
    if (filteredEstimates) {
      handlePlanSelect(0);
    }
  }, [filteredEstimates]);

  useEffect(() => {
    if (filteredEstimates) {
      const usedEstimation = filteredEstimates.find(({ id: planId }) => selectedPlanId === planId) || filteredEstimates[0];
      setPaymentAmount(usedEstimation.payments[0].amount);
    }
  }, [selectedPlanId, filteredEstimates]);

  const handlePaymentMethodSelect = method => {
    if (!method) {
      setSelectedPaymentMethodId(null);
      setCvvOnly(false);
      return setNewCardAttempt(true);
    }
    setCvvOnly(!method.autoDebit);
    setNewCardAttempt(false);
    setSelectedPaymentMethodId(method.id);
    dispatch(selectPaymentMethod(method.id));
  };

  const renderListItemIcon = (props, item) => {
    if (item.type) {
      let logo = <Text category="s2">{item.type.slice(0, 1).toUpperCase() + item.type.slice(1)}</Text>;
      if (item.type === 'visa') {
        logo = <VisaLogo />;
      }
      if (item.type === 'mastercard') {
        logo = <MasterCardLogo />;
      }
      return (
        <View style={styles.cardLogo}>
          {logo}
        </View>

      );
    }
    return null;
  };

  const renderListItemTest = (item, index, isDisplay = false) => {
    if (!item || !item.item) {
      return <></>;
    }
    let style = styles.paymentInactive;
    if (item.item.id === selectedPaymentMethodId) {
      style = styles.paymentActive;
    }
    if (isDisplay) {
      style = styles.paymentDisplay;
    }
    return (
      <SelectItem
        key={item.title}
        title={item.title}
        style={style}
        accessoryLeft={props => renderListItemIcon(props, item.item)}
      />
    );
  };

  const handlePlanSelect = index => {
    setSelectedPlanIndex(index);
    setSelectedPlanId(filteredEstimates[index].id);
    dispatch(selectPlan(filteredEstimates[index].id));

    setIsPayNowSelected(filteredEstimates[index].slug === PLAN_SLUGS.PAY_NOW);
  };

  const renderPlanSelectHeader = (item, _, isExpanded) => {
    const { userFeeDetails } = item;
    const { hasUserFee } = userFeeDetails || {};
    const hasPlansWithFee = estimations.find(
      ({ userFeeDetails: estimate }) => estimate.hasUserFee,
    );

    const currentPlan = filteredEstimates.find(({ id: planId }) => item.id === planId);
    const phaseCount = currentPlan.payments.length;

    if ((filteredEstimates || []).length === 1) {
      return (
        <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { alignItems: 'center', marginBottom: '5%' }]}>
          <View>
            <Text
              style={[styles.tipsHeaderTextSinglePlan, { textAlign: isRTL ? 'right' : 'left' }]}
              category="p1"
            >
              {t('common.noInterestNoFee')}
            </Text>
            <Text style={[styles.tipsHeaderSubTextSinglePlan, { textAlign: isRTL ? 'right' : 'left' }]}>
              {t('common.payUsingAnyCard')}
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={[isExpanded ? styles.accordionHeaderContainerSelected : styles.accordionHeaderContainer, { justifyContent: 'space-between' }]}>
        {/* {!isExpanded && item.id === filteredEstimates[0].id ? (
          <View
            style={{
              position: 'absolute',
              right: 1,
              top: 0,
              elevation: 5,
              backgroundColor: '#EDE6FF',
              paddingHorizontal: 12,
              paddingVertical: 4,
              borderTopRightRadius: 5,
              borderBottomLeftRadius: 5,
            }}
          >
            <Text style={{ color: '#411361', fontSize: 12, fontWeight: '400' }}>{t('common.mostPopular')}</Text>
          </View>
        ) : (
          <></>
        )} */}

        <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { flex: 1, alignItems: 'center' }]}>
          <View style={[styles.accordionSelectOuter, { borderColor: isExpanded ? '#AA8FFF' : '#717171' }]}>
            <View style={[styles.accordionSelectInner, { backgroundColor: isExpanded ? '#AA8FFF' : '#FFFFFF' }]} />
          </View>
          <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { flex: 1 }]}>
            <View>
              <Text
                style={[styles.tipsHeaderText, { textAlign: isRTL ? 'right' : 'left' }]}
                category="p1"
              >
                {currentPlan.slug === PLAN_SLUGS.PAY_NOW ? t('common.payNow') : t('common.payInXPeriod', { numUnits: phaseCount, period: t('common.months') })}
              </Text>
              <Text style={[styles.tipsHeaderSubText, { textAlign: isRTL ? 'right' : 'left' }]}>
                {isExpanded
                  ? t('common.payUsingAnyCard') : t('common.dueToday', {
                    amount: formatCurrency(
                      item.currency,
                      item.payments[0].amount,
                    ),
                  }) }
              </Text>
            </View>
            {!isExpanded && hasPlansWithFee ? (
              <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { flex: 1, justifyContent: 'flex-end', alignItems: 'center' }]}>
                <Text style={[styles.tipsHeaderSubTextSinglePlan, { textAlign: isRTL ? 'right' : 'left' }]}>
                  {t(hasUserFee ? 'common.inclFee' : 'common.noFee')}
                </Text>
              </View>
            ) : (
              <></>
            )}
          </View>
        </View>
      </View>
    );
  };

  const renderPlanSelectBody = (item, _, __) => (
    <View style={(filteredEstimates || []).length > 1 ? styles.accordionBody : {}}>
      <Timeline
        userFeeDetails={item.userFeeDetails}
        payments={item.payments}
        total={item.total}
        slug={item.id}
        currency={item.currency}
        payNowPlan={isPayNowSelected}
      />
    </View>
  );

  const renderNewCardSelectHeader = (item, _, isExpanded) => {
    return (
      <View style={isExpanded ? styles.accordionHeaderContainerSelected : styles.accordionHeaderContainer}>
        <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { alignItems: 'center', width: '100%' }]}>
          {!isExpanded ? (
            <View style={styles.accordionSelectPlus}>
              <AddNew />
            </View>
          )
            : (
              <View style={[styles.accordionSelectOuter, { borderColor: isExpanded ? '#AA8FFF' : '#717171' }]}>
                <View style={[styles.accordionSelectInner, { backgroundColor: isExpanded ? '#AA8FFF' : '#FFFFFF' }]} />
              </View>
            )}
          <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, styles.pmContainer, { justifyContent: 'space-between' }]}>
            {item.title}
            <View style={styles.processorLogoContainer}>
              <View style={styles.processorLogo}>
                <VisaLogo />
              </View>
              <View style={styles.processorLogo}>
                <MasterCardLogo />
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderNewCardSelectBody = (_, __, ___) => (
    <Layout level="1" style={styles.accordionBodyNoPadding}>
      <View style={styles.accordionHeaderDivider} />
      <VgsPaymentForm
        handleBack={(shouldApplyDelay = false) => {
          delay(shouldApplyDelay ? 3000 : 0).then(() => {
            dispatch(resetRedirectData());
            dispatch(fetchPaymentMethods('checkout'));
            dispatch(selectPaymentMethod(null));
            setAddCardVisible(false);
            setShowVgsPaymentForm(false);
            setDefaultPMIndex(-1);
            setNewCardAttempt(false);
          });
        }}
        navigation={navigation}
        showHeader={false}
      />
    </Layout>
  );

  const renderAddCVVBody = (_, __, ___) => (cvvOnly ? (
    <Layout level="1" style={styles.accordionBodyNoPadding}>
      <View style={styles.accordionHeaderDividerCVV} />
      <VgsPaymentForm
        handleBack={(shouldApplyDelay = false) => {
          delay(shouldApplyDelay ? 3000 : 0).then(() => {
            dispatch(resetRedirectData());
            dispatch(fetchPaymentMethods('checkout'));
            dispatch(selectPaymentMethod(null));
            setAddCardVisible(false);
            setShowVgsPaymentForm(false);
            setDefaultPMIndex(-1);
            setCvvOnly(false);
          });
        }}
        showHeader={false}
        cvvOnly={cvvOnly}
        paymentMethodId={selectedPaymentMethodId}
      />
    </Layout>
  ) : <></>);

  const renderPaymentMethodSelectHeader = (item, _, __) => {
    if (item.newCard) {
      return renderNewCardSelectHeader(item, _, __);
    }
    const isSelected = item.item && item.item.id === selectedPaymentMethodId;
    return (
      <View style={isSelected ? styles.headerContainerSelectedFullBorder : styles.accordionHeaderContainer}>
        <View style={[isRTL ? styles.flexRowReverse : styles.flexRow, { alignItems: 'center', width: '100%' }]}>
          <View style={[styles.accordionSelectOuter, { borderColor: isSelected ? '#AA8FFF' : '#CCCCCC' }]}>
            <View style={[styles.accordionSelectInner, { backgroundColor: isSelected ? '#AA8FFF' : '#FFFFFF' }]} />
          </View>
          <View style={[styles.flexRow, styles.pmContainer]}>
            {renderListItemIcon(null, item.item)}
            {item.title}
          </View>
        </View>
      </View>

    );
  };

  const renderPaymentMethodSelectBody = (item, __, ___) => {
    if (item.newCard) {
      return renderNewCardSelectBody(item, __, ___);
    }
    if (item.item && !item.item.autoDebit) {
      return renderAddCVVBody(item, __, ___);
    }
    return <></>;
  };

  const handleAmountChange = async (val, planId) => {
    const schema = Yup.object().shape({
      amount: Yup.number().required(),
    });

    const amountValid = await schema.isValid({ amount: val });
    setCurrAmount(val);
    setAmountError(!amountValid);
    setAmountErrorMessage(t('errors.enterValidAmount'));

    let minAmount = merchantInfo && merchantInfo.order_min_amount ? Math.ceil(merchantInfo.order_min_amount) : 200;

    if (merchantInfo.plan_rates.length) {
      let currentPlanRate = null;

      for (let i = 0; i < merchantInfo.plan_rates.length; i += 1) {
        for (let j = 0; j < merchantInfo.plan_rates[i].plans.length; j += 1) {
          if (planId === merchantInfo.plan_rates[i].plans[j]) {
            currentPlanRate = merchantInfo.plan_rates[i];
          }
        }
      }

      if (currentPlanRate) {
        minAmount = currentPlanRate.order_min_amount;
      }
    }

    if (amountValid && val < minAmount) {
      setAmountError(true);
      dispatch(resetOrderEstimations());
      setAmountErrorMessage(t('errors.min200Required', { amount: minAmount, currency: merchantInfo.currency }));
    } else {
      dispatch(fetchOrderEstimations(val, merchantInfo.currency, merchantScanData.id, currentUser.userId));
    }
  };

  const buildPt2RequestPayload = () => {
    const baseURl = config('PUBLIC_API_BASE_URL');
    // const { currency, amount } = amountCurrencyFromState(appState, selectedPlan);
    return {
      tran_type: 'auth',
      tran_class: 'ecom',
      cart_description: `ord-qr|checkout-id-place-holder|${currentUser.userId}`,
      cart_currency: merchantScanData.currency,
      cart_amount: Math.floor((amount / 4) * 100) / 100,
      cart_id: `${currentUser.userId}`,
      customer_details: {
        name: `${fieldData.firstName} ${fieldData.lastName}`,
        email: currentUser.email || fieldData.email || 'spotiiunspecified@spotii.me',
        phone: fieldData.phone || '111111111', // Phone and email are hidden, yet mandatory
        street1: 'Spotii address',
        city: 'Dubai',
        state: 'du',
        country: 'AE',
        zip: '12345',
      },
      show_save_card: false,
      callback: `${baseURl}/${config('PAYTABS_CALLBACK_PATH')}`,
      return: `${baseURl}/${config('PAYTABS_REDIRECT_PATH')}?to=loader`,
      hide_shipping: true,
      framed: true,
      framed_return_parent: true,
    };
  };

  const handleSubmit = (noCard = false) => {
    setIsLoading(true);
    try {
      const data = {
        plan: selectedPlanId,
        amount,
        consumer: currentUser.userId,
        currency: merchantScanData.currency,
        merchant: merchantScanData.id,
        employee: merchantScanData.employeeId,
      };
      if (noCard) { // Saudi client, continue with different card clicked, do not show vgs for now
        dispatch(setIsNoCard(true));
        data.pt2_request = buildPt2RequestPayload();
      } else {
        data.payment_method_id = selectedPaymentMethodId;
      }

      dispatch(createDraftCheckout(data));
      setIsLoading(false);
      setPendingModalVisible(true);
    } catch (err) {
      console.error('error', err);
      setIsLoading(false);
    }
  };

  const spendLimitPromotion = () => {
    if (parseFloat(consumerSpendLimit) > 0 && merchantScanData && merchantScanData.currency) {
      return (
        <View style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '4%',
        }}
        >
          {currLang !== 'ar' ? (
            <Text
              category="p1"
              style={{
                fontSize: 12, fontWeight: '400', lineHeight: 15, color: '#353535',
              }}
            >
              {`${t('common.limit')}: ${merchantScanData.currency}  ${consumerSpendLimit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
            </Text>
          ) : <></>}
          <Popover
            visible={popOverVisible}
            placement={isRTL ? 'bottom start' : 'bottom end'}
            anchor={() => (
              <View>
                <TouchableOpacity
                  onPress={() => setPopOverVisible(true)}
                >
                  {Icon({
                    fill: '#AA8FFF', width: 25, height: 25,
                  }, 'info-outline')}
                </TouchableOpacity>
              </View>
            )}
            onBackdropPress={() => setPopOverVisible(false)}
          >
            <Card style={styles.popOverContent}>
              <Text style={isRTL ? styles.popOverContentTextAr : styles.popOverContentTextEn}>
                {t(parseFloat(consumerSpendLimit) <= parseFloat(consumerSpendLimitCeiling) ? 'common.spendLimitDesc' : 'common.spendLimitPromotionDesc', {
                  amount: consumerSpendLimit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ','),
                  merchant: merchantInfo.display_name,
                  currency: merchantScanData.currency,
                })}
                {' '}
                {parseFloat(consumerSpendLimit) <= parseFloat(consumerSpendLimitCeiling)
                  ? (
                    <Text style={{
                      flexWrap: 'wrap', textAlign: isRTL ? 'right' : 'left', fontSize: 18,
                    }}
                    >
                      <Text
                        style={[isRTL ? styles.popOverContentTextAr : styles.popOverContentTextEn, { textDecorationLine: 'underline' }]}
                        onPress={() => {
                          setPopOverVisible(false);
                          navigation.navigate('Account');
                        }}
                        category="p1"
                      >
                        {t('common.linkingBankLink')}
                      </Text>
                      {' '}
                      <Text
                        style={isRTL ? styles.popOverContentTextAr : styles.popOverContentTextEn}
                        category="p1"
                      >
                        {t('common.spendLimitDesc2')}
                      </Text>
                    </Text>
                  ) : null}
              </Text>
            </Card>
          </Popover>

          {isRTL ? (
            <Text
              category="p1"
              style={{
                fontSize: 12, fontWeight: '400', lineHeight: 15, color: '#353535',
              }}
            >
              {`${t('common.limit')}: ${merchantScanData.currency}  ${consumerSpendLimit.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`}
            </Text>
          ) : <></>}
        </View>
      );
    }

    if (consumerSpendLimitResolved) {
      return (
        <View style={{ marginTop: '3%', marginBottom: '5%' }}>
          <Text style={{ textAlign: isRTL ? 'right' : 'left', color: '#AA8FFF', fontSize: 14 }} category="p1">
            {t('common.spendLimitDescUpload')}
            {' '}
            <Text
              style={{
                textAlign: isRTL ? 'right' : 'left', color: '#AA8FFF', textDecorationLine: 'underline', fontSize: 14,
              }}
              onPress={() => navigation.navigate('Account')}
              category="p1"
            >
              {t('common.linkBankLink')}
            </Text>
            {' '}
            <Text
              style={{
                textAlign: isRTL ? 'right' : 'left', color: '#AA8FFF', fontSize: 14,
              }}
              category="p1"
            >
              {t('common.spendLimitDescUpload2')}
            </Text>
          </Text>
        </View>
      );
    }
  };

  const merchantName = (merchantInfo && merchantInfo.display_name) || '';
  const empName = merchantName && merchantScanData && merchantScanData.employeeName ? merchantScanData.employeeName : '';

  return (
    <>
      <Layout style={styles.layout} level="2">
        <KeyboardAvoidingView>
          <View style={styles.card}>
            {isMerchantInfoPosted && !isMerchantInfoRequestLoading ? (
              <View style={styles.mainView}>
                <View>
                  <View style={styles.paymentFormHeader}>
                    <View
                      style={{ width: '5%', paddingBottom: 1 }}
                    >
                      <Button
                        onPress={backAction}
                        appearance="ghost"
                        size="small"
                      >
                        {Icon(
                          {
                            fill: '#353535',
                            width: 25,
                            height: 20,
                          },
                          'arrow-back-outline',
                        )}
                      </Button>
                    </View>
                    <View style={{ width: '95%',
                    }}
                    >
                      <Text style={styles.displayNameHeading}>{merchantName}</Text>
                      {empName ? <Text style={styles.displayNameSubHeading}>{empName}</Text> : <></>}
                    </View>
                  </View>
                  {/* <Divider style={{ backgroundColor: '#C4C4C4' }} /> */}
                  {!isEstimationsResolved ? (
                    <View style={{ backgroundColor: 'white', paddingHorizontal: '3%' }}>
                      {spendLimitPromotion()}
                      <View style={{ marginTop: '3%' }}>
                        <Text style={{ textAlign: isRTL ? 'right' : 'left', fontSize: 14, color: '#1A0826', paddingBottom: 4 }}>{`${t('common.totalAmount')} ${merchantScanData.currency}`}</Text>
                        <Input
                          size="large"
                          placeholder={t('common.pleaseEnterPurchaseAmt')}
                          value={amount}
                          onChangeText={val => setCurrAmount(val)}
                          caption={() => (amountError ? <Text appearance="hint" style={{ textAlign: isRTL ? 'right' : 'left' }} category="c1">{amountErrorMessage}</Text> : <></>)}
                          keyboardType="numeric"
                          textAlign={isRTL ? 'right' : 'left'}
                          textStyle={{
                            paddingHorizontal: 10, fontSize: 14, fontWeight: '600', lineHeight: 17.5, color: '#1A0826', textAlign: isRTL ? 'right' : 'left',
                          }}
                          style={{ backgroundColor: 'white', borderColor: '#CCCCCC', borderWidth: 1 }}
                        />
                      </View>
                      <Button
                        size="large"
                        disabled={!amount}
                        style={{ marginTop: '10%' }}
                        onPress={() => handleAmountChange(amount, selectedPlanId)}
                        accessoryRight={props => (isLoading ? <Spinner status="control" /> : <></>)}
                      >
                        <Text style={{
                          textAlign: 'center', fontWeight: '700', lineHeight: 17.5, fontSize: 20,
                        }}
                        >
                          {t('common.continueToPay')}
                        </Text>
                      </Button>

                    </View>
                  ) : <></>}
                </View>
                {isEstimationsResolved ? (
                  <View>
                    <View style={[styles.planSelectionContainer, { paddingHorizontal: '3%' }]}>
                      {!isRequestLoading && filteredEstimates ? (
                        <View>
                          {(filteredEstimates || []).length !== 1 ? <Text style={{ paddingTop: 12, paddingBottom: 3, textAlign: isRTL ? 'right' : 'left' }}>{t('common.selectPaymentPlan')}</Text> : <></>}
                          <TileSelector
                            list={filteredEstimates}
                            renderHeader={renderPlanSelectHeader}
                            renderBody={renderPlanSelectBody}
                            onToggle={(_, index, __) => handlePlanSelect(index)}
                            isDisabled={(item, _) => item.id === selectedPlanId}
                            itemKey={item => `${item.id}`}
                          />
                        </View>
                      ) : (
                        <View style={{ marginTop: '2%' }}>
                          <Spinner />
                        </View>
                      )}
                    </View>
                    <View style={styles.paymentOptionListContainer}>
                      <View style={styles.cardSelection}>
                        <Text style={[commonStyles.subTextColor, {
                          textAlign: isRTL ? 'right' : 'left', marginBottom: '2%', fontWeight: '400', fontSize: 16, lineHeight: 20, color: '#1A0826',
                        }]}
                        >
                          {t('common.selectPaymentMethod')}
                        </Text>
                        {listData.length ? (
                          <TileSelector
                            list={listData}
                            renderHeader={renderPaymentMethodSelectHeader}
                            renderBody={renderPaymentMethodSelectBody}
                            onToggle={(_, index, __) => handlePaymentMethodSelect(listData[index].item)}
                            defaultIndex={defaultPMIndex}
                            isDisabled={(item, _) => (item.newCard && newCardAttempt && listData.length > 1) || (item.item && item.item.id === selectedPaymentMethodId)}
                            itemKey={item => `${item.newCard ? 'new-card-form' : item.item.id}`}
                          />
                        ) : <View />}
                      </View>
                    </View>
                  </View>
                ) : <></>}
              </View>
            ) : (
              <View style={[styles.center, { marginTop: '50%' }]}>
                <Spinner size="giant" />
              </View>
            )}
          </View>

          <PendingModal
            visible={pendingModalVisible}
            setVisible={setPendingModalVisible}
            navigation={navigation}
            merchantScanData={merchantScanData}
            addCardVisible={addCardVisible}
            setAddCardVisible={setAddCardVisible}
            status={draftStatus}
          />
          {isEstimationsResolved && selectedPaymentMethodId && !cvvOnly
            ? (
              <View style={styles.BottomSubmitActions}>
                <Button
                  size="large"
                  disabled={!selectedPaymentMethodId || !selectedPlanId || !cards.length || isLoading || !amount || amountError}
                  onPress={() => handleSubmit()}
                  accessoryRight={props => (isLoading ? <Spinner status="control" /> : null)}
                >
                  {`${t('common.payNow')} ${merchantScanData && merchantScanData.currency ? formatCurrency(merchantScanData.currency, paymentAmount) : ''}`}
                </Button>
                {merchantScanData && filteredEstimates && filteredEstimates[selectedPlanIndex] && filteredEstimates[selectedPlanIndex].currency !== 'AED' && filteredEstimates[selectedPlanIndex].firstInstallmentAmountAed
                  ? (
                    <View style={{ marginTop: '3%' }}>
                      <Text category="s2">
                        {t('common.differentCurrencyNote', {
                          amount: formatCurrency(
                            'AED',
                            filteredEstimates[selectedPlanIndex].firstInstallmentAmountAed,
                            // merchantScanData.currency,
                            // paymentAmount,
                            // true,
                          ),
                        }) }
                      </Text>
                    </View>
                  ) : <></>}
              </View>
            ) : <></>}
        </KeyboardAvoidingView>
      </Layout>
    </>
  );
};

PaymentForm.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    goBack: PropTypes.func,
  }),
};

PaymentForm.defaultProps = {
  navigation: null,
};

export default PaymentForm;
