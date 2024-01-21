'use client';

// import 'leaflet/dist/leaflet.css';

import dynamic from 'next/dynamic';

const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), {
    ssr: false,
});

const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), {
    ssr: false,
});

const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), {
    ssr: false,
});

const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), {
    ssr: false,
});

export default function Map() {
    const position = [51.505, -0.09]
    return <>
        <h1>Map Demo</h1>
        <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
            <Popup>
                A pretty CSS3 popup. <br /> Easily customizable.
            </Popup>
            </Marker>
        </MapContainer>
    </>;
}