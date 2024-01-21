'use client';

// import { Form } from '@/components/form';
import { useRef } from 'react';
import { FunctionCallHandler, nanoid } from 'ai';
import { Message, useChat } from 'ai/react';
import { OpenAiHandler, StreamParser, StreamMode } from "openai-partial-stream";
import { ErrorBoundary } from "react-error-boundary";

import dynamic from 'next/dynamic';
// const Form = dynamic(() => import('@/components/form'), { ssr: false });
const Form = dynamic(() => import('../components/form'), { ssr: false });

const Map = dynamic(() => import('../components/map/map'), {
    ssr: false,
});

export default function Chat() {
    const functionCallHandler: FunctionCallHandler = async (
        chatMessages,
        functionCall,
    ) => {
        console.log('functionCall', functionCall);
        if (functionCall.name === 'eval_code_in_browser') {
            if (functionCall.arguments) {
                // Parsing here does not always work since it seems that some characters in generated code aren't escaped properly.
                // const parsedFunctionCallArguments: { code: string } = JSON.parse(
                //   functionCall.arguments,
                // );

                try {
                    const parsedFunctionCallArguments: { code: string } = processNominalJsonString(
                        functionCall.arguments,
                    );
                    console.log('parsedFunctionCallArguments', parsedFunctionCallArguments);
                    // WARNING: Do NOT do this in real-world applications!
                    eval(parsedFunctionCallArguments.code);
                    const functionResponse = {
                        messages: [
                            ...chatMessages,
                            {
                                id: nanoid(),
                                name: 'eval_code_in_browser',
                                role: 'function' as const,
                                content: parsedFunctionCallArguments.code,
                            },
                        ],
                    };

                    return functionResponse;
                } catch (error) {
                    console.error(error);
                    return;
                }
            }
        }
    };

    const { messages, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat-with-functions-2',
        experimental_onFunctionCall: functionCallHandler,
    });

    // Generate a map of message role to text color
    const roleToColorMap: Record<Message['role'], string> = {
        system: 'red',
        user: 'black',
        function: 'blue',
        tool: 'purple',
        assistant: 'green',
        data: 'orange',
    };

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {messages.length > 0
                ? messages.map((m: Message) => {
                    // const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValueTokens);
                    // const entityStream = openAiHandler.process(stream);

                    // const jsonStreamParser = new StreamParser(StreamMode.StreamObjectKeyValueTokens);

                    // const json = !m.content ? parseStreamingJson(m.function_call) : null;
                    // const json = !m.content ? processNominalJsonString(m.function_call) : null;
                    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
                    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
                    // const json = parseFunctionCall(m.function_call);
                    // console.log('m.function_call', m.function_call, { json });
                    const json = typeof m.function_call === 'string' ? processNominalJsonString(m.function_call) : m.function_call;

                    // const json = typeof m.function_call === "object" ? m.function_call : null;
                    return (
                        <div
                            key={m.id}
                            className="whitespace-pre-wrap"
                            style={{ color: roleToColorMap[m.role] }}
                        >
                            <strong>{`${m.role}: `}</strong>
                            {m.content ? (
                                m.content
                            ) : (<>
                                <ErrorBoundary fallback={<div>Something went wrong</div>} resetKeys={[JSON.stringify(json)]}>
                                    <DynamicComponent functionCall={json} />
                                </ErrorBoundary>
                            </>
                            )}
                            {/* {m.content || JSON.stringify(m.function_call)} */}
                            <br />
                            <br />
                        </div>
                    );
                })
                : null}
            <div id="chart-goes-here"></div>
            <form onSubmit={handleSubmit}>
                <input
                    className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
                    value={input}
                    placeholder="Say something..."
                    onChange={handleInputChange}
                />
            </form>
        </div>
    );
}

