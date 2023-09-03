import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  Button,
  TouchableOpacity,
  Text,
  Linking,
  Image,
  PermissionsAndroid,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {Camera} from 'expo-camera';
// import {Video} from 'expo-av';

const CameraState = Object.freeze({
  active: 0,
  recording: 1,
  paused: 2,
});

export default function CameraView({navigation}) {
  // Todo: change isActive value to isFocused and check.
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [record, setRecord] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});

  const isFocussed = useIsFocused();

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
    // async function getAvailableCameras() {
    //   const devices = await Camera.getAvailableCameraDevices();
    //   console.log(`available cameras:`);
    //   console.log(devices);
    // }
    getPermission();
    // getAvailableCameras();
  }, []);

  // const capturePhoto = async () => {
  //   if (camera.current !== null) {
  //     const photo = await camera.current.takePhoto({});
  //     setImageSource(photo.path);
  //     setShowCamera(false);
  //     console.log(photo.path);
  //   }
  // };

  // const pauseVideo = async () => {
  //   if (camera.current !== null) {
  //     if (cameraState === CameraState.recording) {
  //       await camera.current.pauseRecording();
  //       setCameraState(CameraState.paused);
  //     } else if (cameraState === CameraState.paused) {
  //       await camera.current.resumeRecording();
  //       setCameraState(CameraState.recording);
  //     }
  //   }
  // };

  // const captureVideo = async () => {
  //   if (camera.current !== null) {
  //     // setShowCamera(false);
  //     camera.current.startRecording({
  //       flash: 'off',
  //       onRecordingFinished: video => console.log(video),
  //       onRecordingError: error => console.error(error),
  //     });
  //     setCameraState(CameraState.recording);
  //   }
  // };
  const takeVideo = async () => {
    if (camera) {
      const data = await camera.recordAsync({
        maxDuration: 45,
      });
      setRecord(data.uri);
      console.log(data.uri);
    }
  };

  const stopVideo = async () => {
    camera.stopRecording();
  };

  // if (device == null) {
  //   return <Text>Camera not available</Text>;
  // }

  // const renderRecordingVideo = () => {
  //   return (
  //     <View>
  //       <Camera
  //         ref={camera}
  //         style={[styles.camera, styles.photoAndVideoCamera]}
  //         device={device}
  //         isActive
  //         video
  //       />
  //       <View style={styles.btnGroup}>
  //         <TouchableOpacity style={styles.btn} onPress={captureVideo}>
  //           <Text style={styles.btnText}>Record Video</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity style={{...styles.btn}} onPress={stopVideo}>
  //           <Text style={styles.btnText}>Stop Video</Text>
  //         </TouchableOpacity>
  //       </View>
  //       {/* {videoPath && <Video source={{uri: videoPath}} style={styles.video} />} */}
  //     </View>
  //   );
  // };

  // const onInitialized = useCallback(() => {
  //   console.log('Camera initialized!');
  //   setIsCameraInitialized(true);
  // }, []);

  // const onError = useCallback(error => {
  //   console.error(error);
  // }, []);

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <Text>Permissions are null</Text>;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{flex: 1}}>
      <View style={styles.cameraContainer}>
        <Camera
          ref={ref => setCamera(ref)}
          style={styles.fixedRatio}
          type={type}
          ratio={'4:3'}
        />
      </View>
      {/* <Video
        ref={video}
        style={styles.video}
        source={{
          uri: record,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      /> */}
      {/* <View style={styles.buttons}>
        <Button
          title={status.isPlaying ? 'Pause' : 'Play'}
          onPress={() =>
            status.isPlaying
              ? video.current.pauseAsync()
              : video.current.playAsync()
          }
        />
      </View> */}
      <Button
        title="Flip Video"
        onPress={() => {
          setType(
            type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back,
          );
        }}></Button>
      <Button title="Take video" onPress={() => takeVideo()} />
      <Button title="Stop Video" onPress={() => stopVideo()} />
    </View>
  );
}

const styles = StyleSheet.create({
  cameraContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  fixedRatio: {
    flex: 1,
    aspectRatio: 1,
  },
  video: {
    alignSelf: 'center',
    width: 350,
    height: 220,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
