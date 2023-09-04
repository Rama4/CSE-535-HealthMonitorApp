# Development History for healthmonitor app

## Initial Commit

    npx react-native@latest init healthmonitor

    mkdir components

    yarn add react-redux redux redux-thunk @reduxjs/toolkit

https://reactnavigation.org/docs/getting-started/

As part of this guide, added this code in the class in MainActivity.java:

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
super.onCreate(null);
}
```

added this in the MainActivity.java:

```java
import android.os.Bundle;
```

https://blog.logrocket.com/react-native-navigation-tutorial/#using-stack-navigator

yarn add @react-navigation/native
yarn add react-native-screens react-native-safe-area-context
yarn add @react-navigation/native-stack

Added screens for home and symptom logging with the required buttons and lists.

Successfully runs on Android device.

## Add React-Native Vision Camera

https://www.react-native-vision-camera.com/docs/guides

    yarn add react-native-vision-camera

    npx pod-install

https://medium.com/@sisongqolosi/vision-camera-react-native-326b9dfb3188

[Tesla's RN camera Doesn't support video]
https://github.com/teslamotors/react-native-camera-kit
yarn add react-native-camera-kit

[using Expo camera]
https://github.com/expo/expo/tree/main/packages/expo-camera#installation-in-bare-react-native-projects

    npx install-expo-modules@latest

    npx expo install expo-camera

Added a few lines in the build.gradle and podfile for maven and permissions

Ran this to build and run on Android: `npx expo run:android`

Successfully runs on Android device.

## Record video with flash and play it

https://github.com/imrohit007/Video-Recording-React-Native-Expo/blob/main/App.js

https://www.smashingmagazine.com/2018/04/audio-video-recording-react-native-expo/

Add react-native-video package

yarn add react-native-video

Able to record videos using expo-camera and play/pause them (not persisting them).

Flash also working and configurable (it is turning on if we set FlashMode.torch, instead of FlashMode.on)
