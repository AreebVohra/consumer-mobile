import { StyleSheet } from 'react-native';
import theme from 'themes/light/theme.json';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
  },
  topActionsRight: {
    zIndex: 10,
    position: 'absolute',
    top: Constants.statusBarHeight + 15,
    right: '6%',
  },
  logoContainer: {
    marginTop: Constants.statusBarHeight + 80,
    alignItems: 'center',
    marginBottom: 50,
  },
  container: {
    flex: 1,
  },
  acceptTermsAndConditions: {
    marginHorizontal: 18,
    marginTop: 16,
    marginBottom: 4,
    height: 32,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 28,
    fontWeight: '400',
    lineHeight: 35,
    color: '#1A0826',
  },
  welcomeHeader: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22.5,
    color: '#1A0826',
  },
  welcomeSub: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#717171',
    textAlign: 'center',
    paddingHorizontal: 18,
  },
  welcomeText: {
    marginHorizontal: 18,
    marginBottom: 12,
    fontSize: 28,
    lineHeight: 35,
    color: '#1A0826',
  },
  descriptionText: {
    marginHorizontal: 18,
    fontSize: 14,
    lineHeight: 20,
    color: '#717171',
    fontWeight: '400',
  },
  inputStyles: {
    marginHorizontal: 18,
    marginVertical: 12,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    borderBottomColor: '#CCCCCC',
    borderRadius: 0,
  },
  checkBox: {
    marginHorizontal: '9%',
    marginVertical: 8,
  },
  middleContainer: {
    flexDirection: 'row',
  },
  middleInput: {
    width: 128,
  },
  signInButton: {
    marginHorizontal: 18,
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 22,
    paddingTop: 5,
    paddingBottom: 5,
  },
  alreadyHaveAnAccountButton: {
    marginHorizontal: 18,
    borderRadius: 8,
  },
  passwordInput: {
    textAlign: 'right',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  text: {
    marginHorizontal: 12,
    textAlign: 'center',
    marginBottom: 18,
  },
  subText: {
    marginHorizontal: 12,
    textAlign: 'center',
    fontSize: 22,
    color: '#545454',
  },
  label: {
    marginBottom: '1%',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#545454',
  },
  caption: {
    fontSize: 18,
  },
  description: {
    // color: 'white',
  },
  link: {
    color: '#411361',
  },
  dobAr: {
    marginBottom: '1%',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#545454',
    paddingRight: '9%',
    textAlign: 'right',
  },
  dobEn: {
    marginBottom: '1%',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#545454',
    paddingLeft: '9%',
    textAlign: 'left',
  },
  agreementErrorAr: {
    marginBottom: '1%',
    fontSize: 18,
    fontWeight: 'normal',
    color: '#AA8FFF',
    paddingRight: '9%',
    textAlign: 'right',
  },
  agreementErrorEn: {
    marginBottom: '1%',
    fontSize: 18,
    fontWeight: 'normal',
    color: '#AA8FFF',
    paddingLeft: '9%',
    textAlign: 'left',
  },
  lottieView: {
    width: '100%',
    height: '100%',
  },
  lottieViewContainer: {
    width: '30%',
    height: '30%',
    marginTop: 40,
    marginBottom: 60,
    alignItems: 'center',
    alignSelf: 'center',
  },
  idAssetContainer: {
    // flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    // width: '10%',
  },
  idAsset: {
    resizeMode: 'contain',
  },
  bottomActions: {
    alignSelf: 'center',
    marginVertical: '4%',
    // backgroundColor: 'red',
  },
  uploadButton: {
    borderColor: theme['color-success-500'],
    // backgroundColor: 'rgba(0, 102, 102, 0.5)',
    minWidth: '90%',
    paddingTop: 5,
    paddingBottom: 5,
  },
  accordionContainer: {
    marginTop: '8%',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  centerContainer: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  accordion: {
    width: '100%',
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
  faqHeaderTextEn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  faqHeaderTextAr: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },
  alignTextLeft: {
    textAlign: 'left',
  },
  alignTextRight: {
    textAlign: 'right',
  },
  checkboxTextContainerAr: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 10,
    marginVertical: 10,
  },
  checkboxTextContainerEn: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 5,
    marginBottom: 10,
  },
  accordionHeaderTextIconContainer: {
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    textAlign: 'center',
  },
  accordionBody: {
    flexDirection: 'column',
    backgroundColor: '#f7f7f7',
    minHeight: 60,
    padding: 10,
  },
  tipsHeaderText: {
    color: theme['color-success-500'],
    fontSize: 12,
    lineHeight: 32,
  },
  loaderContainer: {
    paddingTop: Constants.statusBarHeight,
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nfcContainer: {
    paddingTop: Constants.statusBarHeight + 80,
    // backgroundColor: 'blue',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  nfcScanButton: {
    minWidth: '80%',
    borderRadius: 100,
    marginBottom: '4%',
  },
});

export default styles;
