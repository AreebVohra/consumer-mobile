import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  layout: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: '#F5F5F5',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  badge: {
    backgroundColor: '#E5EFEF',
    color: '#411361',
  },
  listItemAccessoryRight: {
    flexDirection: 'row',
  },
  orderList: {
    marginBottom: '3%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  listItemText: {
    color: '#1A0826',
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 25,
    width: '65%',
  },
  listItemTextSub: {
    color: '#1A0826',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 16,
  },
  listItemTextRef: {
    textAlign: 'left',
    color: '#717171',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 15,
  },
  PaymentInfo: {
    alignItems: 'center',
    flex: 1,
  },
  PaymentInfoSub: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    backgroundColor: '#AA8FFF',
    borderRadius: 100,
    width: 12,
    height: 12,
    margin: 2.5,
    opacity: 0.25,
  },
  circleActive: {
    backgroundColor: '#AA8FFF',
    borderRadius: 100,
    width: 12,
    height: 12,
    margin: 2.5,
  },
  instalmentProgress: {
    width: 80,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  orderDetailHeader: {
    flexDirection: 'column',
    width: '100%',
    marginLeft: 24,
  },
  orderDetailTimelineContainer: {
    flexDirection: 'column',
    marginTop: 40,
  },
  instalmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cashbackTextEn: {
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    left: 20,
    // marginLeft: '5%',
  },
  cashbackTextAr: {
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative',
    // marginLeft: '5%',
  },
  missedOrNextTimeline: {
    flex: 0.8,
    alignItems: 'center',
  },
  payNowButton: {
    backgroundColor: '#411361',
    borderRadius: 8,
    paddingVertical: 0,
    flex: 1,
  },
  paymentMethod: {
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  paymentCard: {
    flexDirection: 'row',
  },
  badgeComplete: {
    backgroundColor: '#0EBD8F',
    color: '#0EBD8F',
  },
  badgeRefunded: {
    backgroundColor: '#e1e5ea',
  },
  badgeTextRefunded: {
    fontSize: 14,
    lineHeight: 17.5,
    color: '#0EBD8F',
  },
  badgeVoided: {
    backgroundColor: '#e1e5ea',
  },
  badgeTextVoided: {
    fontSize: 14,
    lineHeight: 17.5,
    color: '#411361',
  },
  badgeTextComplete: {
    color: '#0EBD8F',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  badgeTextCashbackComplete: {
    color: '#0EBD8F',
  },
  badgeTextMissed: {
    color: '#FF4D4A',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  installmentCard: {
    backgroundColor: '#F9F9F9',
    marginBottom: 8,
    marginHorizontal: 8,
    paddingHorizontal: 21,
    flex: 1,
    borderRadius: 8,
  },
  orderDetailTimelineItemEn: {
    paddingRight: 18,
    paddingBottom: 5,
  },
  orderDetailTimelineItemAr: {
    paddingBottom: 5,
  },
  installmentNumber: {
    color: '#1A0826',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  orderDetailsRow: {
    marginBottom: '2%',
    width: '33%',
  },
  orderDetailsSingleton: {
    marginBottom: '3%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderDetailsSingletonAr: {
    marginBottom: '3%',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  orderDetailsSingletonText: {
    marginRight: '20%',
    width: '42%',
  },
  orderDetailsSingletonTextAr: {
    marginLeft: '20%',
    width: '42%',
    textAlign: 'right',
  },
  listFooter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bottomTab: {
    fontSize: 14,
  },
  pendingInstals: {
    color: '#1A0826',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 15,
  },
  listDesc: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  autoPay: {
    color: '#1A0826',
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 15,
  },
  merchantText: {
    width: '65%',
    color: '#1A0826',
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 30,
    marginBottom: 13,
  },
  totalCard: {
    width: '75%',
    minHeight: 100,
    marginTop: 32,
    alignSelf: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
  },
  orderText: {
    marginBottom: 4,
    color: '#717171',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
  },
  totalAmountWithFee: {
    color: '#1A0826',
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 18,
    width: '100%',
  },
  missedTimelineText: {
    color: '#FF4D4A',
    fontSize: 14,
    fontWeight: '600',
    lineHeight: 18,
  },
  installmentDate: {
    color: '#1A0826',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  totalAmountText: {
    color: '#1A0826',
    fontWeight: '400',
    textAlign: 'center',
  },
  totalAmountPaidText: {
    color: '#0EBD8F',
    fontSize: 20,
    fontWeight: '400',
    textAlign: 'center',
    paddingTop: 6,
  },
  subTextColor: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 15,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  payButton: {
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  refundInfoText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 17.5,
    color: '#717171',
  },
});

export default styles;
