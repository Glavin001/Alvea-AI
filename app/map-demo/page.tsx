import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/map/map'), {
        ssr: false,
});

export default function Page() {
    const position = [51.505, -0.09]
    const markers = [{
        label: 'First location',
        position: [51.505, -0.09],
        color: 'red',
    }, {
        label: 'Second location',
        position: [51.507, -0.07],
        color: 'blue',
    }]

    return <div style={{'height': 600}}>
        <h1>Map Demo</h1>
        <Map key={JSON.stringify({ position, markers })} center={position} markers={markers}/>
    </div>;
}

