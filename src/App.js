import React, { Component } from 'react';
import './css/App.css';
import GoogleMap from './GoogleMap';
import ShowHideList from './ShowHideList';
import SearchForm from './SearchForm';

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

    this.updateMap = this.updateMap.bind(this);
    this.updateMarkers = this.updateMarkers.bind(this);
    this.updateSearchValues = this.updateSearchValues.bind(this);
    this.updateSearchPlace_marker = this.updateSearchPlace_marker.bind(this);

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

  updateSearchValues(searchValues) {
    this.setState({
      searchValues:searchValues
    })
  }

  updateSearchPlace_marker(searchPlace_marker) {
    this.setState({
      searchPlace_marker:searchPlace_marker
    })
  }


  // Render App ---------------------
  render() {
    const {map, markers, searchPlace_marker, searchValues} = this.state;

    return (
      <div className='canvas'>
        <div className="head">
          <h1>Seattle Coffee Radar</h1>
          <hr className="shadow"/>
        </div>
        <div className="container">
          <div className="options-box">
            <h2>Find Seattle Best Coffee Shop</h2>
            <hr className="gradient"/>
            <ShowHideList
              map = {map}
              markers = {markers}
              searchPlace_marker = {searchPlace_marker}
            />
            <h3>Search Your Coffee Shop</h3>
            <hr className="gradient"/>
            <SearchForm
              map = {map}
              searchValues={searchValues}
              searchPlace_marker={searchPlace_marker}
              markers = {markers}
              updateMarkers = {this.updateMarkers}
              updateSearchValues={this.updateSearchValues}
              updateSearchPlace_marker = {this.updateSearchPlace_marker}
            />
          </div>
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
