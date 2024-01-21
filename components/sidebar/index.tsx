import { Message } from 'ai';
import dynamic from 'next/dynamic';


const Map = dynamic(() => import('../../components/map/map'), {
        ssr: false,
});


interface SidebarProps {
    messages: Message[];
    children: JSX.Element;
}


export default function Sidebar({ messages, children, ShowMessage, onSubmitFormComponent }: any) {
    
    // const position = [51.505, -0.09]
    // const markers = [{
    //     label: 'First location',
    //     position: [51.505, -0.09],
    //     color: 'red',
    // }, {
    //     label: 'Second location',
    //     position: [51.507, -0.07],
    //     color: 'blue',
    // }]

    // const isBigMessage = (message: Message) => {
    //   return message.function_call && JSON.stringify(message.function_call).includes('create_dynamic_map')
    // };
    // const bigMessages = messages.filter(isBigMessage);
    // const chatMessages = messages.filter((msg) => !isBigMessage(msg))
    //   .filter(message => message.role !== 'system')

    // const bigMessage = bigMessages[bigMessages.length - 1];
//show top 5 places in san fran
// im traveling to san fran, what are top 5 places to go?
  return (
        <div className="flex h-screen">
        <div className="w-1/4 border-r">
          <div className="p-4">
            <h2 className="text-lg font-semibold">Chat</h2>
            <div className="mt-4 space-y-2">
                { messages.map((message, index) => {
                    return <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {/* <strong>{message.role}:</strong> */}
                      {/* {message.content} */}
                      <ShowMessage message={message} onSubmitFormComponent={onSubmitFormComponent} />
                    </p>
                  </div>
                })
            }
            </div>
          </div>
        </div>
        <div className="w-3/4">
          <div className="h-full">
            <div className="h-full w-full rounded-md border">
              {/* <Map center={position} markers={markers}/> */}
              {/* {JSON.stringify(bigMessages, null, 2)} */}
              {/* <ShowMessage message={bigMessage} /> */}
              {children}
            </div>
          </div>
        </div>
      </div>
  );
}