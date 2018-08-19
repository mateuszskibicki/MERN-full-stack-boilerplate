import React from 'react';
import { compose, withProps } from 'recompose';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from 'react-google-maps';


import {MarkerWithLabel} from 'react-google-maps/lib/components/addons/MarkerWithLabel';

const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');


const MyMapComponent = compose(
	withProps({
		googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCMjMCyAPNM6trm8QEeG5xryC6URUTO98U&v=3.exp&libraries=geometry,drawing,places',
		loadingElement: <div style={{ height: '100%' }} />,
		containerElement: <div className="box-shadow" style={{ height: '500px' }} />,
		mapElement: <div style={{ height: '100%' }} />,
	}),
	withScriptjs,
	withGoogleMap
)((props) =>
	<GoogleMap
		defaultZoom={15}
		defaultCenter={{ lat: props.latitude, lng: props.longitude}}
	>
  
		
		{props.markers.map(marker => (
			<MarkerWithLabel
				key={marker.id}
				position={{ lat: marker.geometry.location.lat, lng: marker.geometry.location.lng }}
				labelAnchor={new google.maps.Point(0, 0)}
			>
				<div >
					<div className="label-map">{marker.name} {marker.rating ? <small> | Rating: {marker.rating}</small> : null}</div>
					
				</div>
				
			</MarkerWithLabel>
		))}

	</GoogleMap>
);

//<Marker position={{ lat: -34.397, lng: 150.644 }} onClick={props.onMarkerClick} />

class MyFancyComponent extends React.PureComponent {
  state = {
  	isMarkerShown: true,
  }

  componentDidMount() {
  	this.delayedShowMarker();
  }

  delayedShowMarker = () => {
  	setTimeout(() => {
  		this.setState({ isMarkerShown: true });
  	}, 2000);
  }

  handleMarkerClick = () => {
  	this.setState({ isMarkerShown: true });
  	this.delayedShowMarker();
  }

  render() {
  	return (
  		<MyMapComponent
  			latitude={this.props.latitude}
  			longitude={this.props.longitude}
  			markers={this.props.markers}
  			isMarkerShown={this.state.isMarkerShown}
  			onMarkerClick={this.handleMarkerClick}
  			longitu
  		/>
  	);
  }
}

export default MyFancyComponent;