import React, { Component } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import './app.css';

/* set dimensions for google map */
const mapStyle = {
  'height': '100%',
  'width': '100%'
}

class App extends Component {

  constructor(props) {
    super(props);
    /* set default map position */
    this.state = {
      lat: 22.3193,
      lng: 114.1694,
      zoom: 13
    };
  }

  render() {
    return (
      <div className='container'>
        {/* input form to collect start and endpoints */}
        <div className='column left'>
        </div>

        {/* load google maps script */}
        <div className='column right'>
          <LoadScript
            id='script-loader'
            googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          >
            {/* render map */}
            <GoogleMap
              id='map'
              mapContainerStyle={mapStyle}
              zoom={this.state.zoom}
              center={{
                lat: this.state.lat,
                lng: this.state.lng
              }}
            >
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    );
  }
}

export default App;