function DynamicComponent({ functionCall }: any) {
    console.log('DynamicComponent', functionCall);

    const prevState = useRef<any>({});

    // return <div>
    //     <pre>{JSON.stringify(functionCall, null, 2)}</pre>
    // </div>

    if (!functionCall) {
        return null;
    }

    // if functionCall is object and has property functionCall inside it, then use that
    functionCall = functionCall.function_call ?? functionCall;

    if (functionCall.name === 'upsert_form') {
        if (!functionCall.arguments) {
            return <div>
                Writing form...
                {/* <Form /> */}
            </div>
        }
        // const args = JSON.parse(functionCall.arguments);
        const args = processNominalJsonString(functionCall.arguments);

        try {
            const { jsonSchema: jsonSchemaString, uiSchema: uiSchemaString } = args;
            const jsonSchema = jsonSchemaString ? processNominalJsonString(jsonSchemaString) : {};
            const uiSchema = uiSchemaString ? processNominalJsonString(uiSchemaString) : {};

            // save to prevState
            prevState.current.jsonSchema = jsonSchema;
            prevState.current.uiSchema = uiSchema;
        } catch (error) {
        }

        const { jsonSchema, uiSchema } = prevState.current;

        return <div>
            Upsert form
            <ErrorBoundary fallback={<div>Something went wrong</div>} resetKeys={[JSON.stringify(jsonSchema), JSON.stringify(uiSchema)]}>
                <Form jsonSchema={jsonSchema} uiSchema={uiSchema} />
            </ErrorBoundary>
            {/* <pre>{JSON.stringify(m.function_call, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(functionCall, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(args, null, 2)}</pre> */}
            {/* <pre>{functionCall?.arguments?.contents ?? functionCall?.arguments?.code}</pre> */}
            {/* <pre>{args?.contents ?? args?.code}</pre> */}
            {/* <pre>{JSON.stringify(jsonSchema, null, 2)}</pre>
            <pre>{JSON.stringify(uiSchema, null, 2)}</pre> */}
        </div>
    }
    else if (functionCall.name === 'upsert_map') {
        if (!functionCall.arguments) {
            return <div>
                Map...
            </div>
        }

        try {
            const args = processNominalJsonString(functionCall.arguments);

            const locationToPoint = (loc: any) => ((loc && loc?.lat && loc?.lon) ? [loc.lat, loc.lon] : null);

            // const position = [51.505, -0.09]
            // const position = args?.center ? [args?.center?.lat, args?.center?.lon] : [51.505, -0.09]
            const centerPosition = args?.center ? locationToPoint(args?.center) : [51.505, -0.09]
            const zoomLevel = args?.zoomLevel ?? 13;
            //     const markers = [
            //         {
            //         label: 'First location',
            //         position: [51.505, -0.09],
            //         color: 'red',
            //     }, {
            //         label: 'Second location',
            //         position: [51.507, -0.07],
            //         color: 'blue',
            //     }
            // ]
            const markers = args?.markers?.map((marker, markerIndex) => ({
                label: `${markerIndex + 1}. ${marker?.label}`,
                position: locationToPoint(marker),
                color: marker?.color,
            })) ?? [];
            // only markers with position
            const readyMarkers = markers.filter(marker => {
                // check position has both lon and lat  numbers
                const hasPosition = marker.position && marker.position.length === 2 && marker.position.every(x => typeof x === 'number');
                return hasPosition;
            });
            // get center position from either centerPosition or the average of ready markers position
            const startPosition = centerPosition ?? readyMarkers.reduce((acc, marker) => {
                acc[0] += marker.position[0];
                acc[1] += marker.position[1];
                return acc;
            }, [0, 0]).map(x => x / readyMarkers.length);

            // Save startPosition, markers, zoomLevel to prevState
            prevState.current.startPosition = startPosition;
            prevState.current.markers = readyMarkers;
            prevState.current.zoomLevel = zoomLevel;
        } catch (error) {
        }

        const { startPosition, markers, zoomLevel } = prevState.current;

        return <div style={{ 'height': 800 }}>
            {/* <h1>Map Demo</h1> */}
            <pre>{JSON.stringify(prevState.current, null, 2)}</pre>
            <ErrorBoundary fallback={<div>Something went wrong</div>} resetKeys={[JSON.stringify(startPosition), JSON.stringify(markers)]}>
                <Map center={startPosition} markers={markers} zoomLevel={zoomLevel} />
            </ErrorBoundary>
        </div>;
    }

    if (JSON.stringify(functionCall).includes('upsert_form')) {
        console.log('weird', functionCall);
    }

    return <>
        <div>Writing...</div>
        {/* <pre>{JSON.stringify(m.function_call, null, 2)}</pre> */}
        <pre>{JSON.stringify(functionCall, null, 2)}</pre>
        <pre>{functionCall?.arguments?.contents ?? functionCall?.arguments?.code}</pre>
    </>
}


