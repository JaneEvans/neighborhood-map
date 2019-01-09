# Seattle Coffee Radar

A fully responsive single-page web application using ReactJS featuring a map of Seattle best coffee shops

## Getting Started

In order to run this project locally, please clone/download this repository into a local path. In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Author
* **Jinjin Ge** - [JaneEvans](https://janeevans.github.io/my-portfolio-website)

## Acknowledgments
* This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)

### APIs

* Coffee Shop list is from [Foursquare API](https://developer.foursquare.com/docs/api), using [`explore` Endpoint](https://developer.foursquare.com/docs/api/venues/explore)
* Map is featuring with [Google Maps JavaScript API](https://console.cloud.google.com/apis/library/maps-backend.googleapis.com?q=maps%20java&id=fd73ab50-9916-4cde-a0f6-dc8be0a0d425&project=udacity-maps-project-225723)
* Coffee Shop detailed data (including shop photo, formatted address, rating, price, open status), and textual search autocomplete service are from [Google Places API](https://console.cloud.google.com/apis/library/places-backend.googleapis.com?q=places&id=ecefdd63-ee2b-4751-b6c3-8e9113791baf&project=udacity-maps-project-225723)
* Searching place distance data, including travel mode and duration, are from [Google Distance Matrix API](https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com?q=dist&id=82aa0d98-49bb-4855-9da9-efde390a3834&project=udacity-maps-project-225723)





