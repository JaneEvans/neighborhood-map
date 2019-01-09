import React, { Component } from 'react';
import './css/App.css';

class ShopListView extends Component {


    render(){

        return(
            <div id='shop-list-view'>
                {this.props.markers
                    .filter(marker => this.props.filteredMarkerIDs.includes(marker.id))
                    .map(marker => (
                    <ul key= {marker.id}><a href="#" onClick={()=>{window.google.maps.event.trigger(marker, 'click')}}>{marker.title}</a></ul>
                )
                    )}
                <ul key={'null'}></ul>
            </div>
        );
    }
}

export default ShopListView;