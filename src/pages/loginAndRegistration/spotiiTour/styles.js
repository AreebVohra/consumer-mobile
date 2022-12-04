import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  form: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
    justifyContent: 'center',
  },
  topActionsRight: {
    position: 'absolute',
    top: 12,
    right: '6%',
  },
  header: {
    alignItems: 'center',
    marginBottom: '4%',
  },
  input: {
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
    marginHorizontal: '9%',
    borderRadius: 10,
    marginVertical: '4%',
  },
  cantSignInButton: {
    marginHorizontal: 20,
    borderRadius: 10,
    marginTop: '2%',
  },
  noAccountButton: {
    marginHorizontal: 13,
    borderRadius: 10,
    borderColor: 'white',
    backgroundColor: 'transparent',
    marginTop: '2%',
  },
  passwordInput: {
    textAlign: 'right',
    marginHorizontal: 12,
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
    marginBottom: '2%',
    fontSize: 20,
    fontWeight: 'normal',
    color: '#545454',
  },
  caption: {
    fontSize: 18,
  },
  card: {
    marginTop: '2%',
  },
  block: {
    borderWidth: 0,
    padding: 0,
    width: '50%',
    marginVertical: 10,
    paddingHorizontal: 3,
  },
  bgImage: {
    height: 150,
    width: '100%',
    resizeMode: 'contain',
    borderWidth: 0,
    borderRadius: 22,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  view: {
    justifyContent: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: '8%',
  },
  image: {
    resizeMode: 'contain',
    backgroundColor: 'rgba(0,0,0,.35)',
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    paddingVertical: 30,
    paddingHorizontal: 30,
    borderRadius: 22,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    minWidth: '94%',
  },
  modalView: {
    width: '90%',
  },
  modalTextButton: {
    color: '#AA8FFF',
    lineHeight: 30,
    fontSize: 16,
    borderBottomWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
    borderColor: '#eee',
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  buttonEn: {
    marginRight: 10,
    height: 15,
  },
  buttonAr: {
    marginRight: 10,
    height: 15,
  },
  cancelBtn: {
    height: 15,
  },
  exploreMore: {
    // width: '100%',
    textAlign: 'right',
    fontSize: 22,
    color: '#AA8FFF',
    marginRight: '9%',
    marginBottom: '2%',
  },
});

export default styles;
