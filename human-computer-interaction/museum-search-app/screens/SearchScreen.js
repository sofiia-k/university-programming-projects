import { useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";

import { colors, spacing, radii, typography } from "../theme/tokens";
import AppButton from "../components/AppButton";

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState("");

  const [artist, setArtist] = useState("");
  const [medium, setMedium] = useState("");
  const [yearFrom, setYearFrom] = useState("");
  const [yearTo, setYearTo] = useState("");
  const [onlyWithImages, setOnlyWithImages] = useState(true);

  const handleSearch = () => {
    navigation.navigate("Results", {
      searchQuery: query,
      artist: artist,
      medium: medium,
      yearFrom: yearFrom,
      yearTo: yearTo,
      onlyWithImages: onlyWithImages,
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>MuseumSearch</Text>
      <Text style={styles.text}>
        Search artworks from the Art Institute of Chicago
      </Text>

      <Text style={styles.label}>Search term</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter artwork, artist, topic..."
        value={query}
        onChangeText={setQuery}
      />

      <Text style={styles.sectionTitle}>Filters</Text>

      <Text style={styles.label}>Artist</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. Claude Monet"
        value={artist}
        onChangeText={setArtist}
      />

      <Text style={styles.label}>Medium</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. oil, print, photograph"
        value={medium}
        onChangeText={setMedium}
      />

      <Text style={styles.label}>Creation year range</Text>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.yearInput]}
          placeholder="From"
          value={yearFrom}
          onChangeText={setYearFrom}
          keyboardType="numeric"
        />

        <TextInput
          style={[styles.input, styles.yearInput]}
          placeholder="To"
          value={yearTo}
          onChangeText={setYearTo}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Only artworks with images</Text>
        <Switch value={onlyWithImages} onValueChange={setOnlyWithImages} />
      </View>

      <AppButton title="Search" onPress={handleSearch} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.xl,
    paddingBottom: 40,
  },
  title: {
    ...typography.title,
    marginBottom: spacing.md,
    color: colors.text,
  },
  text: {
    ...typography.body,
    marginBottom: spacing.xl,
    color: colors.text,
  },
  sectionTitle: {
    ...typography.sectionTitle,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    color: colors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: spacing.sm,
    color: colors.primary,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: radii.md,
    fontSize: 16,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  yearInput: {
    flex: 1,
  },
  switchRow: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radii.md,
    marginBottom: spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: colors.border,
  },
  switchText: {
    ...typography.body,
    color: colors.text,
  },
});
