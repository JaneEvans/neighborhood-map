import React, { Component } from 'react';
import './css/App.css';


class SideBar extends Component {
    openSideBar = () => {
        let sideBarClass = this.props.sideBarClass;

        if (sideBarClass === 'options-box-responsive-open'){
            sideBarClass = 'options-box-responsive-close';
        } else {
            sideBarClass = 'options-box-responsive-open';
        }

        this.props.updateSideBarClass(sideBarClass);
    }

    render(){
        return(
            <div id='side-bar-button-div'>
                <button id="side-bar-button" tabIndex="0" onClick={this.openSideBar} >🔍</button>
            </div>

        );
    }
}

export default SideBar;