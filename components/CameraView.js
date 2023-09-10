import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Linking,
  NativeModules,
  PermissionsAndroid,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Camera, FlashMode, CameraType, VideoQuality} from 'expo-camera';
import RNFS from 'react-native-fs';
import Button from './Button';

import {useSelector, useDispatch} from 'react-redux';
import {selectHeartRate, updateHeartRate} from './redux/slices/appSlice';

const CAMERA_STATE = Object.freeze({
  active: 0,
  recording: 1,
  paused: 2,
});

const VideoDurationSec = 45;
const HeartRateCalcThreshold = 1000;
const FrameTime = 750;
const HeightStart = 210;
const HeightEnd = 510;
const WidthStart = 140;
const WidthEnd = 340;

const CameraVideoRecordConfig = {
  maxDuration: VideoDurationSec,
  quality: VideoQuality['480p'],
};

export default function CameraView({navigation}) {
  const dispatch = useDispatch();
  const _heartRate = useSelector(selectHeartRate);

  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasFileSystemPermission, setHasFileSystemPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [showCamera, setShowCamera] = useState(false);
  const [record, setRecord] = useState(null);
  const [cameraState, setCameraState] = useState(CAMERA_STATE.active);
  const [cameraBtnDisabled, setCameraBtnDisabled] = useState(false);

  const [heartRate, setHeartRate] = useState(null);
  const [message, setMessage] = useState(
    'To measure heart rate, softly press your index finger on the camera lens while covering the flash light, and press the "Measure Heart rate" button',
  );

  const {HeartRateMonitorModule} = NativeModules;
  const isFocussed = useIsFocused();

  const [flashMode, setFlashMode] = React.useState(FlashMode.off);

  useEffect(() => {
    console.log('_heartRate = ', _heartRate);
  }, [_heartRate]);

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
      }
    }

    getPermission();
    const videoPath =
      RNFS.ExternalStorageDirectoryPath + '/HeartRateTempVideo.mp4';
  }, []);

  useEffect(() => {
    console.log('heartRate=', heartRate);
  }, [heartRate]);

  const onRecordPress = async () => {
    console.log('onrecordPress: ', cameraState);
    if (!showCamera) {
      setShowCamera(true);
    }
    if (camera) {
      if (cameraState === CAMERA_STATE.active) {
        setFlashMode(FlashMode.torch);

        setCameraState(CAMERA_STATE.recording);
        setCameraBtnDisabled(true);

        setMessage('Now recording heart rate');
        camera
          .recordAsync(CameraVideoRecordConfig)
          .then(data => {
            console.log(data?.uri);
            setRecord(data?.uri);
            setMessage('Recorded heart rate, processing...');

            const videoPath =
              RNFS.ExternalStorageDirectoryPath + '/HeartRateTempVideo.mp4';
            RNFS.moveFile(data.uri, videoPath)
              .then(() => console.log('moveFile done!'))
              .catch(e => console.error(e))
              .finally(() => {
                // Now 'videoPath' contains the path to the saved video
                console.log('Video saved at:', videoPath);
                HeartRateMonitorModule.calculateHeartRateFromVideo(
                  HeartRateCalcThreshold,
                  VideoDurationSec,
                  FrameTime,
                  HeightStart,
                  HeightEnd,
                  WidthStart,
                  WidthEnd,
                  (status, rate) => {
                    setCameraBtnDisabled(false);
                    setHeartRate(rate);
                    dispatch(updateHeartRate(rate));
                    setMessage(`Your Heart Rate is: ${rate} bpm`);
                    console.log(
                      'HeartRateMonitorModule.calculateHeartRateFromVideo:rate=',
                      rate,
                      'result = ',
                      status,
                    );
                  },
                );
              });
          })
          .catch(e => {
            console.error(e);
            setCameraBtnDisabled(false);
          })
          .finally(() => {
            console.log('finally');
            setFlashMode(FlashMode.off);
            setCameraState(CAMERA_STATE.active);
            setShowCamera(false);
            // if (!cameraBtnDisabled) setCameraBtnDisabled(false);
          });
      } else {
        setFlashMode(FlashMode.off);
        camera.stopRecording();
        setShowCamera(false);
        setCameraState(CAMERA_STATE.active);
        // setCameraBtnDisabled(false);
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
          {isFocussed && showCamera && (
            <Camera
              flashMode={flashMode}
              ref={ref => setCamera(ref)}
              style={styles.fixedRatio}
              cameraType={CameraType.back}
            />
          )}
        </View>
        <View style={styles.cameraContainer}>
          <Text style={[styles.heartRatetext, {fontWeight: 'bold'}]}>
            {message}
          </Text>
        </View>
      </View>
      <View style={styles.buttonsContainer}>
        <Button
          title={
            !showCamera
              ? 'Show Camera'
              : cameraState === CAMERA_STATE.active
              ? 'Measure Heart Rate'
              : 'Stop Recording'
          }
          onPress={onRecordPress}
          disabled={cameraBtnDisabled}
          // disabled={true}
        />
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
    marginTop: 40,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buttonHalfContainer: {
    flex: 1,
  },
  heartRatetext: {
    fontSize: 18,
    padding: 20,
    flex: 1,
  },
});
