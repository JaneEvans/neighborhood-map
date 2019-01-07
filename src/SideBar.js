import React, { Component } from 'react';
import './css/App.css';


class SideBar extends Component {
    openSideBar = () => {
        document.getElementById("side-bar").style.zIndex = 10;
    }
      
    render(){
        return(
            <div id='side-bar-button-div'>
                <button id="side-bar-button" onClick={this.openSideBar} >☰ 🔍</button>
            </div>
            
        );
    }
}

export default SideBar;