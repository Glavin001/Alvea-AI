'use client';

import 'leaflet/dist/leaflet.css';

import { Icon } from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

import markerBlue from '../../public/pin-blue.svg';
import markerRed from '../../public/pin-red.svg';

const markersByColor = {
    'red': new Icon({iconUrl: markerRed.src, iconSize: [24, 32]}),
    'blue': new Icon({iconUrl: markerBlue.src, iconSize: [24, 32]})
}

interface MapProps {
    zoomLevel: number;
    center: [number, number];
    markers: {
        label: string;
        position: [number, number];
        color: string;
    }[];
}

export default function Map({center, markers, zoomLevel}: MapProps) {

    return <div>
        <MapContainer center={center} zoom={zoomLevel} style={{ height: 400 }}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { markers.map(data => {
                return <Marker position={data.position} icon={markersByColor[data?.color] ?? markersByColor['red'] }>
                    <Popup>{data.label}</Popup>
                </Marker>
            })}
            
        </MapContainer>
    </div>;
}
