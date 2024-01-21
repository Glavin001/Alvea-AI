import {
    OpenAIStream,
    StreamingTextResponse,
    // experimental_StreamData,
} from 'ai';
import OpenAI from 'openai';
import type { ChatCompletionCreateParams } from 'openai/resources/chat';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
});

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

const functions: ChatCompletionCreateParams.Function[] = [
    {
        name: 'get_current_weather',
        description: 'Get the current weather.',
        parameters: {
            type: 'object',
            properties: {
                format: {
                    type: 'string',
                    enum: ['celsius', 'fahrenheit'],
                    description: 'The temperature unit to use.',
                },
            },
            required: ['format'],
        },
    },
    {
        name: 'eval_code_in_browser',
        description: 'Execute javascript code in the browser with eval().',
        parameters: {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    description: `Javascript code that will be directly executed via eval(). Do not use backticks in your response.
             DO NOT include any newlines in your response, and be sure to provide only valid JSON when providing the arguments object.
             The output of the eval() will be returned directly by the function.`,
                },
            },
            required: ['code'],
        },
    },
    /*
    {
        name: 'upsert_text_document',
        description: 'Write a long rich text document in Markdown',
        parameters: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    // description: ``,
                },
                content: {
                    type: 'string',
                    description: ``,
                },
            },
            required: ['content'],
        },
    },
    {
        name: 'edit_text',
        description: 'Write a long rich text document in Markdown',
        parameters: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    // description: ``,
                },
                contents: {
                    type: 'string',
                    // description: ``,
                },
            },
            required: ['code'],
        },
    },
    */
    // Form
    {
        name: 'upsert_form',
        description: 'Write React JSON Schema Form:',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: `Form identifier. To add a new form create a new unique auto-incrementing ID. To edit an existing form use an existing ID here.`,
                },
                jsonSchema: {
                    type: 'string',
                },
                uiShema: {
                    type: 'string',
                },
            },
            required: ['code'],
        },
    },
    // Map
    {
        name: 'upsert_map',
        description: 'Show a map',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: `Form identifier. To add a new form create a new unique auto-incrementing ID. To edit an existing form use an existing ID here.`,
                },
                center: {
                    type: 'object',
                    properties: {
                        lon: {
                            type: 'number',
                        },
                        lat: {
                            type: 'number'
                        }
                    },
                    required: ['lon', 'lat']
                },
                zoomLevel: {
                    type: 'number',
                    description: `Zoom level`,
                },
                markers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            lon: {
                                type: 'number',
                            },
                            lat: {
                                type: 'number'
                            },
                            label: {
                                type: 'string'
                            },
                            color: {
                                type: 'string'
                            },
                        },
                        required: ['lon', 'lat']
                    }
                }
            },
            required: ['id', 'center', 'zoomLevel', 'markers'],
        },
    },
    // 3D generation
    {
        name: 'upsert_3d_scene',
        description: 'Generate 3D scene to visually represent the scene described in the form',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: `Form identifier. To add a new form create a new unique auto-incrementing ID. To edit an existing form use an existing ID here.`,
                },
                descriptionOfScene: {
                    type: 'string',
                    description: 'Exhaustive detailed description of the scene which will be given to an expert 3D software developer'
                },
            }
        },
    },
    // Checklist
    {
        name: 'upsert_checklist',
        description: 'Write a checklist',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: `Form identifier. To add a new form create a new unique auto-incrementing ID. To edit an existing form use an existing ID here.`,
                },
                items: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: {
                                type: 'string',
                            },
                            label: {
                                type: 'string',
                            },
                            checked: {
                                type: 'boolean',
                            },
                        },
                        required: ['id', 'label', 'checked']
                    }
                }
            },
            required: ['id', 'items'],
        },
    }
];

export async function POST(req: Request) {
    const { messages } = await req.json();

    const response = await openai.chat.completions.create({
        // model: 'gpt-3.5-turbo-0613',
        model: 'gpt-4-1106-preview',
        stream: true,
        messages,
        functions,
    });

    // const data = new experimental_StreamData();
    const stream = OpenAIStream(response, {
        // experimental_onFunctionCall: async (
        //   { name, arguments: args },
        //   createFunctionCallMessages,
        // ) => {
        //   return;
        //   if (name === 'get_current_weather') {
        //     // Call a weather API here
        //     const weatherData = {
        //       temperature: 20,
        //       unit: args.format === 'celsius' ? 'C' : 'F',
        //     };

        //     data.append({
        //       text: 'Some custom data',
        //     });

        //     const newMessages = createFunctionCallMessages(weatherData);
        //     return openai.chat.completions.create({
        //       messages: [...messages, ...newMessages],
        //       stream: true,
        //       model: 'gpt-3.5-turbo-0613',
        //     });
        //   }
        // },
        onCompletion(completion) {
            console.log('completion', completion);
        },
        // onFinal(completion) {
        //   // data.close();
        // },
        // experimental_streamData: true,
    });

    // data.append({
    //   text: 'Hello, how are you?',
    // });

    // return new StreamingTextResponse(stream, {}, data);
    return new StreamingTextResponse(stream);
}
