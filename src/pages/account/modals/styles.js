import { StyleSheet } from 'react-native';
import Constants from 'expo-constants';

const styles = StyleSheet.create({
  modal: {
    minWidth: '96%',
  },
  addressModal: {
    minWidth: '90%',
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
  enSecondaryCancel: {
    marginTop: 10,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  heading: {
    marginVertical: '2%',
    marginBottom: 12,
  },
  buttonGroup: {
    borderRadius: 100,
    flexDirection: 'row',
    marginTop: '2%',
  },
  input: {
    marginTop: '2%',
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  enSecondaryAction: {
    marginLeft: '2%',
  },
  arSecondaryAction: {
    marginRight: '2%',
  },
  setDefault: {
    color: '#411361',
  },
  label: {
    marginBottom: '2%',
  },
});

export default styles;
