import { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { colors, spacing, radii, typography } from "../theme/tokens";
import AppButton from "../components/AppButton";

const API_URL = "https://api.artic.edu/api/v1/artworks/search";

const FIELDS =
  "id,title,artist_display,date_display,date_start,date_end,image_id,medium_display";

function getImageUrl(imageId) {
  if (!imageId) {
    return null;
  }

  return `https://www.artic.edu/iiif/2/${imageId}/full/400,/0/default.jpg`;
}

export default function ResultsScreen({ route, navigation }) {
  const {
    searchQuery = "",
    artist = "",
    medium = "",
    yearFrom = "",
    yearTo = "",
    onlyWithImages = true,
  } = route.params || {};

  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArtworks = async () => {
    try {
      setLoading(true);
      setError("");

      const url =
        API_URL +
        "?q=" +
        encodeURIComponent(searchQuery) +
        "&fields=" +
        FIELDS +
        "&limit=10";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const json = await response.json();

      const apiResults = json.data || [];

      const filteredResults = apiResults.filter((item) => {
        if (onlyWithImages && !item.image_id) {
          return false;
        }

        if (
          artist.trim() !== "" &&
          !(item.artist_display || "")
            .toLowerCase()
            .includes(artist.trim().toLowerCase())
        ) {
          return false;
        }

        if (
          medium.trim() !== "" &&
          !(item.medium_display || "")
            .toLowerCase()
            .includes(medium.trim().toLowerCase())
        ) {
          return false;
        }

        const from = parseInt(yearFrom, 10);
        const to = parseInt(yearTo, 10);

        if (
          !Number.isNaN(from) &&
          item.date_end !== null &&
          item.date_end < from
        ) {
          return false;
        }

        if (
          !Number.isNaN(to) &&
          item.date_start !== null &&
          item.date_start > to
        ) {
          return false;
        }

        return true;
      });

      setArtworks(filteredResults);
    } catch (err) {
      setError("Could not load artworks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtworks();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
        <Text style={styles.text}>Loading artworks...</Text>
      </View>
    );
  }

  if (error !== "") {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <AppButton title="Try again" onPress={fetchArtworks} />
      </View>
    );
  }
  if (artworks.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No artworks found</Text>
        <Text style={styles.text}>
          Try another search term or remove some filters.
        </Text>

        <View style={styles.filterBox}>
          <Text style={styles.filterTitle}>Active filters</Text>

          <View style={styles.chipWrap}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Artist: {artist || "Any"}</Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipText}>Medium: {medium || "Any"}</Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Years: {yearFrom || "Any"} – {yearTo || "Any"}
              </Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Images: {onlyWithImages ? "Yes" : "No"}
              </Text>
            </View>
          </View>
        </View>

        <AppButton
          title="Go back and edit filters"
          onPress={() => navigation.goBack()}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerBlock}>
        <Text style={styles.title}>
          {searchQuery.trim() !== ""
            ? `Results for “${searchQuery}”`
            : "Results"}
        </Text>

        <Text style={styles.resultCount}>Found {artworks.length} artworks</Text>

        <View style={styles.filterBox}>
          <Text style={styles.filterTitle}>Active filters</Text>

          <View style={styles.chipWrap}>
            <View style={styles.chip}>
              <Text style={styles.chipText}>Artist: {artist || "Any"}</Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipText}>Medium: {medium || "Any"}</Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Years: {yearFrom || "Any"} – {yearTo || "Any"}
              </Text>
            </View>

            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Images: {onlyWithImages ? "Yes" : "No"}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <FlatList
        data={artworks}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => {
          const imageUrl = getImageUrl(item.image_id);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() =>
                navigation.navigate("ArtworkDetails", {
                  artworkId: item.id,
                })
              }
            >
              {imageUrl ? (
                <Image source={{ uri: imageUrl }} style={styles.cardImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.placeholderText}>No image</Text>
                </View>
              )}

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardText}>
                  {item.artist_display || "Unknown artist"}
                </Text>
                <Text style={styles.cardText}>
                  {item.date_display || "Unknown date"}
                </Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },

  title: {
    ...typography.title,
    color: colors.text,
    marginBottom: spacing.md,
  },

  text: {
    ...typography.body,
    color: colors.text,
    marginBottom: spacing.sm,
    textAlign: "center",
  },

  queryText: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: spacing.lg,
    textAlign: "center",
  },

  resultCount: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.lg,
  },

  list: {
    width: "100%",
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: 220,
    backgroundColor: colors.imageBackground,
  },

  imagePlaceholder: {
    width: "100%",
    height: 220,
    backgroundColor: colors.imageBackground,
    alignItems: "center",
    justifyContent: "center",
  },

  placeholderText: {
    color: colors.mutedText,
    fontSize: 14,
  },

  cardContent: {
    padding: spacing.lg,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.sm,
  },

  cardText: {
    fontSize: 14,
    color: colors.mutedText,
    marginBottom: spacing.xs,
  },

  filterBox: {
    width: "100%",
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: radii.md,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  filterTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
  },

  filterText: {
    ...typography.caption,
    color: colors.mutedText,
    marginBottom: spacing.xs,
  },

  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginBottom: spacing.lg,
  },

  headerBlock: {
    width: "100%",
    marginBottom: spacing.lg,
  },

  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },

  chip: {
    backgroundColor: colors.surfaceAlt,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: radii.pill,
  },

  chipText: {
    fontSize: 13,
    color: colors.mutedText,
    fontWeight: "500",
  },
});
