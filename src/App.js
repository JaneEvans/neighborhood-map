import React, { Component } from 'react';
import './App.css';
import axios from 'axios';

class App extends Component {

  state = {
    coffeeShops: []
  }

  componentDidMount() {
    this.renderGoogleAPI();
    this.getCoffeeShops();
  }

  initMap = () => {
    // Constructor creates a new map - only center and zoom are required.
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.6079958, lng: -122.3320709},
      zoom: 14
    });

    const tribeca = {lat: 47.6126869, lng: -122.3255862};
    const marker = new window.google.maps.Marker({
      position: tribeca,
      map: map,
      title: 'Starbucks Reserve Roastery'
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
      })
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


export default App;
