import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  layout: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    height: '70%',
    justifyContent: 'center',
  },
  header: {
    // marginBottom: '15%',
    marginHorizontal: 15,
  },
  text: {
    marginBottom: 12,
    fontSize: 28,
    lineHeight: 35,
    color: '#1A0826',
  },
  subHeader: {
    marginBottom: 4,
    fontSize: 18,
    fontWeight: '700',
    color: '#1A0826',
    textAlign: 'center',
  },
  subSubheader: {
    marginBottom: 12,
    fontSize: 14,
    color: '#717171',
    textAlign: 'center',
  },
  inputStyles: {
    marginHorizontal: 18,
    marginVertical: 12,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    borderBottomColor: '#CCCCCC',
    borderRadius: 0,
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
    marginTop: 32,
    marginBottom: 22,
    paddingVertical: 5,
  },
  alreadyHaveAnAccountButton: {
    marginHorizontal: 18,
    borderRadius: 8,
    backgroundColor: 'transparent',
    marginTop: 14,
  },
  passwordInput: {
    textAlign: 'right',
    marginHorizontal: 20,
    marginVertical: 8,
  },
  label: {
    marginBottom: '1%',
  },
  caption: {
    marginTop: '1%',
    fontSize: 18,
  },
  lottieView: {
    width: '100%',
    height: '100%',
  },
  lottieViewContainer: {
    width: '25%',
    height: '25%',
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default styles;
