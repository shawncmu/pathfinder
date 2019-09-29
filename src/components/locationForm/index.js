import React from 'react';
import { Autocomplete } from '@react-google-maps/api';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import PropTypes from 'prop-types';
import 'bootstrap/dist/css/bootstrap.min.css';
import './locationForm.css';

function LocationForm (props) {
  const {
    handleSubmit,
    onLoadOrigin,
    onOriginChanged,
    origin,
    handleChange,
    handleClear,
    onLoadDestination,
    onDestinationChanged,
    destination,
    method,
    handleRadioChange,
    totalDistance,
    totalTime,
    loading,
    handleReset,
    error
  } = props;
  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={8}>
            <Autocomplete
              onLoad={onLoadOrigin}
              onPlaceChanged={onOriginChanged}
            >
              <Form.Group controlId="origin">
                <Form.Label><b>Starting Location:</b></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  name="origin"
                  className="origin"
                  value={origin}
                  onChange={handleChange}
                />
              </Form.Group>
            </Autocomplete>
          </Col>
          <Col xs={4} className="no-padding">
            <Button
              className="clear"
              variant="warning"
              value="Clear"
              name="origin"
              onClick={handleClear}
            >
              Clear
            </Button>
          </Col>
        </Row>
        <Row>
          <Col xs={8}>
            <Autocomplete
              onLoad={onLoadDestination}
              onPlaceChanged={onDestinationChanged}
            >
              <Form.Group controlId="destination">
                <Form.Label><b>Drop-off Point:</b></Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter location"
                  name="destination"
                  value={destination}
                  onChange={handleChange}
                />
              </Form.Group>
            </Autocomplete>
          </Col>
          <Col xs={4} className="no-padding">
            <Button
              className="clear"
              variant="warning"
              value="Clear"
              name="destination"
              onClick={handleClear}
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
            onChange={handleRadioChange}
            inline
          />
          <Form.Check
            id="radioDrive"
            type="radio"
            name="method"
            value="drive"
            label="Drive"
            checked={method === 'drive'}
            onChange={handleRadioChange}
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
          onClick={handleReset}
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
    </div>
  );
}

LocationForm.propTypes = {
  handleSubmit: PropTypes.func,
  onLoadOrigin: PropTypes.func,
  onOriginChanged: PropTypes.func,
  origin: PropTypes.string,
  handleChange: PropTypes.func,
  handleClear: PropTypes.func,
  onLoadDestination: PropTypes.func,
  onDestinationChanged: PropTypes.func,
  destination: PropTypes.string,
  method: PropTypes.string,
  handleRadioChange: PropTypes.func,
  totalDistance: PropTypes.number,
  totalTime: PropTypes.number,
  loading: PropTypes.bool,
  handleReset: PropTypes.func,
  error: PropTypes.string
};

LocationForm.defaultProps = {
  handleSubmit: () => {},
  onLoadOrigin: () => {},
  onOriginChanged: () => {},
  origin: '',
  handleChange: () => {},
  handleClear: () => {},
  onLoadDestination: () => {},
  onDestinationChanged: () => {},
  destination: '',
  method: 'walk',
  handleRadioChange: () => {},
  totalDistance: null,
  totalTime: null,
  loading: false,
  handleReset: () => {},
  error: null
};

export default LocationForm;
