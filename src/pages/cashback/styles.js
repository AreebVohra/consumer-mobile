import { StyleSheet, YellowBox } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  card: {
    marginTop: '2%',
  },
  modal: {
    width: '98%',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowReverse: {
    flexDirection: 'row-reverse',
  },
  cashbackTotalHeaderDesc: {
    fontWeight: '700',
    fontSize: 18,
  },
  cashbackTotalHeader: {
    fontWeight: '600',
    color: '#AA8FFF',
    fontSize: 20,
  },
  cashbackSubSummary: {
    width: '100%',
    marginBottom: 8,
    justifyContent: 'space-between',
  },
  pendingRedeemedStyles: {
    fontSize: 14,
    fontWeight: '400',
    color: '#717171',
  },
  redeemCashbackHeaderDesc: {
    fontSize: 17,
    fontWeight: '300',
    lineHeight: 20,
    color: '#1A0826',
  },
  cashbackTransactionsHeaderDesc: {
    fontSize: 17,
    fontWeight: '300',
    lineHeight: 20,
    color: '#1A0826',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  block: {
    borderWidth: 0,
    padding: 0,
    width: '50%',
    marginVertical: 10,
    paddingHorizontal: 3,
  },
  view: {
    flexDirection: 'column',
    backgroundColor: '#F9F9F9',
  },
  mainSpinnerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },

  scoreSuperScriptAr: {
    fontSize: 9,
    lineHeight: 26,
    textAlign: 'right',
  },

  invisible: {
    opacity: 0,
  },

  scoreRegularScriptAr: {
    fontSize: 45,
    textAlign: 'center',
  },

  scoreSuperScriptEn: {
    fontSize: 14,
    lineHeight: 30,
    color: '#979999',
  },

  scoreRegularScriptEn: {
    fontSize: 45,
    textAlign: 'center',
  },

  superScriptAr: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'right',
  },

  regularScriptAr: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'right',
  },

  superScriptEn: {
    fontSize: 10,
    lineHeight: 12,
  },

  regularScriptEn: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'left',
  },

  regularScriptCashbackEn: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'left',
    color: '#1A0826',
    paddingLeft: 4,
  },

  regularScriptCashbackAr: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '500',
    textAlign: 'right',
    color: '#1A0826',
    paddingRight: 4,
  },

  cashbackCardView: {
    marginHorizontal: 12,
    marginVertical: 6,
    paddingHorizontal: 10,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  cashbackSubCardView: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: '#EDE6FF',
    borderRadius: 8,
  },
  bankWithdrawalAmount: {
    fontWeight: '300',
    fontSize: 18,
    lineHeight: 22.5,
    color: '#AA8FFF',
  },
  faqView: {
    width: '100%',
  },
  accordionHeader: {
    minHeight: 60,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  accordionHeaderTextIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '94%',
  },
  accordionBody: {
    flexDirection: 'column',
    minHeight: 60,
    paddingRight: 10,
    paddingBottom: 10,
  },

  checkbox: {
    marginVertical: '2%',
  },

  accordionBodyList: {
    marginLeft: '4%',
    marginVertical: '4%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  accordionBodySubList: {
    marginLeft: '8%',
    marginVertical: '4%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  faqTitleAr: {
    fontSize: 19,
    marginBottom: '2%',
    textAlign: 'right',
  },

  faqTitleEn: {
    fontSize: 19,
    marginBottom: '2%',
  },

  faqHeaderEn: {
    fontWeight: '400',
    fontSize: 24,
    lineHeight: 30,
    color: '#190A0A',
  },

  faqHeaderTextEn: {
    flexDirection: 'row',
    lineHeight: 60,
    alignItems: 'center',
    textAlign: 'center',
  },

  faqHeaderTextAr: {
    flexDirection: 'row-reverse',
    lineHeight: 60,
    alignItems: 'center',
    textAlign: 'right',
  },

  checkboxTextContainerEn: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },

  checkboxTextContainerAr: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },

  faqFiveTextFooterContainerEn: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 5,
  },

  faqFiveTextFooterContainerAr: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },

  faqFiveListItem: {
    backgroundColor: '#f7f7f7',
  },

  textBullet: {
    marginHorizontal: 10,
    fontSize: 30,
  },

  alignTextLeft: {
    textAlign: 'left',
  },

  alignTextRight: {
    textAlign: 'right',
  },

  cashbackBody: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 21.03,
  },

  suspendedAcctFooterEn: {
    fontSize: 12,
    color: '#979999',
    textAlign: 'left',
    marginBottom: '4%',
    marginHorizontal: '3%',
  },

  SuspendedAcctFooterAr: {
    fontSize: 12,
    color: '#979999',
    textAlign: 'right',
    marginBottom: '4%',
    marginHorizontal: '3%',
  },

  shadowTextBlock: {
    textAlign: 'center',
    fontSize: 23,
    marginTop: 15,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },

  bgImage: {
    height: 55,
    width: 55,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'contain',
    paddingVertical: 30,
    paddingHorizontal: 40,
    borderRadius: 22,
  },
  cashbackImage: {
    width: '100%',
    marginTop: -50,
    alignItems: 'center',
    resizeMode: 'contain',
  },
  cashbackSummaryDesc: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: '-10%',
    alignItems: 'center',
    width: '100%',
  },
  cashbackHiwHeading: {
    fontWeight: '400',
    fontSize: 18,
    lineHeight: 22.5,
    color: '#1A0826',
  },
  cashbackHiwSubheading: {
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 22,
    color: '#717171',
  },
  boldText: {
    fontWeight: '700',
  },
  merchantTile: {
    borderWidth: 0,
    padding: 0,
    paddingLeft: '1%',
    paddingRight: '1%',
    marginVertical: '2%',
    paddingHorizontal: 3,
    justifyContent: 'center',
    maxWidth: '100%',
  },
  amountView: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: '5%',
    paddingTop: 5,
    width: '100%',
  },
  amountText: {
    color: 'grey',
    fontWeight: 'bold',
    textAlign: 'right',
    alignSelf: 'flex-end',
    width: '100%',
  },
  cashbackDetails: {
    width: '50%',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'left',
    marginVertical: 15,
    paddingHorizontal: 5,
  },
  merchantName: {
    fontSize: 14,
    fontWeight: '400',
    color: '#1A0826',
  },
  cashbackTransactionDescription: {
    color: '#717171',
    fontSize: 12,
    fontWeight: '300',
    marginBottom: 2,
  },
  cashbackParentTile: {
    margin: 3,
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
  },
  cashbackOptionParent: {
    flexDirection: 'row',
    backgroundColor: '#FFEFEF',
    paddingVertical: 20,
  },
  cashbackAmount: {
    alignItems: 'flex-end',
    marginBottom: 70,
    marginRight: 7,
    textAlign: 'center',
    fontSize: 15,
  },
  cashbackAmtSignParent: {
    width: '25%',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  cashbackSignIcon: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: '25%',
    height: 20,
    marginBottom: 3,
  },
  layout: {
    width: '100%',
    height: '100%',
  },
  filterOptions: {
    color: 'black',
    fontSize: 19,
    textAlign: 'center',
    opacity: 0.9,
    textAlignVertical: 'center',
    paddingTop: '5%',
    paddingBottom: '5%',
  },
  filterOverlay: {
    flex: 1,
    height: '100%',
    width: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 1,
    zIndex: 2147483647,
    backgroundColor: 'white',
  },
  filterButton: {
    color: 'white',
    backgroundColor: '#AA8FFF',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 100,
    borderRadius: 45,
    paddingBottom: 10,
  },
  cashbackTrxButton: {
    color: 'white',
    backgroundColor: '#AA8FFF',
    alignItems: 'center',
    alignSelf: 'center',
    zIndex: 100,
    borderRadius: 45,
    paddingBottom: 10,
    justifyContent: 'center',
    marginVertical: 15,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.8,
    shadowRadius: 1,
    elevation: 4,
  },
  trxText: {
    color: '#FFFFFF',
    fontWeight: '400',
    fontSize: 20,
    textAlign: 'center',
  },
  form: {
    paddingTop: 10,
    justifyContent: 'center',
  },
  header: {
    marginBottom: '4%',
    alignItems: 'center',
    marginTop: '2%',
    marginHorizontal: '1%',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    lineHeight: 30,
    fontWeight: '400',
  },
  subText: {
    marginHorizontal: 12,
    textAlign: 'center',
    fontSize: 16,
    color: '#1A0826',
  },
  subHeading: {
    marginHorizontal: 8,
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 17.5,
    color: '#717171',
  },
  input: {
    marginHorizontal: '9%',
    marginVertical: 8,
  },
  cashbackScarcityText: {
    width: '100%',
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
    marginVertical: 7,
  },
  bankWithdrawalSubmitText: {
    fontSize: 22,
    color: 'white',
  },
  label: {
    marginBottom: '1%',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#545454',
  },
  bankReqOverlay: {
    alignItems: 'center',
    marginTop: '50%',
    justifyContent: 'center',
    height: '30%',
    marginHorizontal: '5%',
    borderRadius: 5,
  },
  cashbackOption: {
    width: 70,
    height: 70,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    elevation: 4,
    borderRadius: 1000,
  },
  cashbackOptionView: {
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cashbackSummaryPic: {
    width: '95%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -5,
  },
  onlyXtoRedeemView: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  of100Text: {
    color: 'grey',
    fontSize: 16,
    paddingVertical: 10,
  },
  aedText: {
    fontSize: 14,
    paddingBottom: 30,
  },
  onlyXtoRedeemText: {
    width: '100%',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
  },
  transactionsView: {
    paddingVertical: 15,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  transactionsSubView: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    width: '33%',
    flexDirection: 'row',
    justifyContent: 'center',
    textAlign: 'center',
    alignItems: 'center',
  },
  transactionsText: {
    paddingHorizontal: 5,
    paddingBottom: 10,
    color: '#000000',
    width: '33%',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cashbackActionHelpTextSmall: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 8,
    lineHeight: 15,
    height: 50,
    paddingHorizontal: 6,
  },
  cashbackActionHelpTextBig: {
    fontSize: 15,
    textAlign: 'center',
    marginVertical: 8,
    height: 50,
    paddingHorizontal: 6,
  },
  noCashbackInFilterView: {
    textAlign: 'center',
    padding: 10,
  },
  noCashbackInFilterText: {
    textAlign: 'center',
  },
  noCashbackTitle: {
    color: '#1A0826',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    textAlign: 'center',
  },
  noCashbackDesc: {
    color: '#353535',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17.5,
    textAlign: 'center',
    top: 12,
  },
  spinner: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
