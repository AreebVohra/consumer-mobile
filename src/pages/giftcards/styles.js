import { StyleSheet, YellowBox } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  flex: {
    display: 'flex',
  },
  rowFlex: {
    display: 'flex',
    flexDirection: 'row',
  },
  columnFlex: {
    display: 'flex',
    flexDirection: 'column',
  },
  fullWidth: {
    width: '100%',
  },
  gcPageHero: {
    width: '100%',
    backgroundColor: '#ff4d4a',
    position: 'relative',
  },
  gcPageMAFLogo: {
    margin: '10%',
    width: '60%',
  },
  gcPageMaskGroup: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 125,
    width: '40%',
  },
  banner: {
    height: 150,
    backgroundColor: '#FFFFFF',
    resizeMode: 'contain',
    marginTop: '2%',
    position: 'relative',
    paddingHorizontal: '2%',
    zIndex: 100,
    borderRadius: 8,
  },
  bannerTextContainer: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    width: '75%',
    height: '100%',
    justifyContent: 'center',
  },
  bannerMAFLogo: {
    padding: '3%',
    width: '25%',
  },
  bannerMaskGroup: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: 100,
    width: '20%',
  },
  greenBoldText: {
    fontWeight: '700',
    color: '#411361',
    fontSize: 14,
  },
  greenRegularText: {
    fontWeight: '600',
    color: '#411361',
    fontSize: 12,
  },
  selectiveBoldText: {
    fontWeight: '700',
    color: '#411361',
  },
  selectiveText: {
    color: '#411361',
  },
  boldText: {
    fontWeight: '700',
    fontSize: 17,
  },
  headerBoldText: {
    fontWeight: '700',
    fontSize: 20,
  },
  modalHeaderText: {
    fontSize: 18,
    fontWeight: '700',
  },
  subText: {
    fontSize: 13,
    color: 'gray',
  },
  mediumSubText: {
    fontSize: 11,
    color: 'gray',
    fontStyle: 'italic',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  errorText: {
    width: '100%',
    color: 'red',
    marginTop: 5,
    textAlign: 'center',
  },
  redBullet: {
    color: '#ff4d4a',
    fontSize: 20,
  },
  allCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  alignItemsCenter: {
    alignItems: 'center',
  },
  justifyCenter: {
    justifyContent: 'center',
  },
  centerAlign: {
    textAlign: 'center',
  },
  justifySpaceBtw: {
    justifyContent: 'space-between',
  },
  width5: {
    width: '5%',
  },
  width85: {
    width: '85%',
  },
  width90: {
    width: '90%',
  },
  width95: {
    width: '95%',
  },
  maxWidth70: {
    maxWidth: '70%',
  },
  maxWidth90: {
    maxWidth: '90%',
  },
  borderWidth2: {
    borderWidth: 2,
  },
  marginLeft2: {
    marginLeft: '2%',
  },
  marginRight2: {
    marginRight: '2%',
  },
  margin1: {
    margin: '1%',
  },
  margin2: {
    margin: '2%',
  },
  margin3: {
    margin: '3%',
  },
  margin4: {
    margin: '4%',
  },
  margin5: {
    margin: '5%',
  },
  marginTop1: {
    marginTop: '1%',
  },
  marginTop2: {
    marginTop: '2%',
  },
  marginTop3: {
    marginTop: '3%',
  },
  marginTop5: {
    marginTop: '5%',
  },
  paddingHorizontal5: {
    paddingHorizontal: 5,
  },
  marginHorizontal15: {
    marginHorizontal: 15,
  },
  marginVertical5: {
    marginVertical: 5,
  },
  infoText: {
    color: '#ffffff',
    fontSize: 17,
  },
  offerContainer: {
    backgroundColor: 'white',
    width: '25%',
    marginTop: 5,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  offerText: {
    color: '#411361',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  roundedNumber: {
    backgroundColor: '#411361',
    borderRadius: 20,
    width: 25,
    height: 25,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderContainer: {
    width: '90%',
    marginHorizontal: '5%',
  },
  sliderTrack: {
    height: 7,
    borderColor: '#411361',
    borderRadius: 5,
  },
  sliderLimits: {
    color: '#000000',
    fontWeight: '700',
  },
  card: {
    flex: 1,
    width: '100%',
  },
  subTextGray: {
    color: '#717171',
  },
  subTextWhite: {
    color: '#FFFFFF',
  },
  scannerCameraMessageView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  scannerCameraIdUploadView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '90%',
  },
  idTextContainer: {
    color: '#717171',
    marginBottom: '15%',
  },
  spotiiWideErrorContainer: {
    marginHorizontal: '5%',
  },
  scannerDisclaimerHeader: {
    textAlign: 'center',
  },
  scannerDisclaimer: {
    textAlign: 'center',
    marginTop: '4%',
  },
  idAssetContainer: {
    marginTop: '5%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '15%',
  },
  idUploadHeader: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 28,
  },
  idUploadButton: {
    position: 'absolute',
    bottom: 10,
    marginTop: '20%',
    width: '100%',
    borderRadius: 8,
  },
  nfcScanButton: {
    position: 'absolute',
    bottom: 10,
    marginTop: '20%',
    width: '100%',
    borderRadius: 100,
  },
  modal: {
    width: '95%',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  howItWorksRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 5,
  },
  mapContainer: {
    minHeight: 525,
    // width: 400,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  gcText: {
    justifyContent: 'center',
    marginHorizontal: 30,
    marginVertical: 20,
  },
  gcTitle: {
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 30,
    color: '#1A0826',
  },
  gcDescription: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: '#353535',
  },
});

export default styles;
