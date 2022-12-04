import { StyleSheet, YellowBox } from 'react-native';

const styles = StyleSheet.create({
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
  view: {
    justifyContent: 'flex-start',
    flexDirection: 'column',
    alignItems: 'center',
    height: 100,
  },
  image: {
    height: '60%',
    // width: '100%',
    marginTop: '5%',
    resizeMode: 'contain',
    borderRadius: 10,
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
});

export default styles;