function parseFunctionCall(functionCall: Message['function_call']) {
    if (typeof functionCall !== 'string') {
        // return functionCall;
        const output2 = functionCall?.arguments ? processNominalJsonString(functionCall.arguments) : null;
        // const args = output2?.data?.arguments;
        // const args = output2?.arguments;
        const args = output2;
        const functionCallObject = {
            name: functionCall?.name,
            arguments: args,
        };
        // console.log('functionCallObject', functionCallObject);
        return functionCallObject;
    }

    // const jsonStreamParser1 = new StreamParser(StreamMode.StreamObjectKeyValueTokens);
    // const jsonStreamParser2 = new StreamParser(StreamMode.StreamObjectKeyValueTokens);

    // // const { data: { function_call: topJson } } = jsonStreamParser1.parse(functionCall);
    // const output1 = jsonStreamParser1.parse(functionCall);
    // const topJson: any = output1?.data.function_call;
    // const output2 = topJson?.arguments ? jsonStreamParser2.parse(topJson.arguments) : null;
    // const args = output2?.data?.arguments;

    const output1 = processNominalJsonString(functionCall);
    // const topJson: any = output1?.data.function_call;
    const topJson: any = output1?.function_call;
    const output2 = topJson?.arguments ? processNominalJsonString(topJson.arguments) : null;
    // const args = output2?.data?.arguments;
    // const args = output2?.arguments;
    const args = output2;
    // console.log('args', args);

    const functionCallObject = {
        name: topJson?.name,
        arguments: args,
    };
    return functionCallObject;
}

function streamParseJson(jsonString: string) {
    const jsonStreamParser = new StreamParser(StreamMode.StreamObjectKeyValueTokens);
    // const output = jsonStreamParser.parse(jsonString);
    // pass in jsonString incrementally in chunkd
    let output = null;
    const updateEvery = 1;
    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString[i];
        const shouldUpdate = i % updateEvery === 0 || i === jsonString.length - 1;
        if (shouldUpdate) {
            // output = jsonStreamParser.parse(char) ?? output;
            const tempParsed = jsonStreamParser.parse(char);
            if (tempParsed && tempParsed.data && Object.keys(tempParsed.data).length > 0) {
                output = tempParsed;
            }
        }
        // console.log('char:', char, ' output:', output);
    }
    // console.log('json parsed',
    //     jsonString,
    //     output,
    // )
    return output?.data;
}

// function parseNominalJsonString(nominalJsonString: string): any {
//   // Define a regular expression pattern to match "key": `value` pairs
//   const pattern = /"([^"]+)": `((?:[^`\\]|\\.)*)`/g;

//   const replaceMatch = (match: string, key: string, value: string): string => {
//       value = value.replace(/"/g, '\\"').replace(/\\`/g, '`').replace(/\n/g, '\\n');  // Replace " with \" and \` with `
//       return `"${key}": "${value}"`;
//   };

//   // Use replace to modify the input string
//   const replacedString = nominalJsonString.replace(pattern, replaceMatch);
//   return replacedString;
// }

function processNominalJsonString(nominalJsonString: string): any {
    try {
        return JSON.parse(nominalJsonString);
    } catch (error1) {
        // return null; // TODO: streaming
        try {
            return streamParseJson(nominalJsonString);
        } catch (error2) {
            return null
            // Define a regular expression pattern to match "key": `value` pairs
            const pattern = /"([^"]+)": `((?:[^`\\]|\\.)*)`/g;
            // console.log("Correcting invalid JSON string...");

            const replaceMatch = (match: string, key: string, value: string): string => {
                value = value.replace(/"/g, '\\"').replace(/\\`/g, '`').replace(/\n/g, '\\n');  // Replace " with \" and \` with `
                return `"${key}": "${value}"`;
            };

            // Use replace to modify the input string
            const replacedString = nominalJsonString.replace(pattern, replaceMatch);

            try {
                // Attempt to parse the modified string as JSON
                return streamParseJson(replacedString);
            } catch (parseError) {
                // throw new Error(`Input string was invalid JSON, and we weren't able to fix it. We tried converting:\n\t${nominalJsonString}\n\n...to...\n\t${replacedString}`);
                return null;
            }
        }
    }
}
