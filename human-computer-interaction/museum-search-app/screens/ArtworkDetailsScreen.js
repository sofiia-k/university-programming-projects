import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import AppButton from "../components/AppButton";

import ZoomableImage from "../components/ZoomableImage";
import { colors, spacing, radii, typography } from "../theme/tokens";

const API_BASE_URL = "https://api.artic.edu/api/v1";

const DETAIL_FIELDS =
  "id,title,artist_display,date_display,medium_display,dimensions,description,image_id";

function removeHtmlTags(text) {
  if (!text) {
    return "No description available.";
  }

  return text.replace(/<[^>]*>/g, "");
}

function getImageUrl(imageId) {
  if (!imageId) {
    return null;
  }

  return `https://www.artic.edu/iiif/2/${imageId}/full/843,/0/default.jpg`;
}

export default function ArtworkDetailsScreen({ route, navigation }) {
  const { artworkId } = route.params || {};

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArtworkDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const url =
        API_BASE_URL + "/artworks/" + artworkId + "?fields=" + DETAIL_FIELDS;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Detail request failed");
      }

      const json = await response.json();

      setArtwork(json.data);
    } catch (err) {
      setError("Could not load artwork details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworkDetails();
  }, [artworkId]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Loading artwork details...</Text>
      </View>
    );
  }

  if (error !== "") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const imageUrl = getImageUrl(artwork?.image_id);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {imageUrl ? (
        <ZoomableImage imageUrl={imageUrl} />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>No image available</Text>
        </View>
      )}

      <Text style={styles.title}>Artwork Details</Text>

      <Text style={styles.label}>Selected artwork ID:</Text>
      <Text style={styles.artworkId}>{artworkId}</Text>

      <InfoBlock label="Title" value={artwork?.title} />
      <InfoBlock label="Artist" value={artwork?.artist_display} />
      <InfoBlock label="Year" value={artwork?.date_display} />
      <InfoBlock label="Medium" value={artwork?.medium_display} />
      <InfoBlock label="Dimensions" value={artwork?.dimensions} />

      <Text style={styles.sectionTitle}>Description</Text>

      <View style={styles.descriptionCard}>
        <Text style={styles.description}>
          {removeHtmlTags(artwork?.description)}
        </Text>
      </View>

      <AppButton title="Go back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
}

function InfoBlock({ label, value }) {
  return (
    <View style={styles.infoBlock}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>
        {value || "No information available."}
      </Text>
    </View>
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
    color: colors.text,
    marginBottom: spacing.lg,
  },

  text: {
    ...typography.body,
    textAlign: "center",
    marginTop: spacing.md,
    color: colors.text,
  },

  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: spacing.xs,
    color: colors.primary,
  },

  artworkId: {
    fontSize: 16,
    marginBottom: spacing.lg,
    color: colors.text,
  },

  infoBlock: {
    width: "100%",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radii.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  infoLabel: {
    ...typography.caption,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.xs,
  },

  infoValue: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
  },

  sectionTitle: {
    ...typography.sectionTitle,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  imagePlaceholder: {
    width: "100%",
    height: 360,
    backgroundColor: colors.imageBackground,
    borderRadius: radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.xl,
  },

  placeholderText: {
    color: colors.mutedText,
    fontSize: 14,
  },

  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  descriptionCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.lg,
    marginBottom: spacing.xl,
  },

  description: {
    ...typography.body,
    lineHeight: 28,
    color: colors.text,
  },
});
