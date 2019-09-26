import React, { Component } from 'react';
import { GoogleMap, LoadScript, Autocomplete } from '@react-google-maps/api';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
// import LocationForm from '../LocationForm';

/* set dimensions for google map */
const mapStyle = {
  'height': '100%',
  'width': '100%'
}
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
      method: 'walk'
    };
  }

  handleChange = (event) => {
    const { target: { name, value } } = event;
    this.setState({ [name]: value });
  }

  handleSubmit = (event) => {
    event.preventDefault();
    console.log(`origin: ${this.state.origin}. destination: ${this.state.destination}`);
  }

  handleRadioChange = (event) => {
    this.setState({ method: event.target.value });
  }

  handleReset = () => {
    this.setState({ origin: '', destination: '', method: 'walk' });
  }

  render() {
    return (
      <Container fluid={true}>
        {/* load google maps script */}
        <LoadScript
          id='script-loader'
          googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
          libraries={libraries}
        >
          <Row>
            <Col xs={12} md={4} className='form'>
              {/* input form to collect start and endpoints */}
              <Form onSubmit={this.handleSubmit}>
                <Autocomplete>
                  <Form.Group controlId='origin'>
                    <Form.Label><b>Starting Location:</b></Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter location'
                      name='origin'
                      value={this.state.origin}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Autocomplete>

                <Autocomplete>
                  <Form.Group controlId='destination'>
                    <Form.Label><b>Drop-off Point:</b></Form.Label>
                    <Form.Control
                      type='text'
                      placeholder='Enter location'
                      name='destination'
                      value={this.state.destination}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Autocomplete>

                {/* radio input for method of travel */}
                <Form.Group controlId='method'>
                  <Form.Check
                    id='radioWalk'
                    type='radio'
                    name='method'
                    value='walk'
                    label='Walk'
                    checked={this.state.method === 'walk'}
                    onChange={this.handleRadioChange}
                    inline
                  />
                  <Form.Check
                    id='radioDrive'
                    type='radio'
                    name='method'
                    value='drive'
                    label='Drive'
                    checked={this.state.method === 'drive'}
                    onChange={this.handleRadioChange}
                    inline
                  />
                </Form.Group>

                

                {/* submit and reset buttons */}
                <Button
                  variant='primary'
                  type='submit'
                  className='button-margin'
                >
                  Submit
                </Button>
                <Button
                  variant='danger'
                  type='reset'
                  value='Reset'
                  onClick={this.handleReset}
                >
                  Reset
                </Button>
              </Form>
            </Col>

            <Col xs={12} md={8} className='map-height no-padding'>
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
            </Col>
          </Row>
        </LoadScript>
      </Container>
    );
  }
}

export default App;