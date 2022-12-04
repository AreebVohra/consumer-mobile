/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable arrow-body-style */
import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import {
  AccordionList,
} from 'accordion-collapse-react-native';
import styles from './styles';

const TileSelector = ({
  list,
  itemKey,
  renderHeader,
  renderBody,
  defaultIndex,
  onToggle,
  isDisabled,
}) => {
  return (
    <AccordionList
      style={styles.accordion}
      list={list}
      header={renderHeader}
      body={renderBody}
      onToggle={onToggle}
      keyExtractor={itemKey}
      expandedIndex={defaultIndex}
      isDisabled={isDisabled}
    />
  );
};

TileSelector.propTypes = {
  list: PropTypes.arrayOf(PropTypes.shape({})),
  itemKey: PropTypes.func,
  renderHeader: PropTypes.func,
  renderBody: PropTypes.func,
  defaultIndex: PropTypes.number,
  onToggle: PropTypes.func,
  isDisabled: PropTypes.func,
};

TileSelector.defaultProps = {
  list: [],
  itemKey: () => {},
  renderHeader: () => {},
  renderBody: () => {},
  defaultIndex: 0,
  onToggle: () => {},
  isDisabled: () => {},
};

export default TileSelector;
