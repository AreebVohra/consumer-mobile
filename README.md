# consumer-mobile

# Must Read
While in local development (connecting to auth and api locally on ports 8000, 8003) login will not work unless react-native-debugger is running on port 19001 with enable "Enable Network Inspect" setting turned on.

while in local development image upload for ios will not work if network inspect is enabled (it can be switched off after fist successful login)
for android it will not work in any case - to test it is advised that an internal release is created and that upload is tested on a downloaded version of the app.

## Build
Please take extra care when building and publishing for profiles other than development.

Also PACKAGES_GITHUB_TOKEN must be set in your bash profile (Github private access token PAT)

eas build --profile development --platform android
eas build --profile development --platform ios


## Publish only 




# Install Dependencies
npm login --scope=@spotii-me --registry=https://npm.pkg.github.com
yarn install / expo install

# Running
npx react-native run-ios --udid <phone-uuid>
npx react-native run-android


# Login
While in development login will not work unless react-native-debugger is running on port 19001 with enable "Enable Network Inspect" setting turned on.
