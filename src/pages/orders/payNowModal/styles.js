import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  modal: {
    maxWidth: '98%',
  },
  insufficientCashback: {
    width: '100%',
    color: 'red',
    textAlign: 'center',
    marginTop: 5,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heading: {
    marginVertical: '2%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '400',
    color: '#1A0826',

  },
  input: {
    marginTop: '2%',
  },
  actions: {
    flexDirection: 'row',
    marginTop: '4%',
  },
  enSecondaryAction: {
    marginLeft: '2%',
  },
  arSecondaryAction: {
    marginRight: '2%',
  },
  setDefault: {
    color: '#411361',
  },
  paymentTypeButtonGroup: {
    marginTop: '6%',
    flexDirection: 'row',
  },
  paymentMethods: {
    marginTop: '6%',
  },
  paymentTypeButton: {
    backgroundColor: '#fff',
    width: '50%',

  },
  redeemNowButton: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  useCashbackButton: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    marginBottom: 15,
    borderColor: '#000000',
  },
  selectedCashbackButton: {
    backgroundColor: '#411361',
    borderColor: '#411361',
  },
  cashbackButtonTextView: {
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
  },
  cashbackButtonText: {
    textAlign: 'center',
    width: '100%',
    fontSize: 12,
    color: '#FFFFFF',
  },
  orLineView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orLineDivider: {
    flex: 1,
    height: 0.5,
    backgroundColor: 'grey',
  },
  orLineText: {
    width: '100%',
    textAlign: 'center',
    color: 'grey',
    paddingVertical: 7,
  },
  bgImage: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderWidth: 4,
    borderColor: 'white',
    borderRadius: 22,
    marginBottom: 10,
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bgImageAffiliate: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#c6c7c2',
    borderRadius: 22,
    marginBottom: 10,
    shadowColor: 'black',
    shadowRadius: 10,
    shadowOpacity: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'contain',
    height: null,
    width: null,
    flex: 1,
  },
  orderDetails: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'left',
    paddingHorizontal: 5,
  },
  bgLogo: {
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,.35)',
    paddingVertical: '10%',
    paddingHorizontal: '10%',
    borderRadius: 22,
  },
  bgLogoAffiliate: {
    resizeMode: 'cover',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingVertical: '10%',
    paddingHorizontal: '10%',
    borderRadius: 22,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '700',
  },
  cashbackDate: {
    color: 'grey',
    paddingTop: 4,
    fontSize: 13,
  },
  allOrdersView: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  allOrdersLink: {
    color: '#411361',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  cashbackAmtSignParent: {
    width: '50%',
  },
  pendingInstals: {
    fontWeight: '700',
    fontSize: 13,
  },
  paymentTypeButtonSelected: {
    backgroundColor: '#AA8FFF',
    color: '#fff',
  },
  buttonGroup: {
    borderRadius: 100,
    flexDirection: 'row',
    marginTop: '1%',
  },
  spinnerView: {
    alignItems: 'center',
    marginVertical: '5%',
    justifyContent: 'center',
    width: '100%',
  },
  paymentOptionListContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 3,
    paddingHorizontal: '4%',
    borderRadius: 5,
    height: '100%',
    marginTop: '2%',
    paddingBottom: '15%',
  },
  cardSelection: {
    marginTop: '4%',
    marginBottom: '10%',
  },
  headerContainerSelectedFullBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    padding: 10,
    borderColor: '#AA8FFF',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: '3%',
  },
  accordionHeaderContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    padding: 10,
    borderRadius: 5,
    marginTop: '3%',
    backgroundColor: '#F9F9F9',
  },
  flexRow: {
    flexDirection: 'row',
  },
  accordionSelectOuter: {
    width: 20,
    height: 20,
    borderRadius: 50,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  accordionSelectInner: {
    width: 12,
    height: 12,
    borderRadius: 50,
  },
  pmContainer: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  accordionBodyNoPadding: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    borderColor: '#AA8FFF',
    borderWidth: 1,
    borderTopColor: '#FFFFFF',
    // height: 325,
    paddingTop: 0,
    paddingHorizontal: 0,
    paddingBottom: 0,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    borderBottomWidth: 1,
  },
  accordionHeaderDivider: {
    width: '95%',
    borderWidth: 1,
    marginTop: 7,
    borderColor: '#CCCCCC',
    alignSelf: 'center',
  },
  accordionHeaderDividerCVV: {
    width: '95%',
    marginTop: 7,
    alignSelf: 'center',
  },
  cardLogo: {
    maxWidth: 30,
    maxHeight: 30,
    resizeMode: 'contain',
    flex: 1,
  },
  accordionSelectPlus: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  accordionHeaderContainerSelected: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    borderColor: '#AA8FFF',
    borderWidth: 1,
    borderBottomColor: '#FFFFFF',
    borderTopRightRadius: 5,
    borderTopLeftRadius: 5,
    marginTop: '3%',
  },
  processorLogoContainer: {
    flexDirection: 'row',
    marginHorizontal: 10,
    paddingHorizontal: '6%',
    justifyContent: 'space-evenly',
    flex: 1,
  },
  processorLogo: {
    maxWidth: 30,
    maxHeight: 30,
    resizeMode: 'contain',
    flex: 1,
  },
  installmentNumber: {
    fontWeight: '400',
    fontSize: 12,
    color: '#1A0826',
    lineHeight: 15,
    marginTop: '4%',
  },
});

export default styles;
