/* eslint-disable no-nested-ternary */
/* eslint-disable indent */
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, View, StatusBar } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useDispatch, useSelector } from 'react-redux';

import { Spinner } from '@ui-kitten/components';
import { WebView } from 'react-native-webview';
import config from 'utils/config';
import PropTypes from 'prop-types';
import authApi from 'api/auth';
import { confirmVgsURL, addCardVgsURL, payPendingVgsURL } from 'api';
import request from 'api/request';
import preFillFields from 'utils/preFillFields';
import { fetchOrderDetails, setCheckoutAttempted } from 'reducers/scanner';
import {
  updateCheckoutWithCardAddResponse,
  CHECKOUT_STATUS_APPROVED,
  CHECKOUT_STATUS_CARD_ATTACHED,
  CHECKOUT_STATUS_SUBMITTED,
  requestConfirmOrderFail,
  requestConfirmOrderSuccess,
} from 'reducers/checkout';
import { resetRedirectData, setRedirectData } from 'reducers/vgs';
import { t } from 'services/i18n';
import styles from './styles';

const VgsPaymentForm = ({
  amountStr, // when amountStr is empty, we are adding card not paying
  navigation,
  handleBack,
  showHeader,
  cvvOnly,
  paymentMethodId,
}) => {
  const dispatch = useDispatch();
  const appState = useSelector((state) => state.application);
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const { selectedPlan, checkoutToken, order } = useSelector((state) => state.scanner);
  // paymentVerificationUrl is for async vgs flow (otp flow)
  const { redirectUrl: paymentVerificationUrl } = useSelector((state) => state.checkout);

  const { redirectData, isResolved, installmentData } = useSelector((state) => state.vgs);
  const { redirect_url: addCardVerificationUrl, transaction_id: transactionId } = redirectData || {};

  const fieldData = preFillFields(appState);
  const { orderId } = order || {};

  const baseURl = config('public_api_base_url');
  const vaultId = config('vgs_vault_id');
  const environment = config('vgs_environment');

  const [prevRejectionLength, setPrevRejectionLength] = useState(-1);

  const VGSCollectFormHTMl = useCallback(
    (authToken) => `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Enter card details</title>

        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

        <!--Replace with generated for your organization JS file.-->
        <script type="text/javascript" src="https://js.verygoodvault.com/vgs-collect/2.12.0/vgs-collect.js"></script>

        <style>
          body {
            padding: 0 ${showHeader ? '20' : '5'}px;
          }

          span[id*="cc-"] {
            display: block;
            height: 40px;
          }

          span[id*="cc-"] iframe {
            height: 100%;
            width: 100%;
          }

          pre {
            font-size: 12px;
          }

          label {
            font-size: .75rem;
            font-weight: 500;
            color: #1A0826;
            padding: 0 5px;
            margin: 0;
          }

          button {
            border-radius: 10px !important;
            background-color: #411361 !important;
            border-color: #411361 !important;
            line-height: 1.5 !important;
            padding: .6rem !important;
            margin-top: ${showHeader ? '2' : '0.5'}rem !important;
            font-weight: 700 !important;
          }

          .card {
            margin: 0;
            padding: 0;
            border-radius: 14px;
            background: #fff !important;
          }

          .card-header-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .header {
            font-size: 22px;
            font-weight: 700;
            margin: 4px;
            margin-top: 12px;
          }

          .sub-header {
            font-size: 18px;
            text-align: center;
            margin: 4px;
            color: #353535;
          }

          .margin-bottom-point5 {
            margin-bottom: 0.5rem;
          }

          .form-card-class {
            padding-left: 14px;
            padding-right: 14px;
            margin-top: ${showHeader ? '32' : '0'}px;
            border-radius: 14px;
            border: ${showHeader ? '1' : '0'}px solid #ccc;
          }

          .form-field {
            display: block;
            width: 100%;
            height: calc(2.25rem + 2px);
            padding: .375rem .75rem;
            font-size: 1rem;
            line-height: 1.5;
            color: #495057;
            background: #F9F9F9;
            background-color: #F9F9F9;
            border-radius: ${cvvOnly ? '4' : '14'}px;
          }

          .form-field iframe {
            border: 0 none transparent;
            height: 100%;
            vertical-align: middle;
            width: 100%;
          }

          p {
            margin-bottom: 10px;
          }

          .d-flex {
            display: flex;
          }

          .flex-2 {
            flex: 2;
          }

          .flex-5 {
            flex: 5;
          }

          .flex-point2 {
            flex: 0.2;
          }

          .field-error {
            font-size: .6rem;
            font-weight: 500;
            color: #FF4D4A;
            padding: 0 5px;
            margin: 0;
            display: none;
          }

          #loading-icon {
            display: none;
          }

          .margin-top-point5 {
            margin-top: 0.5rem;
          }

          .arabic-direction {
            direction: rtl;
          }

          .arabic-alignment {
            text-align: right;
          }

          .full-width {
            width: 100%;
          }

          .cvv-only {
            display: flex;
            flex-direction: row${isRTL ? '-reverse' : ''};
            align-items: center;
          }

          .missing-card-cvv {
            font-size: 0.8rem;
            color: #717171;
          }
        </style>
      </head>

      <body>
        <main>
          <div class="row">
            <div class="card border-0 bg-light card-outline-secondary full-width">
              <div class="card-body">
                ${showHeader ? `<div class="card-header-container">
                  <span class="header">${amountStr ? t('common.enterCardDetails') : t('common.addCardDetails')}</span>
                  <span class="sub-header">${t('common.cardsWeAccept')}</span>
                </div>` : ''}

                <form id="cc-form">
                  <div class="form-card-class">

                    ${!cvvOnly ? `<div class="form-group margin-bottom-point5 margin-top-point5">
                      <label for="cc-number" class="${isRTL ? ' arabic-direction arabic-alignment full-width' : ''}">${t('common.cardNumber')}</label>
                      <span id="cc-number" class="form-field">
                        <!--VGS Collect iframe for card number field will be here!-->
                      </span>
                      <span id="number-error" class="field-error${isRTL ? ' arabic-direction arabic-alignment' : ''}">${t('errors.cardIsNotValid')}</span>
                    </div>` : ''}

                    <div class="d-flex margin-top-point5">
                      ${!cvvOnly ? `
                        <div class="flex-2 form-group">
                          <label for="cc-expiration-date" class="${isRTL ? ' arabic-direction arabic-alignment full-width' : ''}">${t('common.expiration')}</label>
                          <span id="cc-expiration-date" class="form-field">
                            <!--VGS Collect iframe for expiration date field will be here!-->
                          </span>
                          <span id="expiration-date-error" class="field-error${isRTL ? ' arabic-direction arabic-alignment' : ''}">${t('errors.cardExpiryInvalid')}</span>
                        </div>

                        <div class="flex-point2"></div>

                        <div class="flex-2 form-group">
                          <label for="cc-cvc">CVC/CVV</label>
                          <span id="cc-cvc" class="form-field">
                            <!--VGS Collect iframe for CVC field will be here!-->
                          </span>
                          <span id="cvc-error" class="field-error${isRTL ? ' arabic-direction arabic-alignment' : ''}">${t('errors.cardCVVInvalid')}</span>
                        </div>
                      ` : `
                        <div class="flex-2 form-group cvv-only">
                          <label class="flex-5 missing-card-cvv ${isRTL ? ' arabic-direction arabic-alignment' : ''}" for="cc-cvc">${t('common.missingCardCVV')}</label>
                          <span id="cc-cvc" class="form-field flex-2">
                            <!--VGS Collect iframe for CVC field will be here!-->
                          </span>
                          <span id="cvc-error" class="field-error${isRTL ? ' arabic-direction arabic-alignment' : ''}">${t('errors.cardCVVInvalid')}</span>
                        </div>
                      `}

                    </div>
                  </div>

                  <!-- <span id="logger"></span> -->

                  <!--Submit credit card form button-->
                  <button id="submit-button" type="submit" class="btn btn-success btn-block ${isRTL ? ' arabic-direction' : ''}">
                    <i id="loading-icon" class="fa fa-circle-o-notch fa-spin"></i>
                    ${amountStr === '' ? `${Object.keys(installmentData).length ? t('common.payAmount', { amount: installmentData.amount }) : t('common.addCard')}` : t('common.payAmount', { amount: amountStr })}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <!--Include script with VGS Collect form initialization-->
        <script>
          // document.getElementById('logger').innerHTML = 'init';

          const css = {
            'font-size': '16px',
            'color': '#717171',
            'font-family': '"LexendDeca", sans-serif',
            '&::placeholder': {
              'color': '#717171',
              'letter-spacing': 0,
            },
            'box-shadow': 'none',
            'outline': '0px solid transparent',
            'background-color': '#F9F9F9',
          };

          if (${cvvOnly}) {
            css['color'] = '#1A0826';
            css['font-size'] = '18px';
            css['font-weight'] = '600';
            css['text-align'] = 'center';
            css['letter-spacing'] = '0.28em';
            css['&::placeholder']['font-weight'] = '500';
          }

          // VGS Collect form initialization
          const form = VGSCollect.create('${vaultId}', '${environment}', function (state) { });

          // Create VGS Collect field for credit card number
          if (${!cvvOnly}) {
            form.field('#cc-number', {
              name: 'card_number',
              type: 'card-number',
              title: 'Card Number',
              placeholder: '0000 0000 0000 0000',
              validations: ['required', 'validCardNumber'],
              showCardIcon: {
                border: '0px solid black',
                outline: '0px solid black',
              },
              autoComplete: 'cc-number',
              css,
            });
  
            // Create VGS Collect field for credit card expiration date
            form.field('#cc-expiration-date', {
              name: 'card_expiration_date',
              type: 'card-expiration-date',
              title: 'Expiry',
              placeholder: 'MM/YYYY',
              serializers: [{ name: 'separate', options: { monthName: 'month', yearName: 'year' } }],
              validations: ['required', 'validCardExpirationDate'],
              autoComplete: 'cc-exp',
              css,
            });
          }

          // Create VGS Collect field for CVC
          form.field('#cc-cvc', {
            name: 'card_security_code',
            type: 'card-security-code',
            title: 'CVC/CVV',
            placeholder: 'CVV',
            validations: ['required', 'validCardSecurityCode'],
            autoComplete: 'cc-csc',
            css,
          });

          // Submits all of the form fields by executing a POST request.
          document.getElementById('cc-form')
            .addEventListener('submit', function (e) {
              e.preventDefault();

              document.getElementById('submit-button').disabled = true;
              document.getElementById('loading-icon').style.display = 'inline-block';

              const cardFormInfo = form.state || {};
              const cardDetails = cardFormInfo.card_number || {};

              let vgsPayload = {};

              if ('${amountStr}') { // build payload for checkout payment
                vgsPayload = {
                  plan_id: '${selectedPlan}',
                  processing_details: {
                    bin: cardDetails.bin,
                    last_4_digits: cardDetails.last4,
                    card_holder: '${fieldData.firstName || 'Spotii'} ${fieldData.lastName || 'Customer'}',
                    card_type: cardDetails.cardType,
                    customer_address: {
                      street1: '${fieldData.fullAddress || 'Spotii address'}',
                      city: '${fieldData.city || 'Dubai'}',
                      state: 'du',
                      country: '${fieldData.country || 'AE'}',
                      zip: '${fieldData.postcode || '12345'}',
                    },
                  },
                };

                if (${cvvOnly}) {
                  vgsPayload.processing_details.payment_method_id = '${paymentMethodId}';
                }

              } else { // build payload for adding card or paying an installment
                // base vgsPayload
                vgsPayload = {
                  payment_data: {},
                  card_holder: '${fieldData.firstName || ''} ${fieldData.lastName || ''}',
                  bin: cardDetails.bin,
                  last_4_digits: cardDetails.last4,
                  card_type: cardDetails.cardType,
                  is_mobile_request: ${true},
                };

                if (${Object.keys(installmentData).length}) { // if we need to pay an installment
                  vgsPayload.payment_data = {
                    prepay_type: '${installmentData.payWhat}',
                    installment_id: '${installmentData.nextInstallmentId}',
                    order_id : '${installmentData.orderId}',
                    is_mobile_request: ${true},
                  };
                }

                if (${cvvOnly}) {
                  vgsPayload.payment_method_id = '${paymentMethodId}';
                }

              }

              const vgsRequestPayload = {
                data: vgsPayload,
                method: 'POST',
                responseType: 'json',
                withCredentials: true,
                headers: {
                  Authorization: 'Bearer ${authToken}',
                }
              };  
              if(${!cvvOnly}){
                document.getElementById('number-error').style.display = 'none';
                document.getElementById('expiration-date-error').style.display = 'none';
              }
              document.getElementById('cvc-error').style.display = 'none';

              let vgsEndpoint = '';

              if ('${amountStr}') { // paying checkout
                vgsEndpoint = '${confirmVgsURL(checkoutToken)}';
              } else { // adding card or paying installment
                if (${Object.keys(installmentData).length}) {
                  vgsEndpoint = '${payPendingVgsURL(installmentData.orderId)}';
                } else {
                  vgsEndpoint = '${addCardVgsURL}';
                }
              }

              form.submit(vgsEndpoint,
                vgsRequestPayload,
                function (status, data) {
                  setTimeout(function () {
                    // document.getElementById('logger').innerHTML = 'success';

                    if(!data.redirect_url){
                      document.getElementById('submit-button').disabled = false;
                      document.getElementById('loading-icon').style.display = 'none';
                    }

                    window.ReactNativeWebView.postMessage(JSON.stringify({ status: true, data, statusCode: status }));
                  }, 0);

                }, function (err) {
                  // document.getElementById('logger').innerHTML = 'fail';

                  for (const key in err) {
                    if (key === 'card_number') {
                      document.getElementById('number-error').style.display = 'block';
                    } else if (key === 'card_expiration_date') {
                      document.getElementById('expiration-date-error').style.display = 'block';
                    } else if (key === 'card_security_code') {
                      document.getElementById('cvc-error').style.display = 'block';
                    }
                  }

                  document.getElementById('submit-button').disabled = false;
                  document.getElementById('loading-icon').style.display = 'none';

                  window.ReactNativeWebView.postMessage(JSON.stringify({ status: false, data: err }));
                });

            }, function (errors) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ status: false, data: errors }));
            });
        </script>
      </body>

      </html>`,
    [amountStr],
  );

  const loadingIconHTML = `
  <!DOCTYPE html>
  <html lang="en">

  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Enter card details</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
      integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">

    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <style>
      .loading {
        position: fixed;
        top: 0; right: 0;
        bottom: 0; left: 0;
        background: #fff;
      }

      .loader {
          left: 50%;
          margin-left: -4em;
          font-size: 8px;
          border: .8em solid #F9F9F9;
          border-left: .8em solid #411361;
          animation: spin 1.1s infinite linear;
      }

      .loader, .loader:after {
          border-radius: 50%;
          width: 8em;
          height: 8em;
          display: block;
          position: absolute;
          top: 50%;
          margin-top: -4.05em;
      }

      @keyframes spin {
        0% {
          transform: rotate(360deg);
        }
        100% {
          transform: rotate(0deg);
        }
      }
    </style>
  </head>

  <body>
    <div class="loading">
      <div class="loader"></div>
    </div>
  </body>

  </html>`;

  // webViewSource changes in case of async vgs flow (otp flow)
  const [webViewSource, setWebViewSource] = useState({ html: loadingIconHTML });

  // #region getting authToken
  useEffect(() => {
    authApi.getToken().then((authToken) => {
      setWebViewSource({ html: VGSCollectFormHTMl(authToken) });
    });
  }, [amountStr]);
  // #endregion

  // #region pulling checkout payment
  useEffect(async () => {
    if (amountStr) {
      const getInitialResponse = async () => {
        const initialResponse = await request.get(`/orders/${orderId}/status_checkout/`);
        setPrevRejectionLength(initialResponse.data.rejections.length);
      };
      try {
        await getInitialResponse();
      } catch (e) {
        console.error(e);
        setPrevRejectionLength(0);
      }
    }
  }, [amountStr]);

  useEffect(() => {
    if (amountStr) {
      if (!paymentVerificationUrl || prevRejectionLength === -1) return;

      setWebViewSource({ uri: paymentVerificationUrl });

      const pollForNewCard = setInterval(() => {
        request.get(`/orders/${orderId}/status_checkout/`).then((resp) => {
          const { status, rejections } = resp.data;
          // keep handling of error before the status, since card attach might get the status but there might be some error with attaching the card 'cvv error'
          if (rejections.length > prevRejectionLength) {
            clearInterval(pollForNewCard);
            dispatch(requestConfirmOrderFail(rejections));
          } else if (
            status === CHECKOUT_STATUS_APPROVED || status === CHECKOUT_STATUS_SUBMITTED
          ) {
            clearInterval(pollForNewCard);
            if (amountStr) { // if we are paying a checkout
              dispatch(requestConfirmOrderSuccess());
            } else { // when adding card, calling handleBack will refresh the list of payment methods
              handleBack(true);
            }
          }
        });
      }, 2500);
    }
  }, [paymentVerificationUrl, prevRejectionLength]);
  // #endregion

  // #region pulling add card / pay installments
  useEffect(() => {
    if (!isResolved && !addCardVerificationUrl) return;

    if (!isResolved || !addCardVerificationUrl) {
      dispatch(resetRedirectData());
      showMessage({
        message: t('success.paymentMethodAdded'),
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
      handleBack();
      return;
    }

    setWebViewSource({ uri: addCardVerificationUrl });
  }, [isResolved, redirectData]);
  // #endregion

  return (
    <WebView
    // ! keep the opacity 0.99, it is a known issue with WebView which is causing android to crash
    // @ check https://github.com/react-native-webview/react-native-webview/issues/1915#issuecomment-808869253
      style={[{ opacity: 0.99, height: addCardVerificationUrl || paymentVerificationUrl ? 700 : showHeader ? 475 : cvvOnly ? 175 : 260 }, !showHeader ? { padding: 0 } : {}]}
      source={webViewSource}
      // ! do not use androidHardwareAccelerationDisabled, since this is deprecated, hardware acceleration is causing the app to fail on android
      // @ we disabled it via calling the androidLayerType="software"
      androidLayerType="software"
      startInLoadingState
      cacheEnabled={false}
      onMessage={(data) => {
        const parsedData = JSON.parse(data.nativeEvent.data);

        if (parsedData.status) {
          if (amountStr) { // checkout payment
            dispatch(fetchOrderDetails(parsedData.data));
            dispatch(updateCheckoutWithCardAddResponse(parsedData.data));

            // do not close the webView when we want to do pulling (when the payment is async)
            if (!parsedData.data.redirect_url) {
              handleBack();
            }
          } else if (parsedData.data.code === 'payment_failed') {
            showMessage({
              message: t('errors.wrongCardDetails'),
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
            handleBack();
          } else if (parsedData.statusCode >= 400) {
            showMessage({
              message: t('errors.wrongCardDetailsUseDifferentCard'),
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
            handleBack();
          } else { // add card / pay installment
            dispatch(setRedirectData(parsedData.data));
          }
        } else {
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
          handleBack();
        }
        dispatch(setCheckoutAttempted({ checkoutAttempted: true }));
      }}
      renderLoading={() => (
        <View style={styles.center}>
          <Spinner />
        </View>
      )}
      onNavigationStateChange={(navState) => {
        if (Platform.OS === 'ios') {
          if ((['Spotii Account — Buy Now, Pay Later', 'https://widget.spotii.me/v1/img/spotii-loading.html'].includes(navState.title) || navState.url === 'https://widget.spotii.me/v1/img/spotii-loading.html') && navState.navigationType !== 'formsubmit') {
            handleBack(true);
          }
        } else if ((['Spotii Account — Buy Now, Pay Later', 'https://widget.spotii.me/v1/img/spotii-loading.html'].includes(navState.title) || navState.url === 'https://widget.spotii.me/v1/img/spotii-loading.html')) {
          handleBack(true);
        }
      }}
    />
  );
};

VgsPaymentForm.propTypes = {
  amountStr: PropTypes.string,
  handleBack: PropTypes.func,
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
    reset: PropTypes.func,
    goBack: PropTypes.func,
  }),
  showHeader: PropTypes.bool,
  cvvOnly: PropTypes.bool,
  paymentMethodId: PropTypes.string,
};

VgsPaymentForm.defaultProps = {
  amountStr: '',
  handleBack: () => {},
  navigation: null,
  showHeader: false,
  cvvOnly: false,
  paymentMethodId: '',
};

export default VgsPaymentForm;
