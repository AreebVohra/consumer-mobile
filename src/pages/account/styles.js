import { StyleSheet } from 'react-native';
import theme from 'themes/light/theme.json';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  avatarPlaceHolder: {
    width: 100,
    height: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe2e2',
    marginTop: '7%',
  },
  profileRow: {
    marginTop: 8,
  },
  modalView: {
    width: 300,
    height: 215,
    maxHeight: 215,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingBottom: 20,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    flex: 1,
  },
  profileInfo: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 18,
    color: '#717171',
  },
  cardLogo: {
    maxWidth: 30,
    maxHeight: 30,
    resizeMode: 'contain',
    flex: 1,
  },
  badge: {
    backgroundColor: '#E5EFEF',
    color: '#411361',
  },
  scannerDisclaimer: {
    textAlign: 'center',
    marginTop: '4%',
  },
  paymentMethodHeader: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: '3%',
    borderColor: '#717171',
    backgroundColor: '#F9F9F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  leanMultiButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
  },
  leanDeleteButton: {
    width: '10%',
    marginLeft: '1%',
  },
});

export default styles;
