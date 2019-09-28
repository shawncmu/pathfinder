import React, { Component } from 'react';
import { LoadScript } from '@react-google-maps/api';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import DisplayMap from '../map';
import LocationForm from '../locationForm';

/* set dimensions for google map */
const mapStyle = {
  'height': '100%',
  'width': '100%'
};

/* set style for polyline */
const polylineStyle = {
  strokeColor: '#FF0000',
  strokeOpacity: 0.8,
  strokeWeight: 2,
  fillColor: '#FF0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

/* set libraries for react-google-maps */
const libraries = ['places'];

class App extends Component {

  constructor(props) {
    super(props);
    /* set default map position */
    this.state = {
      lat: 22.3193,
      lng: 114.1694,
      zoom: 13,
      origin: '',
      destination: '',
      method: 'walk',
      error: null,
      routes: [],
      totalDistance: null,
      totalTime: null,
      loading: false,
      response: null,
      clickedSubmit: false
    };
  }

  /* update state when input changes */
  handleChange = (event) => {
    const { target: { name, value } } = event;
    this.setState({ [name]: value });
  }

  /* clear origin or destination */
  handleClear = (event) => {
    const { target: { name } } = event;
    this.setState({ [name]: '' });
  }

  /* update state when radio input changes */
  handleRadioChange = (event) => {
    this.setState({ method: event.target.value });
  }

  /* check if required fileds are provided and then fetch route from API */
  handleSubmit = (event) => {
    event.preventDefault();
    const {
      origin,
      destination,
      method
    } = this.state;
    if (origin === '' || destination === '') {
      this.setState({ error: 'Starting location and drop off point are both required' });
      return;
    } else {
      this.setState({ error: null, loading: true });
    }
    if (method === 'walk') {
      this.getPath();
    } else if (method === 'drive') {
      this.setState({ clickedSubmit: true, loading: true });
    }
  }

  /* reset state */
  handleReset = () => {
    this.setState({
      lat: 22.3193,
      lng: 114.1694,
      zoom: 13,
      origin: '',
      destination: '',
      method: 'walk',
      error: null,
      routes: [],
      totalDistance: null,
      totalTime: null,
      loading: false,
      response: null
    });
  }

  /* get token and route from API */
  getPath = () => {
    this.fetchToken()
    .then((response) => {
      if (response.status === 'failure') {
        this.setState({ error: response.error, loading: false });
        return;
      }
      this.fetchWaypoints(response.token)
      .then((result) => {
        if (result.status === 'failure') {
          this.setState({ error: result.error, loading: false });
          return;
        }
        if (result.status === 'in progress') {
          this.getPath();
        } else if (result.path) {
          const path = result.path.map((elem) => {
            return { lat: parseFloat(elem[0]), lng: parseFloat(elem[1]) };
          });
          this.setState({
            routes: path,
            totalDistance: result.total_distance,
            totalTime: result.total_time,
            loading: false
          });
        }
      });
    });
  }

  fetchToken = () => {
    const {
      origin,
      destination
    } = this.state;
    return fetch('https://mock-api.dev.lalamove.com/route', {
      method: 'POST',
      header: 'Content-Type: application/json',
      body: JSON.stringify({ origin, destination })
    })
    .then((res) => {
      if (res.status && res.status === 500) {
        return { status: 'failure', error: 'Unable to process your request at this time. Please try again later' }
      }
      return res.json();
    });
  };

  fetchWaypoints = (token) => {
    return fetch(`https://mock-api.dev.lalamove.com/route/${token}`)
    .then((res) => {
      if (res.status && res.status === 500) {
        return { status: 'failure', error: 'Unable to process your request at this time. Please try again later' }
      }
      return res.json();
    });
  };

  onLoadOrigin = (autocompleteOrigin) => {
    this.autocompleteOrigin = autocompleteOrigin;
    this.autocompleteOrigin.addListener('place_changed', this.onOriginChanged);
  }

  onLoadDestination = (autocompleteDestination) => {
    this.autocompleteDestination = autocompleteDestination;
    this.autocompleteDestination.addListener('place_changed', this.onDestinationChanged);
  }

  onOriginChanged = () => {
    if (this.autocompleteOrigin !== null) {
      const place = this.autocompleteOrigin.getPlace().name + ', ' + this.autocompleteOrigin.getPlace().formatted_address;
      this.setState({ origin: place });
    } else {
      console.log('Origin autocomplete is not loaded yet');
    }
  }

  onDestinationChanged = () => {
    if (this.autocompleteDestination !== null) {
      const place = this.autocompleteDestination.getPlace().name + ', ' + this.autocompleteDestination.getPlace().formatted_address;
      this.setState({ destination: place });
    } else {
      console.log('Destination autocomplete is not loaded yet');
    }
  }

  /* get drive path results from google */
  directionsCallback = (response) => {
    if (response !== null) {
      if (response.status === 'OK') {
        this.setState(() => ({ response, clickedSubmit: false, loading: false }));
      } else {
        this.setState(() => ({ error: 'No results', loading: false }));
      }
    }
  }

  render() {
    const {
      lat,
      lng,
      zoom,
      origin,
      destination,
      method,
      error,
      routes,
      totalDistance,
      totalTime,
      loading,
      response,
      clickedSubmit
    } = this.state;
    return (
      <Container fluid>
        {/* load google maps script */}
        <LoadScript
          id="script-loader"
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <Row>
            <Col xs={12} md={4} className="form">
              {/* input form to collect start and endpoints */}
              <LocationForm
                handleSubmit={this.handleSubmit}
                onLoadOrigin={this.onLoadOrigin}
                onOriginChanged={this.onOriginChanged}
                origin={origin}
                handleChange={this.handleChange}
                handleClear={this.handleClear}
                onLoadDestination={this.onLoadDestination}
                onDestinationChanged={this.onDestinationChanged}
                destination={destination}
                method={method}
                handleRadioChange={this.handleRadioChange}
                totalDistance={totalDistance}
                totalTime={totalTime}
                loading={loading}
                handleReset={this.handleReset}
                error={error}
              />
            </Col>

            <Col xs={12} md={8} className="map-height no-padding">
              {/* render map */}
              <DisplayMap
                mapStyle={mapStyle}
                zoom={zoom}
                lat={lat}
                lng={lng}
                routes={routes}
                polylineStyle={polylineStyle}
                method={method}
                clickedSubmit={clickedSubmit}
                destination={destination}
                origin={origin}
                response={response}
                directionsCallback={this.directionsCallback}
              />
            </Col>
          </Row>
        </LoadScript>
      </Container>
    );
  }
}

export default App;
