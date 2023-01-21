import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MapPage() {


    const defaultProps = {
        center: {
            lat: 47.91256833043943,
            lng: 106.9192932244582
        },
        zoom: 12
    };

    return (
        <div style={{ height: '85vh', width: '100%' }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: "" }}
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
            >
                <AnyReactComponent
                    lat={47.90566436508705}
                    lng={106.92598801815937}
                    text="My Marker"
                />
            </GoogleMapReact>
        </div>
    );
}
