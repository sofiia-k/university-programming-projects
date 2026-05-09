# Software Architecture

## Overview

MuseumSearch is built as a React Native / Expo application with a screen-based architecture. The app is separated into navigation, screens, reusable components and design tokens.

## Navigation

Navigation is handled in `App.js` with React Navigation Native Stack.

The app contains three main screens:

- `SearchScreen`
- `ResultsScreen`
- `ArtworkDetailsScreen`

The navigation flow is:

```text
SearchScreen
→ ResultsScreen
→ ArtworkDetailsScreen
```

## Data Flow

### SearchScreen

`SearchScreen` stores the user input with React state.

The following values are collected:

- search query
- artist filter
- medium filter
- year range filter
- only artworks with images

When the user presses the search button, these values are passed to `ResultsScreen` with `navigation.navigate`.

### ResultsScreen

`ResultsScreen` receives the search parameters through `route.params`.

It sends a request to the Art Institute of Chicago API and stores the returned artworks in component state.

The screen handles four UI states:

- loading
- error
- empty
- success

The retrieved artworks are filtered by artist, medium, year range and image availability.

### ArtworkDetailsScreen

`ArtworkDetailsScreen` receives the selected `artworkId` through `route.params`.

It sends a detail request to the API and displays structured information about the selected artwork.

Displayed fields include:

- image
- title
- year
- artist
- medium
- dimensions
- description

## API Integration

The app uses the public Art Institute of Chicago API.

Search requests are sent to:

```text
https://api.artic.edu/api/v1/artworks/search
```

Detail requests are sent to:

```text
https://api.artic.edu/api/v1/artworks/{id}
```

The API returns an `image_id` instead of a complete image URL. Therefore, image URLs are generated using the IIIF image service.

Example:

```text
https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg
```

## Components

### AppButton

The `AppButton` component is a reusable custom button component used across the app.

It replaces the default React Native `Button` component to allow better visual styling and consistency.

The component supports:

- black primary buttons
- secondary outline-style buttons
- rounded corners
- consistent padding and typography
- press feedback through opacity and scale changes

### ZoomableImage

The `ZoomableImage` component displays artwork images with pinch-to-zoom support.

It is separated from `ArtworkDetailsScreen` to keep the detail screen easier to read and maintain.

## Design Tokens

The app uses centralized design tokens in:

```text
theme/tokens.js
```

The token file defines:

- colors
- spacing
- border radii
- typography styles

This ensures consistent visual design across all screens and makes future design changes easier.

## Error Handling

API requests are wrapped in `try/catch` blocks.

If a request fails, the app displays an error message instead of crashing.

If no artworks match the selected search and filter settings, an empty state is shown.

## Maintainability

The project is structured into separate folders:

```text
screens/
components/
theme/
```
