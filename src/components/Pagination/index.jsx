/* eslint-disable max-len */
/* eslint-disable global-require */
import React from 'react';
import { useSelector } from 'react-redux';
import { View } from 'react-native';
import {
  Button,
} from '@ui-kitten/components';
import Icon from 'components/Icon';
import styles from './styles';

const Pagination = ({
  onPage,
  currentPage,
  pageCount,
}) => {
  const currLang = useSelector(state => state.language.language);

  const renderDots = () => {
    const dots = [];
    if (pageCount > 4) {
      for (let i = 0; i < 4; i += 1) {
        dots.push(<View key={i} style={currentPage % 4 === i ? styles.circleActive : styles.circle} />);
      }
    } else {
      for (let i = 0; i < pageCount; i += 1) {
        dots.push(<View key={i} style={currentPage === i ? styles.circleActive : styles.circle} />);
      }
    }

    return dots;
  };

  const handlePrev = () => {
    if (currentPage < 1) {
      onPage(pageCount - 1);
    } else {
      onPage(currentPage - 1);
    }
  };
  const handleNext = () => {
    if (currentPage < pageCount - 1) {
      onPage(currentPage + 1);
    } else {
      onPage(0);
    }
  };

  return (
    <>
      <View style={styles.paymentControls}>
        <Button
          appearance="ghost"
          style={styles.controlBtn}
          accessoryLeft={props => Icon(props, currLang === 'ar' ? 'arrow-circle-right-outline' : 'arrow-circle-left-outline')}
          onPress={handlePrev}
        />
        {renderDots()}
        <Button
          appearance="ghost"
          style={styles.controlBtn}
          accessoryLeft={props => Icon(props, currLang === 'ar' ? 'arrow-circle-left-outline' : 'arrow-circle-right-outline')}
          onPress={handleNext}
        />
      </View>
    </>
  );
};

Pagination.propTypes = {
};

Pagination.defaultProps = {
};

export default Pagination;
