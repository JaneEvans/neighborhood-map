import React, { Component } from 'react';
import './css/App.css';

class ShopListView extends Component {


    // myClick(id){
    //     window.google.maps.event.trigger(this.props.markers[id], 'click');
    // }

    render(){
        
        return(
            <div id='shop-list-view'>
                {this.props.markers.map(marker => (
                    <ul><a href="#" onClick={()=>{window.google.maps.event.trigger(marker, 'click')}}>{marker.title}</a></ul>
                ))}
            </div>
        );
    }
}

export default ShopListView;