/* eslint-disable no-multiple-empty-lines */
import React, { useEffect, useRef, useState } from 'react';
import { View, Image, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch, useSelector } from 'react-redux';
import FlashMessage from 'react-native-flash-message';

import { StatusBar } from 'expo-status-bar';

import { postTMSession, patchTMSessionUser } from 'api';
import LoginAndRegistration from 'pages/loginAndRegistration';
import config from 'utils/config';
import { alpha3FromISDPhoneNumber } from 'utils/convertCurrency';
import { getNfcHardwareStatus } from 'reducers/nfcId';
import { setTMSessionString } from 'reducers/application';
import { updateInitPushToken } from 'reducers/pushNotification';
import RootNavigator from '../../../rootNavigator';

export default () => {
  // Do not remove: although not used it triggers re-render on Language change
  const currLang = useSelector(state => state.language.language);
  const { tmSessionString } = useSelector(state => state.application);
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const pushToken = useSelector(state => state.pushNotification.token);
  const Lean = useRef(null);
  // #TODO: default this to false when we get pushNotification deepLinking to work on ios
  const [notificationDeeplinkResolved, setNotificationDeeplinkResolved] = useState(Platform.OS === 'ios');
  const [netcoreDeeplink, setNetcoreDeeplink] = useState(null);

  const dispatch = useDispatch();

  const { currentUser } = useSelector(state => state.application);
  const { phoneNumber } = currentUser;
  const userCountry = alpha3FromISDPhoneNumber(phoneNumber);

  const { nfcHardwareStatusResolved } = useSelector(state => state.nfcId);
  const Smartech = require('smartech-reactnative-module');

  Smartech.getDeepLinkUrl((data) => {
    if (data && data.deeplink) {
      setNetcoreDeeplink(data.deeplink);
    }
    setNotificationDeeplinkResolved(true);
  });


  const tmjs = `
    const consoleLog = (type, log) => window.ReactNativeWebView.postMessage(JSON.stringify({'type': 'Console', 'data': {'type': type, 'log': log}}));
    console = {
        log: (log) => consoleLog('log', log),
        debug: (log) => consoleLog('debug', log),
        info: (log) => consoleLog('info', log),
        warn: (log) => consoleLog('warn', log),
        error: (log) => consoleLog('error', log),
      };

    var threatmetrix=threatmetrix||{};threatmetrix.version=4,threatmetrix.create_url=function(t,e,r,n,c){function i(){return Math.floor(2742745743359*Math.random())}function a(){return o(i())}function o(t){return(t+78364164096).toString(36)}var m=i(),u=i(),l=885187064159;u=((u=u-u%256+threatmetrix.version)+m)%2742745743359,l=(l+m)%2742745743359;var s="https://"+t+"/"+(m=a()+o(m))+e,h=[(u=o(l)+o(u))+"="+r,a()+a()+"="+n];return void 0!==c&&c.length>0&&h.push(a()+a()+"="+c),s+"?"+h.join("&")},threatmetrix.beacon=function(t,e,r,n){var c="turn:aa.online-metrix.net?transport=",i="1:"+e+":"+r,a={iceServers:[{urls:c+"tcp",username:i,credential:r},{urls:c+"udp",username:i,credential:r}]};try{var o=new RTCPeerConnection(a);o.createDataChannel(Math.random().toString());var m=function(){},u=function(t){o.setLocalDescription(t,m,m)};"undefined"==typeof Promise||o.createOffer.length>0?o.createOffer(u,m):o.createOffer().then(u,m),setInterval(function(){o.close()},1e4)}catch(t){}},threatmetrix.load_tags=function(t,e,r,n){threatmetrix.beacon(t,e,r,n);var c=document.getElementsByTagName("head").item(0),i=document.createElement("script");i.id="tmx_tags_js",i.setAttribute("type","text/javascript");var a=threatmetrix.create_url(t,".js",e,r,n);i.setAttribute("src",a),threatmetrix.set_csp_nonce(i),c.appendChild(i)},threatmetrix.csp_nonce=null,threatmetrix.register_csp_nonce=function(t){if(void 0!==t.currentScript&&null!==t.currentScript){var e=t.currentScript.getAttribute("nonce");null!=e&&""!==e?threatmetrix.csp_nonce=e:void 0!==t.currentScript.nonce&&null!==t.currentScript.nonce&&""!==t.currentScript.nonce&&(threatmetrix.csp_nonce=t.currentScript.nonce)}},threatmetrix.set_csp_nonce=function(t){null!==threatmetrix.csp_nonce&&(t.setAttribute("nonce",threatmetrix.csp_nonce),t.getAttribute("nonce")!==threatmetrix.csp_nonce&&(t.nonce=threatmetrix.csp_nonce))},threatmetrix.cleanup=function(){for(;null!==(hp_frame=document.getElementById("tdz_ifrm"));)hp_frame.parentElement.removeChild(hp_frame);for(;null!==(tmx_frame=document.getElementById("tmx_tags_iframe"));)tmx_frame.parentElement.removeChild(tmx_frame);for(;null!==(tmx_script=document.getElementById("tmx_tags_js"));)tmx_script.parentElement.removeChild(tmx_script)},threatmetrix.profile=function(t,e,r,n){void 0!==t&&void 0!==e&&void 0!==r&&8===e.length&&(threatmetrix.cleanup(),threatmetrix.register_csp_nonce(document),threatmetrix.load_tags(t,e,r,n))};var spotiie33d76b = threatmetrix ? threatmetrix.profile : null;
    
    spotiie33d76b("h.online-metrix.net", "${config('tm_org_id')}", "${tmSessionString}")
`;


  const onMessage = (payload) => {
    let dataPayload;
    try {
      dataPayload = JSON.parse(payload.nativeEvent.data);
    } catch (e) {
      console.error('native event parsing error', e);
    }

    if (dataPayload) {
      if (dataPayload.type === 'Console') {
        console.info(`[Console] ${JSON.stringify(dataPayload.data)}`);
      } else {
        console.log(dataPayload);
      }
    }
  };


  useEffect(() => {
    const setupTmUser = async () => {
      try {
        const resp = await patchTMSessionUser(tmSessionString);
      } catch (e) {
        console.error('profiling step error', e);
      }
    };

    if (tmSessionString && isLoggedIn) {
      setupTmUser();
    }
  }, [tmSessionString, isLoggedIn]);


  useEffect(() => {
    const setupTm = async () => {
      try {
        const resp = await postTMSession();
        dispatch(setTMSessionString(resp.session_id));
      } catch (e) {
        console.error('profiling step error', e);
      }
    };

    if (!tmSessionString) {
      setupTm();
    }
  }, [tmSessionString]);


  // on login update push token to have a specific user associated with it
  useEffect(() => {
    if (isLoggedIn && pushToken) {
      dispatch(updateInitPushToken());
    }
  }, [pushToken, isLoggedIn]);


  useEffect(() => {
    if (!nfcHardwareStatusResolved) {
      dispatch(getNfcHardwareStatus(userCountry));
    }
  }, [nfcHardwareStatusResolved, userCountry]);


  return (
    <>
      { notificationDeeplinkResolved ? (
        <>
          <StatusBar style="dark" />
          {isLoggedIn ? <RootNavigator leanRef={Lean} netcoreDeeplink={netcoreDeeplink} /> : <LoginAndRegistration />}
          <FlashMessage position="top" hideOnPress duration={4000} />
          {tmSessionString && (
          <View style={{ display: 'none' }}>
            <WebView
              injectedJavaScript={tmjs}
              javaScriptEnabled
              cacheEnabled={false}
              onMessage={onMessage}
            />
          </View>
          )}
        </>
      ) : (
        <View style={{ flex: 1, backgroundColor: '#AA8FFF' }}>
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
            }}
            source={require('assets/staticSplash.png')}
          />
        </View>
      ) }
    </>
  );
};
