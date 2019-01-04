import React, { Component } from 'react';
import './css/App.css';
import GoogleMap from './GoogleMap';
import ShowHideList from './ShowHideList';

class CoffeeApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map:'',
      markers:[],
      searchPlace_marker:null,
      searchValues:{
        duration: "5",
        mode: "WALKING",
        from:"",
      }
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.updateMap = this.updateMap.bind(this);
    this.updateMarkers = this.updateMarkers.bind(this);

  }

  updateMap(map) {
    this.setState({
      map: map
    });
  }

  updateMarkers(markers) {
    this.setState({
      markers: markers
    });
  }


  showListing = ()=>{
    if (this.state.searchPlace_marker) {
      this.state.searchPlace_marker.setMap(null);
    } 
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
    if (this.state.searchPlace_marker) {
      this.state.searchPlace_marker.setMap(null);
    } 
    let place = autocomplete.getPlace();
    searchValues.from = place.name;
    console.log(place);

    this.state.map.setCenter(place.geometry.location);

    let searchPlace_marker = new window.google.maps.Marker({
      map:this.state.map,
      position: place.geometry.location,
      title: place.name,
      animation: window.google.maps.Animation.DROP
    })

    this.setState({searchValues, searchPlace_marker});
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
              // console.log(this.state.markers[i])
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
    const {map, markers, searchPlace_marker} = this.state;

    return (
      <div className='canvas'>
        <div className="head">
          <h1>Seattle Coffee Radar</h1>
        </div>
        
        <div className="container">
          <div className="options-box">
            <h2>Find Seattle Best Coffee Shop</h2>
            <ShowHideList
              map = {map}
              markers = {markers}
              searchPlace_marker = {searchPlace_marker}
            />
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
              <button id="search-within-time" >Find Me Coffee</button>
            </form>
          </div>

          {/* <div id="map"/> */}
          <GoogleMap
            updateMap={this.updateMap}
            updateMarkers = {this.updateMarkers}

          />
          <div id="footer">
            Copyright (c) 2019 <a href="/"><strong>Seattle Coffee Radar</strong></a> All Rights Reserved.
          </div>
        </div>

        
      </div>
    );
  }
}


export default CoffeeApp;
