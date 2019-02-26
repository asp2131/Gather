import React from 'react';
import mapboxgl from 'mapbox-gl';
// import geojson from '../mockGeoJson.js';

// https://tools.ietf.org/html/rfc7159 -- geoJSON specs

mapboxgl.accessToken = 'pk.eyJ1IjoiY3NrbGFkeiIsImEiOiJjanNkaDZvMGkwNnFmNDRuczA1cnkwYzBlIn0.707UUYmzztGHU2aVoZAq4g';

class Map extends React.Component {
  constructor(props) {
    super(props);
    const { event } = this.props;
    this.state = {
      lng: event.long || -90,
      lat: event.lat || 30,
      zoom: 17,
    };
  }

  componentDidMount() {
    const { event } = this.props;
    const { lng, lat, zoom } = this.state;
    const { title } = event;

    const map = new mapboxgl.Map({
      container: this.mapContainer,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom,
    });

    /*
    this adds a geocoder search bar to within the map, might be able to limit these \
    searches to a dataset/ geoJSON associated with the api key
    */
    // map.addControl(new MapboxGeocoder({
    //   accessToken: mapboxgl.accessToken,
    // }));

    // this supposedly load geoJSON data into some mapbox variable viable for later manipulation
    // map.on('style.load', () => {
    //   map.addSource('geojson', { type: 'geojson', data: '../mockGeoJson.geojson' });
    // });

    map.on('move', () => {
      const { newLng, newLat } = map.getCenter();

      this.setState({
        lng: newLng.toFixed(4),
        lat: newLat.toFixed(4),
        zoom: map.getZoom().toFixed(2),
      });
    });

    // this follows geoJSON formatting
    map.on('load', () => {
      map.addLayer({
        id: 'points',
        type: 'symbol',
        source: {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: [{
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
              properties: {
                title: `${title}`,
                icon: 'harbor',
              },
            }],
          },
        },
        layout: {
          'icon-image': '{icon}-15',
          'text-field': '{title}',
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-offset': [0, 0.6],
          'text-anchor': 'top',
        },
      });
    });
  }

  render() {
    return (
      <div>
        <div className="inline-block bg-darken75 color-white z1 py6 px12 round-full txt-s txt-bold" />
        <div ref={(el) => { this.mapContainer = el; }} className="mapbox" />
      </div>
    );
  }
}
export default Map;
