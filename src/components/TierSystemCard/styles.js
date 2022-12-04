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
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  mainSpinnerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    minHeight: 300,
    justifyContent: 'center',
  },

  scoreSuperScriptAr: {
    fontSize: 9,
    lineHeight: 26,
    textAlign: 'right',
  },

  invisible: {
    opacity: 0,
  },

  scoreRegularScriptAr: {
    fontSize: 40,
    lineHeight: 50,
    textAlign: 'right',
  },

  scoreSuperScriptEn: {
    fontSize: 14,
    lineHeight: 30,
    color: '#979999',
  },

  scoreRegularScriptEn: {
    fontSize: 45,
    lineHeight: 60,
  },

  superScriptAr: {
    fontSize: 10,
    lineHeight: 12,
    textAlign: 'right',
  },

  regularScriptAr: {
    fontSize: 18,
    lineHeight: 25,
    textAlign: 'right',
  },

  superScriptEn: {
    fontSize: 10,
    lineHeight: 12,
  },

  regularScriptEn: {
    fontSize: 18,
    lineHeight: 25,
  },

  ratingView: {
    width: '100%',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: '6%',
    alignItems: 'center',

  },
  faqView: {
    width: '100%',
  },
  accordionHeader: {
    minHeight: 40,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  accordionHeaderTextIconContainer: {
    // flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '94%',
  },
  accordionBody: {
    flexDirection: 'column',
    backgroundColor: '#f7f7f7',
    minHeight: 60,
    padding: 10,
  },

  checkbox: {
    marginVertical: '2%',
  },

  accordionBodyList: {
    marginLeft: '4%',
    marginVertical: '4%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  accordionBodySubList: {
    marginLeft: '8%',
    marginVertical: '4%',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },

  faqTitleAr: {
    fontSize: 19,
    marginBottom: '2%',
    textAlign: 'right',
  },

  faqTitleEn: {
    fontSize: 19,
    marginBottom: '2%',
  },

  faqHeaderTextEn: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  faqHeaderTextAr: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
  },

  checkboxTextContainerEn: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },

  checkboxTextContainerAr: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },

  faqFiveTextFooterContainerEn: {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 5,
  },

  faqFiveTextFooterContainerAr: {
    display: 'flex',
    flexDirection: 'row-reverse',
    flex: 1,
    flexWrap: 'wrap',
    marginHorizontal: 10,
  },

  faqFiveListItem: {
    backgroundColor: '#f7f7f7',
  },

  textBullet: {
    marginHorizontal: 10,
    fontSize: 30,
  },

  alignTextLeft: {
    textAlign: 'left',
  },

  alignTextRight: {
    textAlign: 'right',
  },

  tierCardDisclaimerEn: {
    fontSize: 18,
    color: '#979999',
    textAlign: 'left',
    marginVertical: '4%',
    marginHorizontal: '3%',
  },

  tierCardDisclaimerAr: {
    fontSize: 18,
    color: '#979999',
    textAlign: 'right',
    marginVertical: '4%',
    marginHorizontal: '3%',
  },

});

export default styles;
