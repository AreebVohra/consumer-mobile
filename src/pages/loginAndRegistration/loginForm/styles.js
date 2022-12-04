import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    flex: 1,
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
  header: {
    marginBottom: '4%',
    marginTop: 20,
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
  forgotPasswordBtn: {
    color: '#AA8FFF',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 24,
    marginHorizontal: 18,
  },
  signInOTPBtn: {
    color: '#411361',
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 18,
    textAlign: 'center',
    paddingVertical: 5,
    width: '100%',
  },
  signUpOTPBtn: {
    color: '#AA8FFF',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 18,
  },
  otherLoginActionsStyles: {
    marginHorizontal: 18,
    marginVertical: 8,
    height: 32,
    justifyContent: 'center',
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
    marginBottom: 16,
    paddingVertical: 5,
  },
  signInOptionsButtons: {
    marginHorizontal: '9%',
    borderRadius: 10,
    marginTop: '4%',
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
    marginTop: '1%',
    fontSize: 18,
  },
});

export default styles;
