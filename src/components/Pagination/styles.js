import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  paymentControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  controlButton: {
    // borderRadius: 100,
    // width: 10,
  },
  circle: {
    backgroundColor: '#AA8FFF',
    borderRadius: 100,
    width: 5,
    height: 5,
    opacity: 0.35,
  },
  circleActive: {
    backgroundColor: '#AA8FFF',
    borderRadius: 100,
    width: 10,
    height: 10,
  },
});

export default styles;
