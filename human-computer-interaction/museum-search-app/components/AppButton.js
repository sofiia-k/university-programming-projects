import { Pressable, Text, StyleSheet } from "react-native";
import { colors, spacing, radii } from "../theme/tokens";

export default function AppButton({ title, onPress, variant = "primary" }) {
  const isSecondary = variant === "secondary";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isSecondary ? styles.secondaryButton : styles.primaryButton,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          isSecondary ? styles.secondaryButtonText : styles.primaryButtonText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  primaryButtonText: {
    color: colors.surface,
  },
  secondaryButtonText: {
    color: colors.text,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
