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
    /*
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
    */
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
    // Form v1
  /*
    {
        name: 'upsert_form',
        description: 'Dynamically generate a React JSON Schema Form based on user input:',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: `Form identifier. To add a new form create a new unique auto-incrementing ID. To edit an existing form use an existing ID here.`,
                },
                jsonSchema: {
                    type: 'string',
                    description: 'Write stringified object for JSON Schema',
                },
                uiSchema: {
                    type: 'string',
                    description: 'Write stringified object for UI Schema',
                },
            },
            required: ['id', 'jsonSchema', 'uiSchema'],
        },
    },

*/
/*
  // Form v2
  {
       name: 'create_simple_form',
       description: 'Dynamically generate a React JSON Schema Form based on user input',
       parameters: {
           type: 'object',
            properties: {
               id: {
                    type: 'string',
                   description: 'Unique identifier for the form. Use a new ID for a new form or an existing ID to edit an existing form.'
                },
                jsonSchema: {
                   type: 'object',
                   description: 'JSON schema defining the structure of the form. It should include field types, titles, and descriptions.'
                },
                uiSchema: {
                   type: 'object',
                   description: 'UI schema for customizing the forms presentation.'
                }
           },
           required: ['id', 'jsonSchema', 'uiSchema']
        }
   },
*/
  // Form v3
    {
        name: 'create_simple_form',
        description: 'Use this function to convert user-provided information into a structured form. It dynamically generates a form based on the provided JSON schema, tailored to capture specific details as requested by the user. The function ensures that the form is interactive and user-friendly, making it ideal for collecting and organizing user inputs efficiently.',
       parameters: {
           type: 'object',
            properties: {
                 id: {
                    type: 'string',
                     description: 'Unique identifier for the form. Use a new ID for a new form or an existing ID to edit an existing form.'
                },
                jsonSchema: {
                     type: 'string',
                    description: 'Stringified object of JSON schema defining the structure of the form. It should include field types, titles, and descriptions. Define the data types, required fields, and overall structure of your form here. The schema dictates how user inputs are structured and validated.'
               },
                uiSchema: {
                    type: 'string',
                    description: 'Stringified object of UI schema for customizing the form\'s presentation. Customize the layout and presentation of your form fields here, including widget types and help texts. This schema controls the visual aspects of the form, enhancing user interaction and experience.'
               }
           },
           required: ['id', 'jsonSchema', 'uiSchema']
       }
    },



  /*
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
                markers: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            label: {
                                type: 'string'
                            },
                            color: {
                                type: 'string',
                                enum: ['red', 'blue'],
                            },
                            lon: {
                                type: 'number',
                            },
                            lat: {
                                type: 'number'
                            },
                        },
                        required: ['label', 'lon', 'lat']
                    }
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
                    description: `Zoom level for Leaflet map`,
                },
            },
            required: ['id', 'center', 'zoomLevel', 'markers'],
        },
    },
    */
  
    // Map v2
    // Enhanced Map Component
    {
        name: 'create_dynamic_map',
        description: 'This function dynamically generates an interactive map based on user inputs. It is designed to visually represent geographic data or locations as specified by the user. The map can be customized with various markers, zoom levels, and center points, making it ideal for applications in travel planning, event location scouting, or geographical data visualization.',
        parameters: {
            type: 'object',
            properties: {
                id: {
                    type: 'string',
                    description: 'Unique identifier for the map. Use a new ID for a new map or an existing ID to edit an existing map. This ensures each map instance is uniquely referenced and managed.'
                },
                center: {
                    type: 'object',
                    properties: {
                        area: {
                            type: 'string',
                            description: 'A short textual description for central focus, such as a place name or description.'
                        },
                        lon: {
                            type: 'number',
                            description: 'Longitude of the map’s center point. Determines the horizontal focal point of the map.'
                        },
                        lat: {
                            type: 'number',
                            description: 'Latitude of the map’s center point. Determines the vertical focal point of the map.'
                        }
                    },
                    required: ['lon', 'lat'],
                    description: 'Coordinates for the central focus of the map. This setting controls which geographical area the map initially displays.'
                },
                zoomLevel: {
                    type: 'number',
                    description: 'Defines the initial zoom level of the map. A higher value indicates a closer view, and a lower value provides a broader view. Adjust this to control how much of the area around the center point is visible upon loading.'
                },
                markers: {
                    type: 'array',
                    description: 'A collection of markers to be placed on the map. Each marker represents a specific location or point of interest.',
                    items: {
                        type: 'object',
                        properties: {
                            label: {
                                type: 'string',
                                description: 'A textual label for the marker, such as a place name or description.'
                            },
                            lon: {
                                type: 'number',
                                description: 'Longitude of the marker position.'
                            },
                            lat: {
                                type: 'number',
                                description: 'Latitude of the marker position.'
                            },
                            color: {
                                type: 'string',
                                description: 'Color of the marker. This can be used to categorize or differentiate markers.'
                            }
                        },
                        required: ['label', 'lon', 'lat']
                    }
                }
            },
            required: ['id', 'center', 'zoomLevel', 'markers'],
            additionalProperties: {
                interactiveFeatures: {
                    type: 'object',
                    properties: {
                        draggableMarkers: {
                            type: 'boolean',
                            description: 'Allow markers to be draggable for user interaction. Useful for applications requiring location adjustments.'
                        },
                        routePlanning: {
                            type: 'boolean',
                            description: 'Enable route planning features between markers. Ideal for travel or logistics planning.'
                        },
                        areaHighlighting: {
                            type: 'boolean',
                            description: 'Allow users to highlight specific areas on the map, useful for emphasizing regions or territories.'
                        }
                    },
                    description: 'Optional interactive features that enhance user engagement with the map. These can be enabled or disabled based on application requirements.'
                }
            }
        }
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
