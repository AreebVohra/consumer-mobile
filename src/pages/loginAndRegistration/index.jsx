import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HowItWorks from 'pages/howItWorks';
import Support from 'pages/support';
import Shop from 'pages/shop';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { STACK_STEPS } from 'utils/constants';
import LoginForm from './loginForm';
import ChoosePhoneNumberForm from './loginOtp/choosePhoneNumberForm';
import LoginOtpForm from './loginOtp/loginOtpForm';
import CreateAccount from './createAccountForm/createAccount';
import PersonalProfile from './createAccountForm/personalProfile';
import UploadIdRegistration from './createAccountForm/uploadIdRegistration';
import ValidateUpload from './createAccountForm/validateUpload';
import Verify from './createAccountForm/verify';
import Welcome from './createAccountForm/welcome';
import PasswordRecoveryPhoneForm from './passwordRecovery/passwordRecoveryPhoneForm';
import RecoveryVerify from './passwordRecovery/verify';
import RecoveryDone from './passwordRecovery/recoveryDone';
import newPasswordForm from './passwordRecovery/newPasswordForm';
import SpotiiTour from './spotiiTour';
import Onboarding from './onboarding';

const LoginAndRegistrationScreen = props => {
  const Stack = createStackNavigator();

  const { stackStep } = props;

  switch (stackStep) {
    case STACK_STEPS.ID_UPLOAD: return (
      <>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <Stack.Navigator headerMode="none">
              <Stack.Screen name="UploadId" component={UploadIdRegistration} />
              <Stack.Screen name="ValidateUpload" component={ValidateUpload} />
              <Stack.Screen name="Welcome" component={Welcome} />
            </Stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </>
    );
    default: return (
      <>
        <BottomSheetModalProvider>
          <NavigationContainer>
            <Stack.Navigator headerMode="none">
              <Stack.Screen name="Onboarding" component={Onboarding} />
              <Stack.Screen name="ChoosePhoneNumberForm" component={ChoosePhoneNumberForm} />
              <Stack.Screen name="LoginOtpForm" component={LoginOtpForm} />
              <Stack.Screen name="LoginForm" component={LoginForm} />
              <Stack.Screen name="CreateAccount" component={CreateAccount} />
              <Stack.Screen name="PersonalProfile" component={PersonalProfile} />
              <Stack.Screen name="Verify" component={Verify} />
              <Stack.Screen name="UploadId" component={UploadIdRegistration} />
              <Stack.Screen name="ValidateUpload" component={ValidateUpload} />
              <Stack.Screen name="Welcome" component={Welcome} />
              <Stack.Screen name="PasswordRecoveryPhoneForm" component={PasswordRecoveryPhoneForm} />
              <Stack.Screen name="RecoveryVerify" component={RecoveryVerify} />
              <Stack.Screen name="newPasswordForm" component={newPasswordForm} />
              <Stack.Screen name="RecoveryDone" component={RecoveryDone} />
              <Stack.Screen name="HowItWorks" component={HowItWorks} />
              <Stack.Screen name="Support" component={Support} />
              <Stack.Screen name="SpotiiTour" component={SpotiiTour} />
              <Stack.Screen name="Shop" component={Shop} />
            </Stack.Navigator>
          </NavigationContainer>
        </BottomSheetModalProvider>
      </>
    );
  }
};

export default LoginAndRegistrationScreen;
