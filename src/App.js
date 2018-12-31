import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import coffee_icon from './icon/coffee_icon.png';
import starbucks_icon from './icon/starbucks_icon.png';

class CoffeeApp extends Component {

  state = {
    coffeeShops: []
  }

  componentDidMount() {
    this.getCoffeeShops();
  }

  getCoffeeShops = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?";
    const parameters = {
      client_id: "LY3VCLOLF2REAZE5GYWGDKPPYZJCUV2W42P1421UNMIUXR4I",
      client_secret: "DGTB0YFUFVD2ISY2NYK2A1JA2SB4QHD0NZNKRUEYAFEJYUD1",
      section: "coffee",
      near: "seattle, wa",
      openNow: 1,
      // sortByDistance: 1,
      // radius:5000,
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

  initMap = () => {
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 47.6079958, lng: -122.3320709},
      zoom: 14
    });

    let markers = [];
    const largeInfowindow = new window.google.maps.InfoWindow();

    // Create dynamic markers on initialize.
    this.state.coffeeShops.map(coffeeShop => {
      let position = {lat:coffeeShop.venue.location.lat, lng:coffeeShop.venue.location.lng};
      let title = coffeeShop.venue.name;
      let id = coffeeShop.venue.id;
      let venue_address = coffeeShop.venue.location.address;

      // Customized marker icons
      let icon = {
        url: coffee_icon,
        scaledSize: new window.google.maps.Size(30, 30),
      }
      if (title.includes("Starbucks")){
        icon.url = starbucks_icon;
        icon.scaledSize = new window.google.maps.Size(40, 40);
      }
      
      let marker = new window.google.maps.Marker({
        map:map,
        position: position,
        title: title,
        animation: window.google.maps.Animation.DROP,
        id: id,
        icon: icon
      })

      markers.push(marker);
      
      // Create an onclick event to open an infowindow at each marker.
      // We only allow one infowindow which will open at the marker that is clicked, 
      // and populate based on that markers position.
      
      marker.addListener('click', ()=> {
        // Add animation to clicked marker
        if (marker.getAnimation() !== null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
          setTimeout(()=>{marker.setAnimation(null); }, 600);
        }

        if (largeInfowindow.marker !== marker) {
          // Clear the infowindow content to give the streetview time to load.
          largeInfowindow.setContent('');
          largeInfowindow.marker = marker;

          // largeInfowindow.setContent(infoWindowContent);
          // largeInfowindow.open(map, marker);

          // Make sure the marker property is cleared if the infowindow is closed.
          largeInfowindow.addListener('closeclick', () => {
            largeInfowindow.marker = null;
          });

          const request = {
            location: map.getCenter(),
            query: marker.title
          }
          const service = new window.google.maps.places.PlacesService(map);
          service.textSearch(request, (place, status)=>{
            if (status === window.google.maps.places.PlacesServiceStatus.OK){
              let address = place[0].formatted_address;
              let imgSrc = place[0].photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150});
              let infoWindowContent = `
                <div id="photo"><img src= ${imgSrc}></div> 
                <div>
                  <div id='shop-name'>${title}</div>
                  <div><strong>Address: </strong>${address}</div>
                </div> 
                `;

                largeInfowindow.setContent(infoWindowContent);

            } else {
              largeInfowindow.setContent(`<div id='shop-name'>${marker.title}</div><div> <strong>Address: </strong>${venue_address}</div><div>No Street View Found</div>`);
            }

          });

          largeInfowindow.open(map, marker);
        }
      });

    });

    document.getElementById('show-listings').addEventListener('click', ()=>{
      let bounds = new window.google.maps.LatLngBounds();
      // Extend the boundaries of the map for each marker and display the marker
      markers.map(marker => {
        marker.setMap(map);
        bounds.extend(marker.position);
        marker.setAnimation(window.google.maps.Animation.DROP);
      })
      map.fitBounds(bounds);
    });

    document.getElementById('hide-listings').addEventListener('click', ()=>{
      markers.map(marker => {
        marker.setMap(null);
      })
    });

  }


  renderGoogleAPI = () => {
    getHTMLScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAXcXV-sDo2jjYfRLVCmOIfhC7umOjkYGk&v=3&libraries=places&callback=initMap");

    window.initMap = this.initMap;
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
              <input id="show-listings" type="button" value="Show All"/>
              <input id="hide-listings" type="button" value="Hide All"/>
            </div>
            <div>
              <input id="search-text" type="text" placeholder="Ex: Starbucks"/>
              <input id="search" type="button" value="Search"/>
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
