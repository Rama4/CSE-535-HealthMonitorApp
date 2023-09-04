import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {MaterialIcons} from '@expo/vector-icons';

export default function StarRating({rating, onSetStarRating}) {
  const [starRating, setStarRating] = useState(rating ?? null);

  const onStarPress = starIndex => {
    setStarRating(starIndex);
    onSetStarRating && onSetStarRating(starIndex);
  };

  useEffect(() => {
    setStarRating(rating);
  }, [rating]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        {starRating ? `${starRating}*` : 'Tap to rate'}
      </Text>
      <View style={styles.stars}>
        <TouchableOpacity onPress={() => onStarPress(1)}>
          <MaterialIcons
            name={starRating >= 1 ? 'star' : 'star-border'}
            size={32}
            style={
              starRating >= 1 ? styles.starSelected : styles.starUnselected
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onStarPress(2)}>
          <MaterialIcons
            name={starRating >= 2 ? 'star' : 'star-border'}
            size={32}
            style={
              starRating >= 2 ? styles.starSelected : styles.starUnselected
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onStarPress(3)}>
          <MaterialIcons
            name={starRating >= 3 ? 'star' : 'star-border'}
            size={32}
            style={
              starRating >= 3 ? styles.starSelected : styles.starUnselected
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onStarPress(4)}>
          <MaterialIcons
            name={starRating >= 4 ? 'star' : 'star-border'}
            size={32}
            style={
              starRating >= 4 ? styles.starSelected : styles.starUnselected
            }
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onStarPress(5)}>
          <MaterialIcons
            name={starRating >= 5 ? 'star' : 'star-border'}
            size={32}
            style={
              starRating >= 5 ? styles.starSelected : styles.starUnselected
            }
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  stars: {
    display: 'flex',
    flexDirection: 'row',
    color: 'black',
  },
  starUnselected: {
    // color: '#aaa',
    color: 'black',
  },
  starSelected: {
    color: '#ffb300',
  },
});
