import React, { Component } from 'react';
import './css/App.css';

class SearchForm extends Component {
    constructor(props) {
        super(props);
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    
      }

    handleChange = (e)=> {
        const value = e.target.value;
        const name = e.target.name;
        let searchValues = this.props.searchValues;

        searchValues[name] = value;
        this.props.updateSearchValues(searchValues);

        // Create the autocomplete object, restricting the search to geographical
        // location types.
        let autocomplete = new window.google.maps.places.Autocomplete((document.getElementById('search-within-time-text')), {types: ['geocode']});

        // When the user selects an address from the dropdown, populate the address
        // fields in the form.
        autocomplete.addListener('place_changed', ()=> {
            // Get the place details from the autocomplete object.
            if (this.props.searchPlace_marker) {
                this.props.searchPlace_marker.setMap(null);
            } 
            let place = autocomplete.getPlace();
            searchValues.from = place.name;
            console.log(place);

            this.props.map.setCenter(place.geometry.location);

            let searchPlace_marker = new window.google.maps.Marker({
                map:this.props.map,
                position: place.geometry.location,
                title: place.name,
                animation: window.google.maps.Animation.DROP
            })

            // this.setState({searchValues, searchPlace_marker});
            this.props.updateSearchValues(searchValues);
            this.props.updateSearchPlace_marker(searchPlace_marker)
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
        const address = this.props.searchValues.from;

        // Check to make sure the place entered isn't blank.
        if (address === '') {
        window.alert('You must enter an address.');
        } else {
            this.props.markers.map(marker => {
                marker.setMap(null);
            })
            // Use the distance matrix service to calculate the duration of the
            // routes between all our markers, and the destination address entered
            // by the user. Then put all the origins into an origin matrix.
            let origins = [];
            this.props.markers.map(marker => {
                origins.push(marker.position);
        }) 

        
        const mode = this.props.searchValues.mode;
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
        const maxDuration = this.props.searchValues.duration;
        const origins = response.originAddresses;

        // Parse through the results, and get the distance and duration of each.
        // Because there might be  multiple origins and destinations we have a nested loop
        // Then, make sure at least 1 result was found.

        let atLeastOne = false;

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
                        this.props.markers[i].setMap(this.props.map);
                        atLeastOne = true;
                        // console.log(this.props.markers[i])
                        // Create a mini infowindow to open immediately and contain the
                        // distance and duration
                        var infowindow = new window.google.maps.InfoWindow({
                        content: durationText + ' away, ' + distanceText
                        });
            
                        infowindow.open(this.props.map, this.props.markers[i]);
                        // Put this in so that this small window closes if the user clicks
                        // the marker, when the big infowindow opens

                        this.props.markers[i].infowindow = infowindow;

                        window.google.maps.event.addListener(this.props.markers[i], 'click', function() {
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


    render(){

        return(
            <form id="search-form" onSubmit={this.handleSubmit} onChange={this.handleChange}>
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
        );
    }

}

export default SearchForm;