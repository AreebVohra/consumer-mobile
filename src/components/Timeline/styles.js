import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'space-between',
  },
  flexColumn: {
    flexDirection: 'column',
  },
  flexRow: {
    flexDirection: 'row',
  },
  flexRowReverse: {
    flexDirection: 'row-reverse',
  },
  verticalTimeLineRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  verticalTimeLineColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  horizontalTimeLineColumn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalLine: {
    height: 27,
    borderWidth: 1,
  },
  horizontalLine: {
    width: 85,
    borderWidth: 1,
  },
  circle: {
    backgroundColor: '#AA8FFF',
    borderRadius: 25,
    width: 5,
    height: 5,
    margin: 2.5,
    opacity: 0.25,
  },
  circleActive: {
    backgroundColor: '#AA8FFF',
    borderRadius: 25,
    width: 5,
    height: 5,
    margin: 2.5,
  },
  timelinePie: {
    paddingHorizontal: 2,
    borderWidth: 1,
    width: 15,
    borderRadius: 30,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#CCCCCC',
  },
  timelinePieActive: {
    paddingHorizontal: 2,
    borderWidth: 1,
    width: 15,
    borderRadius: 30,
    height: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#AA8FFF',
  },
  totalTextContainer: {
    justifyContent: 'space-between',
    marginTop: '3%',
  },
  totalText: {
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 17.5,
    color: '#1A0826',
  },
});

export default styles;
