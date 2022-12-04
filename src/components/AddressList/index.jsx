/* eslint-disable arrow-body-style */
import React from 'react';
import { t } from 'services/i18n';
import Icon from 'components/Icon';
import {
  List,
  ListItem,
  Button,
  Text,
} from '@ui-kitten/components';
import styles from './styles';

const Profile = ({ list, setDefaultAddressVisible, setCurrentAddress }) => {
  const data = list.map(item => {
    return {
      title: `${item.address1},`,
      description: `${item.city}, ${item.country === 'ARE' ? 'UAE' : item.country},\nP.O. Box ${item.zip}`,
      item,
    };
  });

  const renderItemAccessory = (props, item) => {
    if (item.isDefault) {
      return (
        <Button appearance="filled" disabled style={styles.badge} size="tiny">
          {evaProps => <Text {...evaProps} style={{ color: '#411361' }} category="h6">{t('common.default')}</Text>}
        </Button>
      );
    }
    return Icon({ ...props, onPress: () => { setCurrentAddress(item); setDefaultAddressVisible(true); } }, 'more-vertical');
  };

  const renderItem = ({ item }) => (
    <ListItem
      title={item.title}
      description={item.description}
      accessoryRight={props => renderItemAccessory(props, item.item)}
    />
  );

  return (
    <List
      style={styles.container}
      data={data}
      renderItem={renderItem}
    />
  );
};

Profile.propTypes = {
};

Profile.defaultProps = {
};

export default Profile;
