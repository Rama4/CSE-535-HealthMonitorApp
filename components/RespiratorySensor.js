import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  accelerometer,
  setUpdateIntervalForType,
  SensorTypes,
} from 'react-native-sensors';
import {map, filter, pairwise, startWith} from 'rxjs/operators';

const AccelerometerUpdateIntervalMS = 1000;

setUpdateIntervalForType(
  SensorTypes.accelerometer,
  AccelerometerUpdateIntervalMS,
);

export default function RespiratorySensor() {
  [x, setX] = useState(0);
  [y, setY] = useState(0);
  [z, setZ] = useState(0);
  [k, setK] = useState(0);

  useEffect(() => {
    const subscription = accelerometer
      .pipe(
        startWith(undefined), // emitting first empty value to fill-in the buffer
        pairwise(),
      )
      .subscribe({
        next: ([previous, current]) => {
          // omit first value
          if (!previous) return;
          if (previous !== current) {
            // console.log('previous=', previous);
            // console.log('current=', current);
            const prev_x = previous.x;
            const prev_y = previous.y;
            const prev_z = previous.z;
            const curr_x = current.x;
            const curr_y = current.y;
            const curr_z = current.z;
            const prev_val = Math.sqrt(
              prev_x * prev_x + prev_y * prev_y + prev_z * prev_z,
            );
            const curr_val = Math.sqrt(
              curr_x * curr_x + curr_y * curr_y + curr_z * curr_z,
            );
            if (Math.abs(prev_val - curr_val) > 0.15) {
              setK(_k => _k + 1);
            }
          }
        },
        error: e => {
          console.error(e);
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    console.log('k=', k);
  }, [k]);

  return (
    <View style={styles.container}>
      <Text style={styles.headline}>
        Please lay down and place the smartphone on your chest for a period of
        45 seconds
      </Text>
      <Text>Number of Breaths taken: {k}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  headline: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
  },
});
