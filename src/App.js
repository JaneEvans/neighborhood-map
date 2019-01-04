import React, { Component } from 'react';
import './App.css';
import axios from 'axios';
import coffee_icon from './icon/coffee_icon.png';
import starbucks_icon from './icon/starbucks_icon.png';
// import serializeForm from 'form-serialize';


class CoffeeApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      map:'',
      markers:[],
      coffeeShops: [],
      searchValues:{
        duration: "5",
        mode: "WALKING",
        from:"",
        // open_now:true
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      // console.log(response.data.response);
      let validShops = response.data.response.groups[0].items.filter( item => 
        item.venue.location.address !== undefined
      )

      this.setState({
        coffeeShops: validShops
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

    this.setState({map:map});

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
      
      this.setState({ markers: [...this.state.markers, marker] })
      
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
              console.log(place[0]);
              let address = place[0].formatted_address;
              let rating = place[0].rating;
              let open = place[0].opening_hours.open_now ? 'Open' : 'Closed';
              let price = place[0].price_level ? "$".repeat(place[0].price_level) : 'Unknown';

              let imgSrc = place[0].photos[0].getUrl({'maxWidth': 150, 'maxHeight': 150});
              let infoWindowContent = `
                <div id="photo"><img src= ${imgSrc}></div> 
                <div>
                  <div id='shop-name'>${title}</div>
                  <div><strong>Address: </strong>${address}</div>
                  <div><strong>Rating: </strong>${rating}/5.0 </div>
                  <div><strong>Price: </strong>${price} </div>
                  <div>${open} Now </div>
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
  }

  showListing = ()=>{
    let bounds = new window.google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    this.state.markers.map(marker => {
      marker.setMap(this.state.map);
      bounds.extend(marker.position);
      marker.setAnimation(window.google.maps.Animation.DROP);
    })
    this.state.map.fitBounds(bounds);
  }

  hideListing = ()=>{
    this.state.markers.map(marker => {
      marker.setMap(null);
    })
  }

  handleChange = (e)=> {
    const value = e.target.value;
    const name = e.target.name;
    let searchValues = this.state.searchValues;

    searchValues[name] = value;
    this.setState({searchValues});

    // Create the autocomplete object, restricting the search to geographical
    // location types.
    let autocomplete = new window.google.maps.places.Autocomplete((document.getElementById('search-within-time-text')), {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    autocomplete.addListener('place_changed', ()=> {
    // Get the place details from the autocomplete object.
    let place = autocomplete.getPlace();
    searchValues.from = place.name;
    this.setState({searchValues});
    });

  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.searchWithinTime();
    // console.log(this.state.searchValues);
}

    // This function allows the user to input a desired travel time, in
    // minutes, and a travel mode, and a location - and only show the listings
    // that are within that travel time (via that travel mode) of the location
  searchWithinTime = () => {
    // Initialize the distance matrix service.
    const distanceMatrixService = new window.google.maps.DistanceMatrixService();
    const address = this.state.searchValues.from;

    // Check to make sure the place entered isn't blank.
    if (address === '') {
      window.alert('You must enter an address.');
    } else {
      this.hideListing();
      // Use the distance matrix service to calculate the duration of the
      // routes between all our markers, and the destination address entered
      // by the user. Then put all the origins into an origin matrix.
      let origins = [];
      this.state.markers.map(marker => {
        origins.push(marker.position);
      }) 

      
      const mode = this.state.searchValues.mode;
      // Now that both the origins and destination are defined, get all the
      // info for the distances between them.
      distanceMatrixService.getDistanceMatrix({
        origins: origins,
        destinations: [address],
        travelMode: window.google.maps.TravelMode[mode],
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
      }, (response, status) => {
        if (status !== window.google.maps.DistanceMatrixStatus.OK) {
          window.alert('Error was: ' + status);
        } else {
          this.displayMarkersWithinTime(response);
          // console.log(response);
        }
      });
    }
    
  }

      // This function will go through each of the results, and,
      // if the distance is LESS than the value in the picker, show it on the map.
    displayMarkersWithinTime = (response) => {
      const maxDuration = this.state.searchValues.duration;
      const origins = response.originAddresses;
      // const destinations = response.destinationAddresses;
      // console.log(response)
      // Parse through the results, and get the distance and duration of each.
      // Because there might be  multiple origins and destinations we have a nested loop
      // Then, make sure at least 1 result was found.

      let atLeastOne = false;
      // origins.map(origin)
      for (let i = 0; i < origins.length; i++) {
        let results = response.rows[i].elements;
        // console.log(results);
        results.map(result => {
          let element = result;

          if (element.status === "OK") {

            // The distance is returned in feet, but the TEXT is in miles. If we wanted to switch
            // the function to show markers within a user-entered DISTANCE, we would need the
            // value for distance, but for now we only need the text.
            const distanceText = element.distance.text;
            // Duration value is given in seconds so we make it MINUTES. We need both the value
            // and the text.
            const duration = element.duration.value / 60;
            const durationText = element.duration.text;
            if (duration <= maxDuration) {
              //the origin[i] should = the markers[i]
              this.state.markers[i].setMap(this.state.map);
              atLeastOne = true;
              console.log(this.state.markers[i])
              // Create a mini infowindow to open immediately and contain the
              // distance and duration
              var infowindow = new window.google.maps.InfoWindow({
                content: durationText + ' away, ' + distanceText
              });


              infowindow.open(this.state.map, this.state.markers[i]);
              // Put this in so that this small window closes if the user clicks
              // the marker, when the big infowindow opens
              let marker = this.state.markers[i];
              marker.infowindow = infowindow;
              this.setState({...this.state.markers, ...marker});
              window.google.maps.event.addListener(this.state.markers[i], 'click', function() {
                this.infowindow.close();
              });
            }
          }

        })
      }

      if (!atLeastOne) {
        window.alert('We could not find any locations within that distance!');
      }

    }



  // Render App ---------------------
  render() {
    return (
      <div className='canvas'>
        <div className="head">
          <h1>Seattle Coffee Radar</h1>
        </div>
        
        <div className="container">
          <div className="options-box">
            <h2>Find Seattle Best Coffee Shop</h2>
            <div id="show-hide-listings">
              <input id="show-listings" type="button" value="Show Best ☕" onClick={this.showListing}/>
              <input id="hide-listings" type="button" value="Hide All ☕" onClick={this.hideListing}/>
            </div>
            <hr className="shadow"/>
            
            <form id="search-form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
              <h3>Search Your Coffee Shop</h3>
              <hr className="gradient"/>
              {/* <input type="checkbox" name='open_now' defaultChecked/>Open Now */}
              <div className="search-div">
                <span className="text"> From </span>
                <input id="search-within-time-text" name='from' type="text" placeholder="Ex: Pike Market" />
              </div>
              <div className="search-div">
                <span className="text"> Transportation </span>
                <div className="radio-text">
                  <ul><input type="radio" name='mode' value="WALKING" defaultChecked />🚶 Walk </ul>
                  <ul><input type="radio" name='mode' value="BICYCLING" />🚲 Bike </ul>
                  <ul><input type="radio" name='mode' value="DRIVING" />🚗 Drive </ul>
                </div>
              </div>
              <div className="search-div">
                <span className="text"> Within </span>
                <div className="radio-text">
                  <ul><input type="radio" name='duration' value="5" defaultChecked />5 min </ul>
                  <ul><input type="radio" name='duration' value="10" />10 min </ul>
                  <ul><input type="radio" name='duration' value="15" />15 min </ul>
                </div>
              </div>
              <button id="search-within-time">Go</button>
            </form>
          </div>

          <div id="map"/>
          <div id="footer">
            Copyright (c) 2019 <a href="/"><strong>Seattle Coffee Radar</strong></a> All Rights Reserved.
          </div>
        </div>

        
      </div>
    );
  }
}


export default CoffeeApp;
