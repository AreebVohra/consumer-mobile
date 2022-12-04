import { StyleSheet, Dimensions } from 'react-native';
import { SCREEN_HEIGHT } from 'utils/constants';

const styles = StyleSheet.create({
  bottomSheetContainer: {
    height: SCREEN_HEIGHT,
    width: '100%',
    backgroundColor: '#fff',
    position: 'absolute',
    top: SCREEN_HEIGHT,
    borderRadius: 25,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
  },
  line: {
    width: 75,
    height: 4,
    backgroundColor: 'grey',
    alignSelf: 'center',
    marginVertical: 15,
    borderRadius: 2,
  },
  showShopsButton: {
    marginHorizontal: 18,
    borderRadius: 8,
    marginVertical: 14,
  },
  checkBoxView: {
    display: 'flex',
    marginHorizontal: '5%',
    marginVertical: 8,
    width: '40%',
    alignItems: 'center',
  },
  checkBoxText: {
    alignSelf: 'center',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 18,
    color: '#353535',
  },
  clearButton: {
    borderRadius: 8,
    marginTop: 14,
    marginBottom: 22,
  },
  newNotifications: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 15,
    color: '#353535',
    marginVertical: 32,
  },
  noNewNotifications: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    color: '#1A0826',
    textAlign: 'center',
  },
  expiredId: {
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
    color: '#FF4D4A',
    paddingBottom: 2,
  },
  pleaseUpdateId: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
    color: '#1A0826',
    paddingTop: 2,
  },
  scannerDisclaimer: {
    textAlign: 'center',
    marginTop: '4%',
  },
  touchableCard: {
    display: 'flex',
    width: '100%',
    height: '100%',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'space-between',
  },
  deleteAccountView: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '10%',
  },
  deleteAccountHeader: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 23,
    color: '#1A0826',
    marginTop: 20,
  },
  deleteAccountSub: {
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    color: '#717171',
    marginTop: 12,
  },
  deleteAccountBtn: {
    marginTop: 48,
    width: '100%',
    borderRadius: 8,
  },
  deleteAccountKeepIt: {
    textAlign: 'center',
    color: '#411361',
    marginTop: 28,
  },
  deleteAccount: {
    position: 'absolute',
    color: '#006666',
    textDecorationLine: 'underline',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modal: {
    maxWidth: '96%',
    height: '30%',
  },
  deleteBlockContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5%',
    borderRadius: 25,
  },
  deleteBlockHeader: {
    fontWeight: '700',
    marginTop: '4%',
  },
  deleteBlockSub: {
    textAlign: 'center',
    marginVertical: '3%',
  },
  deleteBlockActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginTop: '5%',
  },
  goToOrderBtn: {
    color: '#FFFFFF',
    fontWeight: '600',
    padding: 5,
  },
  deleteAccountFooter: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 15,
    color: '#717171',
  },
});

export default styles;
