'use client';

// import { Form } from '@/components/form';
import { useRef } from 'react';
import { FunctionCallHandler, nanoid } from 'ai';
import { Message, useChat } from 'ai/react';
import { OpenAiHandler } from "openai-partial-stream";
import { ErrorBoundary } from "react-error-boundary";
import dynamic from 'next/dynamic';

import Home, { HomeProps } from '@/components/home';
import Sidebar from '@/components/sidebar';
import Head from 'next/head';
import { useState } from 'react';
import { parseStreamingFunctionCall, parseStreamingJsonString } from '../lib/parseStreamingJson';

// const Form = dynamic(() => import('@/components/form'), { ssr: false });
const Form = dynamic(() => import('../components/form'), { ssr: false });

const Map = dynamic(() => import('../components/map/map'), {
    ssr: false,
});

function fallbackRender({ error, resetErrorBoundary }: any) {
    // Call resetErrorBoundary() to reset the error boundary and retry the render.

    return (
        <div role="alert">
            <p>Something went wrong:</p>
            <pre style={{ color: "red" }}>{error.message}</pre>
            <button onClick={resetErrorBoundary}>Try again</button>
        </div>
    );
}

// Generate a map of message role to text color
const roleToColorMap: Record<Message['role'], string> = {
    system: 'red',
    user: 'black',
    function: 'blue',
    tool: 'purple',
    assistant: 'green',
    data: 'orange',
};

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
                    const parsedFunctionCallArguments: { code: string } = parseStreamingJsonString(
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

    const [query, setQuery] = useState('');
    const [mode, setMode] = useState<'home' | 'tools'>('home')
    // const [mode, setMode] = useState('tools')
    const [apiKey, setApiKey] = useState<string | null>(null);

    const { messages, input, handleInputChange, handleSubmit, append } = useChat({
        api: '/api/chat-with-functions-2',
        body: {
            apiKey,
        },
        onError: (error) => {
            console.error('Chat error:', error);
            alert(`Chat error: ${error.message}`);
            // Clear API key from local storage
            window.localStorage.removeItem('OPENAI_API_KEY');
        },
        experimental_onFunctionCall: functionCallHandler,
//         initialMessages: [
//             {
//                 id: nanoid(),
//                 role: 'system',
//                 content: `
// You are an intelligent assistant specializing in understanding user needs and intentions for the purpose of dynamically constructing a context-dependent UI using available components.

// When you receive a user's input, your first task is to decipher the user's intention. Consider the context, the specifics of the request, and any underlying needs or goals. If the request is ambiguous or lacks detail, ask targeted follow-up questions to gather the necessary information. Your aim is to develop a clear and comprehensive understanding of what the user wants to achieve, such that you can invoke the following tools to display to the user:

// Available tools:
// - Interactive Map: Essential for travel planning, event locations, and potentially home automation control.
// - 3D Rendering Engine: For interior design, home automation visualization, and potentially for event space planning.
// - Customizable Forms/Input Components: To present to a user to ask them follow up questions that clarify their intent.

// Instructions: 
// - If you need further context from the user to understand their intention sufficient enough to generate a good UI, respond with 3-5 follow-up questions or statements to clarify the user's intention. Focus on understanding the specific requirements, preferences, or constraints related to their request.
// - If you have only 1 follow-up question then use chat, otherwise always prefer to use a form.
// `
//                 //                 content: `
//                 // Now you are an advanced interface designer, capable of creating structured UI schemas based on the available user requirements.

//                 // Now that you have analyzed the user's intentions, your next step is to design an interactive, user-friendly form that captures all necessary follow up information to address their request. Use the insights gathered from these follow-up questions to construct a YAML schema and corresponding UI schema that will guide the user through providing detailed and specific information.

//                 // Instructions:
//                 // - Only return correctly formatted JSON output which satisfies the AskUserQuestions type and no comments. Then, create a UI schema focusing on user-friendly interaction methods
//                 // - Communicate using only the TypeScript types RJSFSchema, UiSchema
//                 // - Must always use block scalar indicator style in YAML
//                 // - Make sure you always add help text to input fields
//                 // - For each form field, start with a sensible default
//                 // Bonus:
//                 // - After gathering all the user input, summarize the user's intent in a concise statement, which will inform the choice and configuration of the UI tools that will be invoked using the JSON output from this step.
//                 // `
//             },
//             // {
//             //     id: nanoid(),
//             //     role: 'assistant',
//             //     function_call: `{"function_call": {"name": "create_simple_form", "arguments": "{\n  \"id\": \"trip_planning_form\",\n  \"jsonSchema\": \"{\\\"title\\\":\\\"Lake Tahoe Trip Planning\\\",\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"dates\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What are the intended dates for your trip?\\\",\\\"format\\\":\\\"date\\\"},\\\"transportation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"How do you plan to get to Lake Tahoe?\\\",\\\"enum\\\":[\\\"Car\\\",\\\"Bus\\\",\\\"Train\\\",\\\"Plane\\\",\\\"Other\\\"]},\\\"accommodation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What type of accommodation are you looking for?\\\",\\\"enum\\\":[\\\"Hotel\\\",\\\"Motel\\\",\\\"Cabin\\\",\\\"Resort\\\",\\\"Airbnb\\\"]},\\\"activities\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What activities are you interested in at Lake Tahoe?\\\",\\\"description\\\":\\\"e.g., skiing, hiking, boating\\\"},\\\"budget\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What is your budget for the trip per person?\\\"},\\\"preferences\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"Do you have any specific preferences or needs for this trip`,
//             // }
//         ]
    });

    const submitFirstQuery: HomeProps['runQuery'] = ({ query, apiKey }) => {
        setQuery(query);
        setApiKey(apiKey);
        append({
            id: nanoid(),
            role: 'user',
            content: query,
            createdAt: new Date(),
        }, {
            options: {
                body: {
                    apiKey,
                }
            }
        });
        setMode('tools');
    };

    const onSubmitFormComponent = (formValues: any) => {
        console.log('onSubmitFormComponent', formValues);
        const formResponse: Message = {
            id: nanoid(),
            name: 'create_simple_form',
            role: 'function' as const,
            // content: formValues,
            content: JSON.stringify(formValues.formData),
            // content: (formValues.formData),
        };
        append(formResponse);
    }

    const isBigMessage = (message: Message) => {
        return message.function_call && JSON.stringify(message.function_call).includes('create_dynamic_map')
    };
    const bigMessages = messages.filter(isBigMessage);
    const chatMessages = messages.filter((msg) => !isBigMessage(msg))
    .filter(message => message.role !== 'system' && message.role !== 'function')

    const bigMessage = bigMessages[bigMessages.length - 1];

    return (
        <>
            <Head>
                <title>Alvea - UI Demo</title>
            </Head>
            <div className={`mode-${mode}`}>
                {mode === 'home' && (
                    <Home runQuery={submitFirstQuery} />
                )}
                {mode === 'tools' && (
                    <div className={"tools"}>
                        <Sidebar messages={chatMessages} onSubmitFormComponent={onSubmitFormComponent} ShowMessage={ShowMessage}>
                            {bigMessage && <ShowMessage message={bigMessage} onSubmitFormComponent={onSubmitFormComponent} />}
                        </Sidebar>
                    </div>
                )}
            </div>
        </>
    )

    return (
        <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
            {messages.length > 0
                ? messages.map((m: Message) => {
                    if (m.role === 'system') {
                        return null;
                    }
                    // const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValueTokens);
                    // const entityStream = openAiHandler.process(stream);

                    // const jsonStreamParser = new StreamParser(StreamMode.StreamObjectKeyValueTokens);

                    // const json = !m.content ? parseStreamingJson(m.function_call) : null;
                    // const json = !m.content ? processNominalJsonString(m.function_call) : null;
                    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
                    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
                    // const json = parseFunctionCall(m.function_call);
                    // console.log('m.function_call', m.function_call, { json });
                    const json = typeof m.function_call === 'string' ? parseStreamingJsonString(m.function_call) : m.function_call;
                    const isFunctionCallDone = typeof m.function_call === 'object';

                    // const json = typeof m.function_call === "object" ? m.function_call : null;
                    return (
                        <div
                            key={m.id}
                            className="whitespace-pre-wrap"
                            style={{ color: roleToColorMap[m.role] }}
                        >
                            <strong>{`${m.role}: `}</strong>
                            {/* {typeof m.content === 'string' ? (
                                m.content
                            ) : 
                            m.content ? JSON.stringify(m.content, null, 2) : */}
                            {m.content ? (
                                m.content
                            ) :
                                (<>
                                    <ErrorBoundary
                                        fallbackRender={fallbackRender}
                                        resetKeys={[JSON.stringify(json)]}>
                                        <pre>
                                            {JSON.stringify(json, null, 2)}
                                        </pre>
                                        <div>{isFunctionCallDone ? "Done!" : "Writing..."}</div>
                                        <DynamicComponent functionCall={json} onSubmit={onSubmitFormComponent} />
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

function ShowMessage({ message: m, onSubmitFormComponent }: { message: Message, onSubmitFormComponent: any }) {
    // const openAiHandler = new OpenAiHandler(StreamMode.StreamObjectKeyValueTokens);
    // const entityStream = openAiHandler.process(stream);

    // const jsonStreamParser = new StreamParser(StreamMode.StreamObjectKeyValueTokens);

    // const json = !m.content ? parseStreamingJson(m.function_call) : null;
    // const json = !m.content ? processNominalJsonString(m.function_call) : null;
    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
    // const json = parseFunctionCall(m.function_call);
    // console.log('m.function_call', m.function_call, { json });
    // const json = typeof m.function_call === 'string' ? parseStreamingJsonString(m.function_call) : m.function_call;
    const isFunctionCallDone = typeof m.function_call === 'object';

    // const json = typeof m.function_call === "object" ? m.function_call : null;
    return (
        <div
            key={m.id}
            className="whitespace-pre-wrap"
            style={{ color: roleToColorMap[m.role] }}
        >
            <strong>{`${m.role.toUpperCase()}: `}</strong>
            {/* {typeof m.content === 'string' ? (
                m.content
            ) : 
            m.content ? JSON.stringify(m.content, null, 2) : */}
            {m.content ? (
                m.content
            ) :
                (<>
                    <ErrorBoundary
                        fallbackRender={fallbackRender}
                        // resetKeys={[JSON.stringify(json)]}>
                        resetKeys={[JSON.stringify(m.function_call)]}>
                        {/* <pre>
                            {JSON.stringify(json, null, 2)}
                        </pre> */}
                        {/* <div>{isFunctionCallDone ? "Done!" : "Writing..."}</div> */}
                        <div>{isFunctionCallDone ? "" : "Writing..."}</div>
                        <DynamicComponent functionCall={m.function_call} onSubmit={onSubmitFormComponent} />
                    </ErrorBoundary>
                </>
                )}
            {/* {m.content || JSON.stringify(m.function_call)} */}
            <br />
            <br />
        </div>
    );
}

function DynamicComponent({ functionCall: functionCallRaw, onSubmit }: any) {
    // console.log('DynamicComponent', functionCall);

    const prevState = useRef<any>({});

    // return <div>
    //     <pre>{JSON.stringify(functionCall, null, 2)}</pre>
    // </div>

    if (!functionCallRaw) {
        return null;
    }

    // const functionCallJson = typeof functionCallRaw === 'string' ? parseStreamingJsonString(functionCallRaw) : functionCallRaw;
    const functionCallJson = typeof functionCallRaw === 'string' ? parseStreamingFunctionCall(functionCallRaw) : functionCallRaw;

    // if functionCall is object and has property functionCall inside it, then use that
    const functionCall = functionCallJson.function_call ?? functionCallJson;

    if (functionCall.name === 'create_simple_form') {
        if (!functionCall.arguments) {
            return <div>
                Writing form...
                {/* <Form /> */}

                {/*
                <pre>
                    {JSON.stringify(functionCall, null, 2)}
                </pre>
                <pre>
                    {JSON.stringify(functionCallRaw, null, 2)}
                </pre>
                */}
               
            </div>
        }

        // const args = JSON.parse(functionCall.arguments);
        const args = parseStreamingJsonString(functionCall.arguments) ?? {};
        try {
            const { jsonSchema: jsonSchemaString, uiSchema: uiSchemaString } = args;
            const jsonSchema = jsonSchemaString ? parseStreamingJsonString(jsonSchemaString) : {};
            const uiSchema = uiSchemaString ? parseStreamingJsonString(uiSchemaString) : {};

            // save to prevState
            prevState.current.args = args;
            prevState.current.jsonSchema = jsonSchema;
            prevState.current.uiSchema = uiSchema;
        } catch (error) {
            console.error(error);
        }

        const { jsonSchema, uiSchema } = prevState.current;

        return <div>
            {/* Upsert form */}
            <ErrorBoundary
                fallbackRender={fallbackRender}
                resetKeys={[JSON.stringify(jsonSchema), JSON.stringify(uiSchema)]}>
                <Form jsonSchema={jsonSchema} uiSchema={uiSchema} onSubmit={onSubmit} />
            </ErrorBoundary>
            {/* <pre>{JSON.stringify(functionCallJson, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(functionCallRaw, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(m.function_call, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(functionCall, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(functionCallRaw, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(args, null, 2)}</pre> */}
            {/* <pre>{functionCall?.arguments?.contents ?? functionCall?.arguments?.code}</pre> */}
            {/* <pre>{args?.contents ?? args?.code}</pre> */}
            {/* <pre>{JSON.stringify(jsonSchema, null, 2)}</pre> */}
            {/* <pre>{JSON.stringify(uiSchema, null, 2)}</pre> */}
        </div>
    }
    else if (functionCall.name === 'create_dynamic_map') {
        if (!functionCall.arguments) {
            return <div>
                Map...
            </div>
        }

        try {
            const args = parseStreamingJsonString(functionCall.arguments);

            const locationToPoint = (loc: any) => ((loc && loc?.lat && loc?.lon) ? [loc.lat, loc.lon] : null);

            // const position = [51.505, -0.09]
            // const position = args?.center ? [args?.center?.lat, args?.center?.lon] : [51.505, -0.09]
            // const centerPosition = args?.center ? locationToPoint(args?.center) : [51.505, -0.09]
            const centerPosition = args?.center ? locationToPoint(args?.center) : null
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
            const startPosition = centerPosition ?? (
                readyMarkers.length > 0 ? (readyMarkers.reduce((acc, marker) => {
                    acc[0] += marker.position[0];
                    acc[1] += marker.position[1];
                    return acc;
                }, [0, 0])
                    .map(x => x / readyMarkers.length)
                ) : null);

            // Save startPosition, markers, zoomLevel to prevState
            prevState.current.startPosition = startPosition;
            prevState.current.markers = readyMarkers;
            prevState.current.zoomLevel = zoomLevel;
        } catch (error) {
        }

        const { startPosition, markers, zoomLevel } = prevState.current;

        // return <div style={{ 'height': 800 }}>
        return <div style={{ 'height': '100vh' }}>
            {/* <h1>Map Demo</h1> */}
            {/* <pre>{JSON.stringify(prevState.current, null, 2)}</pre> */}
            <ErrorBoundary fallbackRender={fallbackRender} resetKeys={[JSON.stringify(startPosition), JSON.stringify(markers)]}>
                {startPosition && (
                    <Map center={startPosition} markers={markers} zoomLevel={zoomLevel} />
                )}
            </ErrorBoundary>
        </div>;
    }

    if (JSON.stringify(functionCall).includes('create_simple_form')) {
        console.log('weird', functionCall);
    }

    return <>
        <div>Writing...</div>
        {/* <pre>{JSON.stringify(m.function_call, null, 2)}</pre> */}
        {/* <pre>{JSON.stringify(functionCallRaw, null, 2)}</pre> */}
        {/* <pre>{functionCall?.arguments?.contents ?? functionCall?.arguments?.code}</pre> */}
    </>
}
