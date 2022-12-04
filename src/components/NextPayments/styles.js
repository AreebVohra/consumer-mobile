import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  slider: {
    marginVertical: '2%',
  },
  sliderCard: {
    width: '100%',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    marginLeft: 0,
    marginRight: 0,
    paddingTop: 25,
    paddingBottom: 30,
    backgroundColor: 'transparent',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'contain',
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    // marginHorizontal: 6,
  },
  headingContainer: {
    flexDirection: 'column',
  },
  imageContainer: {
    flex: 1,
  },
  paymentsView: {
    flex: 1,
    // marginHorizontal: 6,
  },
  container: {
    flexDirection: 'row',
    height: '100%',
  },
  paymentsContainer: {
    flexDirection: 'row',
    height: '100%',
    // paddingVertical: 10,
  },
  shopDirBtn: {
    // alignSelf: 'flex-start',
  },
  tab: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    margin: 5,
    opacity: 0.35,
  },
  circleActive: {
    backgroundColor: '#AA8FFF',
    borderRadius: 100,
    width: 10,
    height: 10,
    margin: 2.5,
  },
  refLink: {
    color: '#156c6c',
    fontSize: 20,
  },
});

export default styles;
