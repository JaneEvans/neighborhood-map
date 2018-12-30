import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class CoffeeApp extends Component {

  state = {
    coffeeShops: []
  }

  componentDidMount() {
    this.getCoffeeShops();
  }

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.6079958, lng: -122.3320709},
      zoom: 13
    });

    let markers = [];
    let largeInfowindow = new window.google.maps.InfoWindow();

    this.state.coffeeShops.map(coffeeShop => {
      let position = {lat:coffeeShop.venue.location.lat, lng:coffeeShop.venue.location.lng};
      let title = coffeeShop.venue.name;
      let id = coffeeShop.venue.id;

      let marker = new window.google.maps.Marker({
        map:map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        id: id
      })
      markers.push(marker);

      marker.addListener('click', function() {
        if (largeInfowindow.marker !== marker) {
          largeInfowindow.marker = marker;
          largeInfowindow.setContent('<div>' + marker.title + '</div>');
          largeInfowindow.open(map, marker);
          // Make sure the marker property is cleared if the infowindow is closed.
          largeInfowindow.addListener('closeclick', function() {
            largeInfowindow.marker = null;
          });
        }
      });

    });

    document.getElementById('show-listings').addEventListener('click', function(){
      let bounds = new window.google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      markers.map(marker => {
        marker.setMap(map);
        bounds.extend(marker.position);
      })
      map.fitBounds(bounds);
    });

    document.getElementById('hide-listings').addEventListener('click', function(){
      markers.map(marker => {
        marker.setMap(null);
      })
    });
  }


  renderGoogleAPI = () => {
    getHTMLScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAXcXV-sDo2jjYfRLVCmOIfhC7umOjkYGk&v=3&callback=initMap");

    window.initMap = this.initMap;
  }

  getCoffeeShops = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "LY3VCLOLF2REAZE5GYWGDKPPYZJCUV2W42P1421UNMIUXR4I",
      client_secret: "DGTB0YFUFVD2ISY2NYK2A1JA2SB4QHD0NZNKRUEYAFEJYUD1",
      section: "coffee",
      near: "seattle, wa",
      openNow: 1,
      v:"20181212"
    }

    axios.get(endPoint + new URLSearchParams(parameters)).then(response => {
      this.setState({
        coffeeShops: response.data.response.groups[0].items
      }, this.renderGoogleAPI())
    }).catch(e => {
      console.log(e);
    })
  }


  render() {
    return (
      <div className='canvas'>
        <div className="head">
          <h1>Seattle Coffee Radar</h1>
        </div>
        <div className="container">
          <div className="options-box">
            <h2>Find Seattle Best Coffee Shop</h2>
            <div>
              <input id="show-listings" type="button" value="Show Listings"/>
              <input id="hide-listings" type="button" value="Hide Listings"/>
            </div>
          </div>
          <div id="map"/>
        </div>
      </div>
    );
  }
}


function getHTMLScript(url){
  const index = window.document.getElementsByTagName('script')[0];
  const script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default CoffeeApp;
