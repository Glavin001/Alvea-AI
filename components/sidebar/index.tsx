import { Message } from 'ai';
import dynamic from 'next/dynamic';


const Map = dynamic(() => import('../../components/map/map'), {
        ssr: false,
});


interface SidebarProps {
    messages: Message[];
}


export default function Sidebar({messages}: SidebarProps) {
    
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
                { messages.map((message, index) => {
                    return <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400"><strong>{message.role}:</strong> {message.content}</p>
                  </div>
                })
            }
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