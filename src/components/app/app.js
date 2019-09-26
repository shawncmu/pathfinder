import React, { Component } from 'react';
import { GoogleMap, LoadScript, Autocomplete, Polyline, Marker } from '@react-google-maps/api';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
// import LocationForm from '../LocationForm';

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
      loading: false
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
      destination
    } = this.state;
    if (origin === '' || destination === '') {
      this.setState({ error: 'Starting location and drop off point are both required' });
      return;
    } else {
      this.setState({ error: null, loading: true });
    }
    this.getPath();
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
      loading: false
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
        console.log(result)
        if (result.status === 'failure') {
          this.setState({ error: result.error, loading: false });
          return;
        }
        if (result.status === 'in progress') {
          console.log('inprogress');
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
      console.log(res);
      if (res.status && res.status === 500) {
        return { status: 'failure', error: 'Unable to process your request at this time. Please try again later' }
      }
      return res.json();
    });
  };

  fetchWaypoints = (token) => {
    return fetch(`https://mock-api.dev.lalamove.com/route/${token}`)
    .then((res) => {
      console.log(res);
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
      loading
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
              <Form onSubmit={this.handleSubmit}>
                <Row>
                  <Col xs={8}>
                    <Autocomplete
                      onLoad={this.onLoadOrigin}
                      onPlaceChanged={this.onOriginChanged}
                    >
                      <Form.Group controlId="origin">
                        <Form.Label><b>Starting Location:</b></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter location"
                          name="origin"
                          value={origin}
                          onChange={this.handleChange}
                        />
                      </Form.Group>
                    </Autocomplete>
                  </Col>
                  <Col xs={4} className="no-padding">
                    <Button
                      className="clear"
                      variant="warning"
                      type="reset"
                      value="Clear"
                      name="origin"
                      onClick={this.handleClear}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <Col xs={8}>
                    <Autocomplete
                      onLoad={this.onLoadDestination}
                      onPlaceChanged={this.onDestinationChanged}
                    >
                      <Form.Group controlId="destination">
                        <Form.Label><b>Drop-off Point:</b></Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter location"
                          name="destination"
                          value={destination}
                          onChange={this.handleChange}
                        />
                      </Form.Group>
                    </Autocomplete>
                  </Col>
                  <Col xs={4} className="no-padding">
                    <Button
                      className="clear"
                      variant="warning"
                      type="reset"
                      value="Clear"
                      name="destination"
                      onClick={this.handleClear}
                    >
                      Clear
                    </Button>
                  </Col>
                </Row>

                {/* radio input for method of travel */}
                <Form.Group controlId="method">
                  <Form.Check
                    id="radioWalk"
                    type="radio"
                    name="method"
                    value="walk"
                    label="Walk"
                    checked={method === 'walk'}
                    onChange={this.handleRadioChange}
                    inline
                  />
                  <Form.Check
                    id="radioDrive"
                    type="radio"
                    name="method"
                    value="drive"
                    label="Drive"
                    checked={method === 'drive'}
                    onChange={this.handleRadioChange}
                    inline
                  />
                </Form.Group>

                { /* display distance and time on success response with waypoints */
                  totalDistance ?
                    (
                      <div>
                        <p>
                          <b>Total distance:</b>
                          {totalDistance}
                        </p>
                      </div>
                    )
                  :
                    null
                }
                {
                  totalTime ?
                    (
                      <div>
                        <p>
                          <b>Total time:</b>
                          {totalTime}
                        </p>
                      </div>
                    )
                  :
                    null
                }

                {/* submit and reset buttons */}
                <Button
                  variant="primary"
                  type="submit"
                  className="button-margin"
                  disabled={loading}
                >
                  {
                    loading ?
                      (
                        <div>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                          />
                          Loading...
                        </div>
                      )
                    :
                      (
                        <div>
                          Submit
                        </div>
                      )
                  }
                </Button>
                <Button
                  variant="danger"
                  type="reset"
                  value="Reset"
                  onClick={this.handleReset}
                >
                  Reset
                </Button>
              </Form>

              { /* display error */
                error ?
                  (
                    <div>
                      <p className="error"><b>{error}</b></p>
                    </div>
                  )
                :
                  null
              }
            </Col>

            <Col xs={12} md={8} className="map-height no-padding">
              {/* render map */}
              <GoogleMap
                id="map"
                mapContainerStyle={mapStyle}
                zoom={zoom}
                center={{ lat, lng }}
              >
                { /* add markers to display order of path */
                  routes ?
                    routes.map((elem, index) => {
                      const label = (index + 1).toString();
                      return <Marker key={label} position={elem} label={label} />;
                    })
                  :
                    null
                }

                {/* render path on map on success response with waypoints */}
                <Polyline
                  path={routes}
                  options={polylineStyle}
                />
              </GoogleMap>
            </Col>
          </Row>
        </LoadScript>
      </Container>
    );
  }
}

export default App;
