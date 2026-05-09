# MuseumSearch

MuseumSearch is a React Native / Expo Android application for searching and viewing artworks from the Art Institute of Chicago.

The app was created for assignment A2: Mobile Programmierung einer einfachen App.

## Student Information

Name: Sofiia Kolner  
Matrikelnummer: 12432376
Course: HCI

## App Identifier

Android package name:

`at.ac.univie.hci.museumsearch`

## Main Features

- Free text search for artworks
- Search results from the Art Institute of Chicago API
- Artwork result cards with image, title, artist and year
- Detail page for each artwork
- Detail page includes image, title, year, artist, medium, dimensions and description
- Zoomable image on the detail page
- Loading state while data is fetched
- Error state if API requests fail
- Empty state if no artworks match the search

## Filters

1. Artist filter
2. Medium filter
3. Creation year range filter
4. Only artworks with images

## API 36.0

The app uses the public Art Institute of Chicago API.

Search endpoint:

`https://api.artic.edu/api/v1/artworks/search`

Detail endpoint:

`https://api.artic.edu/api/v1/artworks/{id}`

Images are loaded through the IIIF image service using the `image_id` returned by the API.

Example image URL:

`https://www.artic.edu/iiif/2/{image_id}/full/843,/0/default.jpg`

## Project Structure

```text
MuseumSearch/
├── App.js
├── app.json
├── package.json
├── babel.config.js
├── screens/
│   ├── SearchScreen.js
│   ├── ResultsScreen.js
│   └── ArtworkDetailsScreen.js
├── components/
│   ├── AppButton.js
│   └── ZoomableImage.js
└── theme/
    └── tokens.js
```

## How to Run

npm install
npx expo start

Then press a to open the app in the Android emulator.

## AI Usage

- understanding React Native and Expo concepts
- learning how navigation, state and API requests work
- debugging error messages
- improving wording, grammar and structure in the documentat
