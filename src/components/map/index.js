import React from 'react';
import PropTypes from 'prop-types';
import { GoogleMap, Polyline, Marker, DirectionsRenderer, DirectionsService } from '@react-google-maps/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function DisplayMap (props) {
  const {
    mapStyle,
    zoom,
    lat,
    lng,
    routes,
    polylineStyle,
    method,
    clickedSubmit,
    destination,
    origin,
    response,
    directionsCallback
  } = props;
  return (
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

      {/* render driving directions */
        (
          method === 'drive' && clickedSubmit
        ) && (
          <DirectionsService
            options={{ destination, origin, travelMode: 'DRIVING' }}
            callback={directionsCallback}
          />
        )
      }

      {
        response !== null && (
          <DirectionsRenderer
            options={{
              directions: response
            }}
          />
        )
      }
    </GoogleMap>
  );
}

DisplayMap.propTypes = {
  mapStyle: PropTypes.object,
  zoom: PropTypes.number,
  lat: PropTypes.number,
  lng: PropTypes.number,
  routes: PropTypes.array,
  polylineStyle: PropTypes.object,
  method: PropTypes.string,
  clickedSubmit: PropTypes.bool,
  destination: PropTypes.string,
  origin: PropTypes.string,
  response: PropTypes.object,
  directionsCallback: PropTypes.func
};

DisplayMap.defaultProps = {
  mapStyle: { 'height': '100%', 'width': '100%' },
  zoom: 13,
  lat: 22.3193,
  lng: 114.1694,
  routes: [],
  polylineStyle: {},
  method: 'walk',
  clickedSubmit: false,
  destination: '',
  origin: '',
  response: {},
  directionsCallback: (() => {})
};

export default DisplayMap;
