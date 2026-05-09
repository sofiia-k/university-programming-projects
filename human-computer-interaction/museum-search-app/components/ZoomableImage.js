import { Image, StyleSheet } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

export default function ZoomableImage({ imageUrl }) {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = 1;
        savedScale.value = 1;
      } else if (scale.value > 4) {
        scale.value = 4;
        savedScale.value = 4;
      } else {
        savedScale.value = scale.value;
      }
    });

  const animatedImageStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View style={styles.imageWrapper}>
        <Animated.Image
          source={{ uri: imageUrl }}
          style={[styles.image, animatedImageStyle]}
          resizeMode="contain"
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: "100%",
    height: 360,
    backgroundColor: "#E8DED2",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
