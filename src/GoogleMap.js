import React, { Component } from 'react';
import './css/App.css';
import axios from 'axios';
import coffee_icon from './icons/coffee_icon.png';
import starbucks_icon from './icons/starbucks_icon.png';


class GoogleMap extends Component {

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
          near: "seattle",
          query: "best",
          limit: 25,
          v:"20181212"
        }
    
        axios.get(endPoint + new URLSearchParams(parameters)).then(response => {

          let validShops = response.data.response.groups[0].items.filter( item => 
            item.venue.location.address !== undefined
          )

          this.setState({
            coffeeShops: validShops
          }, this.renderGoogleAPI())
        }).catch(e => {
          // console.log(e);
          window.alert('ERROR: ' + e);
        })
      }
    
    
      initMap = () => {
        const map = new window.google.maps.Map(document.getElementById('map'), {
          center: {lat: 47.6079958, lng: -122.3320709},
          zoom: 13
        });

        this.props.updateMap(map);

        const largeInfowindow = new window.google.maps.InfoWindow();

        let markers = [];
        let markerIDs = [];
        // Create dynamic markers on initialize.
        this.state.coffeeShops.map(coffeeShop => {
          let position = {lat:coffeeShop.venue.location.lat, lng:coffeeShop.venue.location.lng};
          let title = coffeeShop.venue.name;
          let id = coffeeShop.venue.id;
          let venue_address = coffeeShop.venue.location.address;

          // Customized marker icons
          let icon = {
            url: coffee_icon,
            scaledSize: new window.google.maps.Size(30, 30)
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
          markerIDs.push(marker.id);
          
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
            map.setCenter(marker.position);
            if (largeInfowindow.marker !== marker) {
              // Clear the infowindow content to give the shop details to load.
              largeInfowindow.setContent('');
              largeInfowindow.marker = marker;
    
              // Make sure the marker property is cleared if the infowindow is closed.
              largeInfowindow.addListener('closeclick', () => {
                largeInfowindow.marker = null;
              });
    
              const request = {
                location: map.getCenter(),
                query: title + ', ' +venue_address
              }
              const service = new window.google.maps.places.PlacesService(map);
              service.textSearch(request, (place, status)=>{
                if (status === window.google.maps.places.PlacesServiceStatus.OK){
                  // console.log(place[0]);
                  let address = place[0].formatted_address;
                  let rating = place[0].rating;
                  let open = place[0].opening_hours ? (place[0].opening_hours.open_now ? 'Open' : 'Closed') : 'Unknown';
                  let price = place[0].price_level ? "$".repeat(place[0].price_level) : 'Unknown';
    
                  let imgSrc = place[0].photos ? place[0].photos[0].getUrl({'maxWidth': 120, 'maxHeight': 120}): '' ;
                  let infoWindowContent = `
                    <div>
                      <div id="photo">
                        <img alt = "Image of the coffee shop: ${title}" src= ${imgSrc}>
                      </div>  
                      <div id="shop-info">
                        <div id="shop-name">${title}</div>
                        <div><strong>Address: </strong>${address}</div>
                        <div><strong>Rating: </strong>${rating}/5.0 </div>
                        <div><strong>Price: </strong>${price} </div>
                        <div><strong>Is open?: </strong> ${open} </div>
                      </div>
                    </div>
                    `;
    
                    largeInfowindow.setContent(infoWindowContent);
    
                } else {
                  largeInfowindow.setContent(`
                    <div id='shop-name'>${marker.title}</div>
                    <div><strong>Address: </strong>${venue_address}</div>
                    <div>No Shop Details Found</div>
                    `);
                }
    
              });
    
              largeInfowindow.open(map, marker);
            }
          });
        });
        
        this.props.updateMarkers(markers);
        this.props.updateMarkerIDs(markerIDs);
        this.props.updateFilteredMarkerIDs(markerIDs);
      }
    
      renderGoogleAPI = () => {
        this.getHTMLScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyAXcXV-sDo2jjYfRLVCmOIfhC7umOjkYGk&v=3&libraries=places&callback=initMap");
        window.initMap = this.initMap;
      }
    
      getHTMLScript = (url) => {
        const index = window.document.getElementsByTagName('script')[0];
        const script = window.document.createElement('script');

        script.src = url;
        script.async = true;
        script.defer = true;
        index.parentNode.insertBefore(script, index);

        script.onerror = function() {
          alert("Error loading " + this.src); // Error loading https://example.com/404.js
        };
      }

    render() {
        return (
            <div tabIndex="0" id="map" />
        );
    }
    
}

export default GoogleMap;