import dynamic from 'next/dynamic';


const Map = dynamic(() => import('../../components/map/map'), {
        ssr: false,
});


export default function Sidebar() {
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

  return (
        <div className="flex h-screen">
        <div className="w-1/4 border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Sidebar Title</h2>
            <div className="mt-4 space-y-2">
              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                <h3 className="font-semibold">Location 1</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description for Location 1</p>
              </div>
              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                <h3 className="font-semibold">Location 2</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description for Location 2</p>
              </div>
              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                <h3 className="font-semibold">Location 3</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Description for Location 3</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <div className="h-full">
            <div className="h-full w-full rounded-md border">
              <Map center={position} markers={markers}/>
            </div>
          </div>
        </div>
      </div>
  );
}