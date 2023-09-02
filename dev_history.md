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
