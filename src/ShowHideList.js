import React, { Component } from 'react';
import './css/App.css';

class ShowHideList extends Component {

    showListing = ()=>{

        if (this.props.searchPlace_marker) {
            this.props.searchPlace_marker.setMap(null);
        }

        let bounds = new window.google.maps.LatLngBounds();
        // Extend the boundaries of the map for each marker and display the marker
        this.props.markers.map(marker => {
            marker.setMap(this.props.map);
            bounds.extend(marker.position);
            marker.setAnimation(window.google.maps.Animation.DROP);
            
        })
        this.props.map.fitBounds(bounds);
    }

    hideListing = ()=>{
    this.props.markers.map(marker => {
        marker.setMap(null);
    })
    }

    render() {
        return(
            <div id="show-hide-listings">
                <input id="show-listings" type="button" value="Show Best ☕" onClick={this.showListing}/>
                <input id="hide-listings" type="button" value="Hide All ☕" onClick={this.hideListing}/>
            </div>
        );

    }

}

export default ShowHideList;