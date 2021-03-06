import React, { Component } from 'react';
import './css/App.css';
import GoogleMap from './GoogleMap';
import ShowHideList from './ShowHideList';
import SearchForm from './SearchForm';
import SideBar from './SideBar';
import ShopListView from './ShopListView';

class CoffeeApp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      map:'',
      markers:[],
      markerIDs:[],
      filteredMarkerIDs:[],
      searchPlace_marker:null,
      searchValues:{
        duration: "5",
        mode: "WALKING",
        from:"",
      },
      sideBarClass: 'options-box'
    };

    this.updateMap = this.updateMap.bind(this);
    this.updateMarkers = this.updateMarkers.bind(this);
    this.updateMarkerIDs = this.updateMarkerIDs.bind(this);
    this.updateFilteredMarkerIDs = this.updateFilteredMarkerIDs.bind(this);
    this.updateSearchValues = this.updateSearchValues.bind(this);
    this.updateSearchPlace_marker = this.updateSearchPlace_marker.bind(this);
    this.updateSideBarClass = this.updateSideBarClass.bind(this);

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

  updateMarkerIDs(markerIDs) {
    this.setState({
      markerIDs: markerIDs
    });
  }

  updateFilteredMarkerIDs(filteredMarkerIDs) {
    this.setState({
      filteredMarkerIDs: filteredMarkerIDs
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

  updateSideBarClass(sideBarClass) {
    this.setState({
      sideBarClass:sideBarClass
    })
  }



  // Render App ---------------------
  render() {
    const {map, markers, markerIDs,filteredMarkerIDs, searchPlace_marker, searchValues, sideBarClass} = this.state;

    return (
      <div className='canvas'>
        <div className="head">
          <h1>Seattle Coffee Radar</h1>
          <SideBar
            sideBarClass = {sideBarClass}
            updateSideBarClass = {this.updateSideBarClass}
          />
          <hr className="shadow"/>
        </div>
        <div className="container">
          <div className={this.state.sideBarClass} id="side-bar">
            <h2>Find Seattle Best Coffee Shop</h2>
            <hr className="gradient"/>
            <ShowHideList
              map = {map}
              markers = {markers}
              searchPlace_marker = {searchPlace_marker}
              markerIDs = {markerIDs}
              updateFilteredMarkerIDs = {this.updateFilteredMarkerIDs}
            />
            <h4>Coffee Shop List</h4>
            <ShopListView
              markers={markers}
              filteredMarkerIDs = {filteredMarkerIDs}
            />
            <h3>Search Your Coffee Shop</h3>
            <hr className="gradient"/>
            <SearchForm
              map = {map}
              searchValues={searchValues}
              searchPlace_marker={searchPlace_marker}
              markers = {markers}
              updateSearchValues={this.updateSearchValues}
              updateSearchPlace_marker = {this.updateSearchPlace_marker}
              updateFilteredMarkerIDs = {this.updateFilteredMarkerIDs}
            />
          </div>
          <GoogleMap
            updateMap={this.updateMap}
            updateMarkers = {this.updateMarkers}
            updateMarkerIDs = {this.updateMarkerIDs}
            updateFilteredMarkerIDs = {this.updateFilteredMarkerIDs}
          />

        </div>
        <div id="footer">
              Copyright (c) 2019 <a tabIndex="0" href="./"><strong>Seattle Coffee Radar</strong></a> All Rights Reserved.
        </div>
      </div>
    );
  }
}


export default CoffeeApp;
