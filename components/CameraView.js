import React, {useEffect, useState, useRef} from 'react';
import {View, StyleSheet, Button, Text, Linking} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Camera, FlashMode, CameraType} from 'expo-camera';
import Video from 'react-native-video';

const CAMERA_STATE = Object.freeze({
  active: 0,
  recording: 1,
  paused: 2,
});

export default function CameraView({navigation}) {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const video = useRef(null);
  const [cameraState, setCameraState] = useState(CAMERA_STATE.active);
  const [isVideoPaused, setIsVideoPaused] = useState(false);

  const isFocussed = useIsFocused();

  const [flashMode, setFlashMode] = React.useState(FlashMode.off);

  const __handleFlashMode = () => {
    if (flashMode === FlashMode.on) {
      setFlashMode(FlashMode.off);
    } else if (flashMode === FlashMode.off) {
      setFlashMode(FlashMode.torch);
    } else {
      setFlashMode(FlashMode.auto);
    }
  };

  useEffect(() => {
    async function getPermission() {
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      console.log('Camera permission status:', cameraPermission);
      setHasCameraPermission(cameraPermission.status === 'granted');
      if (cameraPermission === 'denied') await Linking.openSettings();

      const microphonePermission =
        await Camera.requestMicrophonePermissionsAsync();
      console.log('Microphone permission status:', microphonePermission);
      setHasAudioPermission(microphonePermission.status === 'granted');
      if (microphonePermission === 'denied') await Linking.openSettings();
    }
    getPermission();
  }, []);

  const onRecordPress = async () => {
    console.log('onrecordPress: ', cameraState);
    if (camera) {
      if (cameraState === CAMERA_STATE.active) {
        setFlashMode(FlashMode.torch);

        setCameraState(CAMERA_STATE.recording);

        const data = await camera.recordAsync({
          maxDuration: 45,
        });
        console.log('after recording done');

        setRecord(data.uri);
        console.log(data.uri);
      } else {
        setFlashMode(FlashMode.off);
        camera.stopRecording();
        setCameraState(CAMERA_STATE.active);
        console.log('after setting state:', cameraState);
      }
    }
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <Text>Permissions are null</Text>;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.containerView}>
      <View style={styles.cameraVideoContainer}>
        <View style={styles.cameraContainer}>
          {isFocussed && (
            <Camera
              flashMode={flashMode}
              ref={ref => setCamera(ref)}
              style={styles.fixedRatio}
              cameraType={CameraType.back}
            />
          )}
        </View>
        <View style={styles.cameraContainer}>
          <Video
            ref={video}
            style={styles.video}
            source={{
              uri: record,
            }}
            useNativeControls
            resizeMode="contain"
            paused={isVideoPaused}
            onPlaybackStatusUpdate={status =>
              console.log('onPlaybackStatusUpdate:', status)
            }
          />
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title={
            cameraState === CAMERA_STATE.active
              ? 'Start Recording'
              : 'Stop Recording'
          }
          onPress={onRecordPress}
        />
        <Button
          title={
            flashMode !== FlashMode.on ? 'Turn on Flash' : 'Turn off Flash'
          }
          onPress={__handleFlashMode}
        />
        <View style={styles.buttonHalfContainer}></View>
        <View style={styles.buttonHalfContainer}>
          <Button
            title={!isVideoPaused ? 'Pause' : 'Play'}
            onPress={() => setIsVideoPaused(_isVideoPaused => !_isVideoPaused)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  containerView: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    // backgroundColor: 'red',
  },
  cameraVideoContainer: {
    flexDirection: 'row',
    // backgroundColor: 'green',
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    height: 300,
    // backgroundColor: 'blue',
  },
  fixedRatio: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonHalfContainer: {
    flex: 1,
  },
});
