import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Button,
  Text,
  Linking,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {
  Camera,
  FlashMode,
  CameraType,
  requestCameraPermissionsAsync,
} from 'expo-camera';
import Video from 'react-native-video';
import RNFS from 'react-native-fs';

const CAMERA_STATE = Object.freeze({
  active: 0,
  recording: 1,
  paused: 2,
});

const HeartRateMonitorTimeLimitSecs = 5;

export default function CameraView({navigation}) {
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasFileSystemPermission, setHasFileSystemPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const video = useRef(null);
  const [cameraState, setCameraState] = useState(CAMERA_STATE.active);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const [message, setMessage] = useState('');

  const {HeartRateMonitorModule} = NativeModules;
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
      try {
        const cameraPermission = await Camera.requestCameraPermissionsAsync();
        console.log('Camera permission status:', cameraPermission);
        setHasCameraPermission(cameraPermission.status === 'granted');
        if (cameraPermission === 'denied') await Linking.openSettings();

        const microphonePermission =
          await Camera.requestMicrophonePermissionsAsync();
        console.log('Microphone permission status:', microphonePermission);
        setHasAudioPermission(microphonePermission.status === 'granted');
        if (microphonePermission === 'denied') await Linking.openSettings();

        const fileSystemPermission = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);
        console.log('File System permission status:', fileSystemPermission);
        setHasFileSystemPermission(fileSystemPermission.status === 'granted');
        if (fileSystemPermission === 'denied') await Linking.openSettings();
      } catch (e) {
        console.error(e);
      } finally {
        // HeartRateMonitorModule?.processVideo('test');
      }
    }

    getPermission();
    const videoPath =
      RNFS.ExternalStorageDirectoryPath + '/HeartRateTempVideo.mp4';

    // RNFS.exists(videoPath)
    //   .then(exist => console.log('video path path exist:', exist))
    //   .catch(e => console.error(e));
    // HeartRateMonitorModule.foo();

    // RNFS.exists('android/app/src/main/assets').then(exist => console.log('file path exist:',exist)).catch(e=>console.error(e));
    // requestStorageVideoPermissions();
    // HeartRateMonitorModule?.foo();
  }, []);

  useEffect(() => {
    console.log('heartRate=', heartRate);
  }, [heartRate]);

  // const turnFlash = fm => {
  //   if (flashMode !== fm) {
  //     setFlashMode(fm);
  //   }
  // };

  const onRecordPress = async () => {
    console.log('onrecordPress: ', cameraState);
    if (camera) {
      if (cameraState === CAMERA_STATE.active) {
        setFlashMode(FlashMode.torch);

        setCameraState(CAMERA_STATE.recording);

        setMessage('Now recording heart rate');
        camera
          .recordAsync({
            maxDuration: HeartRateMonitorTimeLimitSecs,
          })
          .then(data => {
            // console.log(JSON.stringify(data, null, 4));
            console.log(data?.uri);
            setRecord(data?.uri);
            setMessage('Recorded heart rate, processing...');
            // console.log('after recording done');

            // HeartRateMonitorModule?.convertMediaUriToPath('adda');
            // HeartRateMonitorModule?.processVideo(data.uri);
            // let p = null;
            // HeartRateMonitorModule.processVideo(data.uri);
            // console.log(p);
            const videoPath =
              RNFS.ExternalStorageDirectoryPath + '/HeartRateTempVideo.mp4';
            RNFS.moveFile(data.uri, videoPath)
              .then(() => console.log('moveFile done!'))
              .catch(e => console.error(e))
              .finally(() => {
                // Now 'videoPath' contains the path to the saved video
                console.log('Video saved at:', videoPath);
                HeartRateMonitorModule.extractFrames((res, rate) => {
                  setHeartRate(rate);
                  setMessage(`Your Heart Rate is: ${rate} bpm`);
                  console.log(
                    'HeartRateMonitorModule.extractFrames:rate=',
                    rate,
                    'result = ',
                    res,
                  );
                });
              });
          })
          .catch(e => console.error(e))
          .finally(() => {
            console.log('finally');
            setFlashMode(FlashMode.off);
            setCameraState(CAMERA_STATE.active);
          });
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
          {/* {record && (
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
          )} */}
          <Text style={styles.heartRatetext}>{message}</Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title={
            cameraState === CAMERA_STATE.active
              ? 'Measure Heart Rate'
              : 'Stop Recording'
          }
          onPress={onRecordPress}
        />
        {/* <Button
          title={
            flashMode !== FlashMode.on ? 'Turn on Flash' : 'Turn off Flash'
          }
          onPress={__handleFlashMode}
        /> */}
        {/* <View style={styles.buttonHalfContainer}>
          <Button
            title={!isVideoPaused ? 'Pause' : 'Play'}
            onPress={() => setIsVideoPaused(_isVideoPaused => !_isVideoPaused)}
          />
        </View> */}
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
    // width: 200,
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
  heartRatetext: {
    fontSize: 24,
    padding: 20,
    flex: 1,
  },
});
