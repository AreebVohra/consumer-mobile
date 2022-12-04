/* eslint-disable no-unused-expressions */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
import React, { useState, useEffect, useRef } from 'react';
import { View, TouchableOpacity, ImageBackground, BackHandler, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';
import PropTypes from 'prop-types';
import { t } from 'services/i18n';
import { Layout, Text } from '@ui-kitten/components';
import config from 'utils/config';
import styles from './styles';

const WhereItWorks = ({ whereItWorksBottomSheetRef, isGiftCardLec }) => {
  let mapRef = useRef(null);
  const selectedLocationRef = useRef(null);
  const currLang = useSelector((state) => state.language.language);
  const isRTL = currLang === 'ar';

  const [locationStatus, requestPermission] = Location.useForegroundPermissions();
  const [destinationLocation, setDestinationLocation] = useState({});
  const [clickedLocation, setClickedLocation] = useState(null);
  const [userLocation, setUserLocation] = useState({
    latitude: 25.276987,
    longitude: 55.296249,
    latitudeDelta: 2,
    longitudeDelta: 2,
  });
  const collectionPointsCoords = !isGiftCardLec ? [
    {
      mapKey: 1,
      name: t('common.mallOfTheEmirates'),
      directions: t('common.mallOfTheEmiratesLocation'),
      img: require('assets/mallOfTheEmirates.png'),
      latitude: 25.1181118,
      longitude: 55.1984193,
    },
    {
      mapKey: 2,
      name: t('common.cityCenterAjman'),
      directions: t('common.cityCenterAjmanLocation'),
      img: require('assets/cityCenterAjman.png'),
      latitude: 25.3995489,
      longitude: 55.4770317,
    },
    {
      mapKey: 3,
      name: t('common.cityCenterDeira'),
      directions: t('common.cityCenterDeiraLocation'),
      img: require('assets/cityCenterDeira.png'),
      latitude: 25.2519707,
      longitude: 55.330614,
    },
    {
      mapKey: 4,
      name: t('common.cityCenterFujairah'),
      directions: t('common.cityCenterFujairahLocation'),
      img: require('assets/cityCenterFujairah.png'),
      latitude: 25.1254265,
      longitude: 56.3000392,
    },
    {
      mapKey: 5,
      name: t('common.cityCenterMeaisem'),
      directions: t('common.cityCenterMeaisemLocation'),
      img: require('assets/cityCenterMeaisem.png'),
      latitude: 25.0403461,
      longitude: 55.194627,
    },
    {
      mapKey: 6,
      name: t('common.cityCenterMirdif'),
      directions: t('common.cityCenterMirdifLocation'),
      img: require('assets/cityCenterMirdif.png'),
      latitude: 25.2163238,
      longitude: 55.4056062,
    },
    {
      mapKey: 7,
      name: t('common.cityCenterSharjah'),
      directions: t('common.cityCenterSharjahLocation'),
      img: require('assets/cityCenterSharjah.png'),
      latitude: 25.3247312,
      longitude: 55.3912575,
    },
  ] : [
    {
      mapKey: 1,
      name: t('common.mallOfTheEmirates'),
      // name: t('common.voxCinema'),
      directions: t('common.mallOfTheEmiratesLocation'),
      img: require('assets/voxCinemas.png'),
      latitude: 25.1181118,
      longitude: 55.1984193,
      locations: [
        {
          mapKey: 7,
          name: t('common.abuDubaiMall'),
          directions: t('common.abuDhabiMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 24.49609982,
          longitude: 54.3832044,
          locations: [],
        },
        {
          mapKey: 8,
          name: t('common.cityCenterAjman'),
          directions: t('common.cityCenterAjmanLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.3995489,
          longitude: 55.4770317,
          locations: [],
        },
        {
          mapKey: 9,
          name: t('common.hamraMall'),
          directions: t('common.hamraMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.6840944,
          longitude: 55.7818768,
          locations: [],
        },
        {
          mapKey: 10,
          name: t('common.jimiMall'),
          directions: t('common.jimiMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 24.2435518,
          longitude: 55.7265264,
          locations: [],
        },
        {
          mapKey: 11,
          name: t('common.galleria'),
          directions: t('common.galleriaLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 24.501525,
          longitude: 54.389659,
          locations: [],
        },
        {
          mapKey: 12,
          name: t('common.burjumanMall'),
          directions: t('common.burjumanMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.253420,
          longitude: 55.302239,
          locations: [],
        },
        {
          mapKey: 13,
          name: t('common.grandHyatt'),
          directions: t('common.grandHyattLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.227341,
          longitude: 55.326474,
          locations: [],
        },
        {
          mapKey: 14,
          name: t('common.cityCenterDeira'),
          directions: t('common.cityCenterDeiraLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.2519707,
          longitude: 55.330614,
          locations: [],
        },
        {
          mapKey: 15,
          name: t('common.cityCenterFujairah'),
          directions: t('common.cityCenterFujairahLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.1254265,
          longitude: 56.3000392,
          locations: [],
        },
        {
          mapKey: 16,
          name: t('common.cityCenterMirdif'),
          directions: t('common.cityCenterMirdifLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.2163238,
          longitude: 55.4056062,
          locations: [],
        },
        {
          mapKey: 17,
          name: t('common.mercatoMall'),
          directions: t('common.mercatoMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.216704,
          longitude: 55.253008,
          locations: [],
        },
        {
          mapKey: 18,
          name: t('common.nationTowersMall'),
          directions: t('common.nationTowerMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 24.464463,
          longitude: 54.328665,
          locations: [],
        },
        {
          mapKey: 19,
          name: t('common.nakheelMall'),
          directions: t('common.nakheelMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.114689,
          longitude: 55.138553,
          locations: [],
        },
        {
          mapKey: 20,
          name: t('common.cityCenterSharjah'),
          directions: t('common.cityCenterSharjahLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.3247312,
          longitude: 55.3912575,
          locations: [],
        },
        {
          mapKey: 21,
          name: t('common.cityCenterShindagha'),
          directions: t('common.cityCenterShindaghaLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.3247312,
          longitude: 55.3912575,
          locations: [],
        },
        {
          mapKey: 22,
          name: t('common.yasMall'),
          directions: t('common.yasMallLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 24.488985,
          longitude: 54.608625,
          locations: [],
        },
        {
          mapKey: 23,
          name: t('common.cityCenterZahia'),
          directions: t('common.cityCenterZahiaLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.315804,
          longitude: 55.454011,
          locations: [],
        },
        {
          mapKey: 34,
          name: t('common.mallOfTheEmirates'),
          directions: t('common.mallOfTheEmiratesLocation'),
          img: require('assets/voxCinemas.png'),
          latitude: 25.1181118,
          longitude: 55.1984193,
        },
      ],
    },
    {
      mapKey: 2,
      name: t('common.mallOfTheEmirates'),
      // name: t('common.skiDubai'),
      directions: t('common.mallOfTheEmiratesLocation'),
      img: require('assets/skiDubai.png'),
      latitude: 25.1181118,
      longitude: 55.1984193,
      locations: [],
    },
    {
      mapKey: 3,
      name: t('common.cityCenterMirdif'),
      // name: t('common.iFly'),
      directions: t('common.cityCenterMirdifLocation'),
      img: require('assets/iFly.png'),
      latitude: 25.2163238,
      longitude: 55.4056062,
      locations: [],
    },
    {
      mapKey: 4,
      name: t('common.mallOfTheEmirates'),
      // name: t('common.dreamscape'),
      directions: t('common.mallOfTheEmiratesLocation'),
      img: require('assets/dreamscape.png'),
      latitude: 25.1181118,
      longitude: 55.1984193,
      locations: [],
    },
    {
      mapKey: 5,
      name: t('common.cityCenterDeira'),
      // name: t('common.magicPlanet'),
      directions: t('common.cityCenterDeiraLocation'),
      img: require('assets/magicPlanet.png'),
      latitude: 25.2519707,
      longitude: 55.330614,
      locations: [
        {
          mapKey: 24,
          name: t('common.cityCenterDeira'),
          directions: t('common.cityCenterDeiraLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.2519707,
          longitude: 55.330614,
          locations: [],
        },
        {
          mapKey: 25,
          name: t('common.burjumanMall'),
          directions: t('common.burjumanMallLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.253420,
          longitude: 55.302239,
          locations: [],
        },
        {
          mapKey: 26,
          name: t('common.cityCenterAjman'),
          directions: t('common.cityCenterAjmanLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.3995489,
          longitude: 55.4770317,
          locations: [],
        },
        {
          mapKey: 27,
          name: t('common.cityCenterMirdif'),
          directions: t('common.cityCenterMirdifLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.2163238,
          longitude: 55.4056062,
          locations: [],
        },
        {
          mapKey: 28,
          name: t('common.cityCenterFujairah'),
          directions: t('common.cityCenterFujairahLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.1254265,
          longitude: 56.3000392,
          locations: [],
        },
        {
          mapKey: 29,
          name: t('common.cityCenterSharjah'),
          directions: t('common.cityCenterSharjahLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.3247312,
          longitude: 55.3912575,
          locations: [],
        },
        {
          mapKey: 30,
          name: t('common.cityCenterZahia'),
          directions: t('common.cityCenterZahiaLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.315804,
          longitude: 55.454011,
          locations: [],
        },
        {
          mapKey: 31,
          name: t('common.jimiMall'),
          directions: t('common.jimiMallLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 24.2435518,
          longitude: 55.7265264,
          locations: [],
        },
        {
          mapKey: 32,
          name: t('common.marinaMall'),
          directions: t('common.marinaMallLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 24.476244,
          longitude: 54.321546,
          locations: [],
        },
        {
          mapKey: 33,
          name: t('common.cityCenterMeaisem'),
          directions: t('common.cityCenterMeaisemLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.0403461,
          longitude: 55.194627,
          locations: [],
        },
        {
          mapKey: 34,
          name: t('common.mallOfTheEmirates'),
          directions: t('common.mallOfTheEmiratesLocation'),
          img: require('assets/magicPlanet.png'),
          latitude: 25.1181118,
          longitude: 55.1984193,
          locations: [],
        },
      ],
    },
    {
      mapKey: 6,
      name: t('common.cityCenterMirdif'),
      // name: t('common.littleExplorers'),
      directions: t('common.cityCenterMirdifLocation'),
      img: require('assets/littleExplorers.png'),
      latitude: 25.2163238,
      longitude: 55.4056062,
      locations: [],
    },
  ];

  useEffect(() => {
    const backAction = () => {
      whereItWorksBottomSheetRef.current.close();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(async () => {
    if (locationStatus && locationStatus.granted) {
      const { coords } = await Location.getCurrentPositionAsync();
      setUserLocation({
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.09,
        longitudeDelta: 0.035,
      });
    } else if (!locationStatus || locationStatus.canAskAgain) {
      requestPermission();
    }
  }, [locationStatus]);

  // const openMap = (coords) => {
  //   const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
  //   const latLng = `${coords.latitude},${coords.longitude}`;
  //   const label = coords.name;

  //   const url = Platform.select({
  //     ios: `${scheme}${label}@${latLng}`,
  //     android: `${scheme}${latLng}(${label})`,
  //   });

  //   Linking.openURL(url);
  // };

  return (
    <Layout style={{ flex: 1, borderRadius: 0 }} level="2">
      <ScrollView ref={selectedLocationRef} overScrollMode="never" style={{ flex: 1, flexDirection: 'column', height: '100%' }}>
        <View style={[styles.mapContainer, { paddingVertical: 15 }]}>
          <MapView
            provider={PROVIDER_GOOGLE}
            region={Object.keys(destinationLocation).length === 0 ? userLocation : destinationLocation}
            showsUserLocation
            showsCompass
            showsMyLocationButton={locationStatus && locationStatus.granted}
            followsUserLocation
            style={styles.map}
            ref={(map) => {
              mapRef = map;
            }}
          >
            {locationStatus && locationStatus.granted && (
              <MapViewDirections
                origin={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
                destination={destinationLocation}
                apikey={config('google_api_key')}
                strokeWidth={3}
                strokeColor="#353535"
              />
            )}
            {collectionPointsCoords.map((cpc) => (
              (!cpc.locations || (cpc.locations && cpc.locations.length === 0) ? (
                <Marker key={cpc.mapKey} coordinate={{ latitude: cpc.latitude, longitude: cpc.longitude }}>
                  {/* <Callout onPress={(e) => openMap(cpc)}> */}
                  <Callout>
                    <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                      <Text category="s1">{cpc.name}</Text>
                      <Text category="p2" style={{ textAlign: 'center', marginVertical: 5, maxWidth: 200 }}>
                        {cpc.directions}
                      </Text>
                    </View>
                  </Callout>
                </Marker>
              ) : (
                cpc.locations.map((loc) => (
                  <Marker key={loc.mapKey} coordinate={{ latitude: loc.latitude, longitude: loc.longitude }}>
                    <Callout>
                      <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <Text category="s1">{loc.name}</Text>
                        <Text category="p2" style={{ textAlign: 'center', marginVertical: 5, maxWidth: 200 }}>
                          {loc.directions}
                        </Text>
                      </View>
                    </Callout>
                  </Marker>
                ))
              )
              )
            ))}
          </MapView>
        </View>

        <View style={{ paddingTop: 15, paddingHorizontal: 15 }}>
          <Text category="h6" style={[{ textAlign: isRTL ? 'right' : 'left' }]}>
            {t('common.collectionPoint')}
          </Text>
          <Text style={[styles.subText, { marginTop: 5, textAlign: isRTL ? 'right' : 'left' }]}>{!isGiftCardLec ? t('common.pleasePresentGC') : t('common.pleasePresentLEC')}</Text>
        </View>

        <ScrollView overScrollMode="never" horizontal style={{ marginHorizontal: 5 }}>
          {collectionPointsCoords.map((cpc) => (
            <TouchableOpacity
              key={cpc.mapKey}
              onPress={() => {
                if (!cpc.locations || (cpc.locations && cpc.locations.length === 0)) {
                  mapRef.animateToRegion({
                    latitude: cpc.latitude,
                    longitude: cpc.longitude,
                    latitudeDelta: 0.09,
                    longitudeDelta: 0.035,
                  });

                  if (locationStatus && locationStatus.granted) {
                    setTimeout(() => {
                      setDestinationLocation({
                        latitude: cpc.latitude,
                        longitude: cpc.longitude,
                        latitudeDelta: 0.09,
                        longitudeDelta: 0.035,
                      });
                    }, 1000);
                  }
                  if (Platform.OS === 'android') {
                    setClickedLocation(null);
                  }
                  if (cpc.locations) {
                    setTimeout(() => selectedLocationRef.current.scrollTo({ x: '10%', y: '10%', animated: true }), 0);
                  }
                } else {
                  setTimeout(() => selectedLocationRef.current.scrollToEnd({ duration: 500, animated: true }), 0);
                  setClickedLocation(cpc);
                }
              }}
              style={{
                backgroundColor: isGiftCardLec ? 'white' : null,
                marginHorizontal: 5,
                marginVertical: 15,
                borderWidth: isGiftCardLec ? 1 : null,
                borderColor: isGiftCardLec ? '#CCC' : null,
              }}
            >
              <ImageBackground
                style={{
                  flex: 1,
                  width: 110,
                  height: 110,
                  resizeMode: 'contain',
                }}
                source={cpc.img}
              />
              <Text
                category="s1"
                style={[
                  {
                    color: 'white',
                    position: 'absolute',
                    bottom: 5,
                    left: 5,
                    width: 85,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {!isGiftCardLec && cpc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <ScrollView overScrollMode="never" horizontal style={{ marginHorizontal: 5 }} contentContainerStyle={{ flexGrow: 1 }}>
          {clickedLocation && clickedLocation.locations && clickedLocation.locations.length && clickedLocation.locations.map((cpc) => (
            <TouchableOpacity
              key={cpc.mapKey}
              onPress={() => {
                if (locationStatus && locationStatus.granted) {
                  setTimeout(() => {
                    setDestinationLocation({
                      latitude: cpc.latitude,
                      longitude: cpc.longitude,
                      latitudeDelta: 0.09,
                      longitudeDelta: 0.035,
                    });
                  }, 1000);
                }
                mapRef.animateToRegion({
                  latitude: cpc.latitude,
                  longitude: cpc.longitude,
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.035,
                });
              }}
              style={clickedLocation && cpc.mapKey === clickedLocation.mapKey ? {
                backgroundColor: 'white',
                marginHorizontal: 10,
                marginVertical: 15,
                borderWidth: 2,
                borderColor: '#AA8FFF',
              } : {
                backgroundColor: 'white',
                marginHorizontal: 10,
                marginVertical: 15,
                borderColor: '#FFFFFF',
                borderWidth: 2,
              }}
            >
              <ImageBackground
                style={{
                  flex: 1,
                  width: 110,
                  height: 110,
                  resizeMode: 'contain',
                  backgroundColor: 'black',
                }}
                imageStyle={{ opacity: 0.4 }}
                source={cpc.img}
              />
              <Text
                category="s1"
                style={[
                  {
                    color: 'white',
                    position: 'absolute',
                    bottom: 5,
                    left: 5,
                    width: 85,
                    textAlign: isRTL ? 'right' : 'left',
                  },
                ]}
              >
                {cpc.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

      </ScrollView>
    </Layout>
  );
};

WhereItWorks.propTypes = {
  whereItWorksBottomSheetRef: PropTypes.shape({
    current: PropTypes.shape({
      present: PropTypes.func,
      close: PropTypes.func,
    }),
  }),
  isGiftCardLec: PropTypes.bool,
};

WhereItWorks.defaultProps = {
  whereItWorksBottomSheetRef: null,
  isGiftCardLec: false,
};

export default WhereItWorks;
