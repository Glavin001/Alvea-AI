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
                    // type: 'string',
                    // description: 'Stringified object of JSON schema defining the structure of the form. It should include field types, titles, and descriptions. Define the data types, required fields, and overall structure of your form here. The schema dictates how user inputs are structured and validated. Do not use array types.'
                    type: 'object',
                    description: `Object of JSON schema defining the structure of the form. It should include field types, titles, and descriptions. Define the data types, required fields, and overall structure of your form here. The schema dictates how user inputs are structured and validated.
- Must always include clear & concise 'title' property for each field in JSON Schema.
- Must always include informative & detailed 'description' property for each field in JSON Schema.
- Use UI Schema 'ui:placeholder' property to provide examples.
- Valid types: string, number, integer, boolean, object. Avoid: Do not use array types.
- Valid formats (optional): date, date-time.
- Must always use the most appropriate and specific type and format available.
- Range inputs must be split into multiple fields (e.g. start-stop, min-max, etc are 2 fields/questions).
- Can include any additional JSON Schema properties for each field to customize the form's presentation.
- To aid in fast user input when there are finite choices use the enum property to provide a list of options for each field, or if the answer can be parsed as a number then use number type.
  For example, instead of room size being one string input, it can be split into three number inputs: length and width and height.`,
                    // Prefer to ask structured questions with multiple choice answers rather than open-ended questions unless necessary. This will enable using the selected values or numbers as inputs for programs which cannot interpret text.`,
                    properties: {
                        type: {
                            type: 'string',
                            description: 'Value must be "object"'
                        },
                    }
                },
                uiSchema: {
                    // type: 'string',
                    // description: 'Stringified object of UI schema for customizing the form\'s presentation. Customize the layout and presentation of your form fields here, including widget types and help texts. This schema controls the visual aspects of the form, enhancing user interaction and experience.'
                    type: 'object',
                    description: `Object of UI schema for customizing the form\'s presentation. Customize the layout and presentation of your form fields here, including widget types and help texts. This schema controls the visual aspects of the form, enhancing user interaction and experience.
                    Must include thoughtful and helpful and nonredundant 'ui:placeholder' and 'ui:help' for each field.
                    Include any additional properties for each field to customize the form's presentation.`,
                    properties: {}
               }
           },
           required: ['id', 'jsonSchema', 'uiSchema']
       }
    },
  
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
            /*
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
            */
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
        name: 'create_interactive_checklist',
        description: 'This function dynamically generates an interactive checklist based on user inputs. Designed to enable users to efficiently manage tasks, goals, or items, this checklist can be customized with various options and states. It is ideal for applications in task management, event planning, or any scenario where a list of items needs to be tracked and updated.',
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
                                description: 'Unique identifier for the item. This helps in tracking and updating individual checklist items.'
                            },
                            label: {
                                type: 'string',
                                description: 'Text label for the checklist item. This should clearly describe the task or action to be taken.'
                            },
                            checked: {
                                type: 'boolean',
                                description: 'Indicates whether the checklist item is initially marked as completed (true) or pending (false).'
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
        // model: 'gpt-4-1106-preview',
        model: 'gpt-4-0125-preview',
        stream: true,
        messages: [
            {
                // id: nanoid(),
                role: 'system',
                content: `
You are an intelligent assistant specializing in understanding user needs and intentions for the purpose of dynamically constructing a context-dependent UI using available components.

When you receive a user's input, your first task is to decipher the user's intention. Consider the context, the specifics of the request, and any underlying needs or goals. If the request is ambiguous or lacks detail, ask targeted follow-up questions to gather the necessary information. Your aim is to develop a clear and comprehensive understanding of what the user wants to achieve, such that you can invoke the following tools to display to the user:

Available tools:
- Interactive Map: Essential for travel planning, event locations, and potentially home automation control.
- 3D Rendering Engine: For interior design, home automation visualization, and potentially for event space planning.
- Customizable Forms/Input Components: To present to a user to ask them follow up questions that clarify their intent.

Instructions: 
- If you need further context from the user to understand their intention sufficient enough to generate a good UI, respond with 3-5 follow-up questions or statements to clarify the user's intention. Focus on understanding the specific requirements, preferences, or constraints related to their request.
- If you have only 1 quick follow-up question then use chat, otherwise must always use the 'create_simple_form' function.
`
                //                 content: `
                // Now you are an advanced interface designer, capable of creating structured UI schemas based on the available user requirements.

                // Now that you have analyzed the user's intentions, your next step is to design an interactive, user-friendly form that captures all necessary follow up information to address their request. Use the insights gathered from these follow-up questions to construct a YAML schema and corresponding UI schema that will guide the user through providing detailed and specific information.

                // Instructions:
                // - Only return correctly formatted JSON output which satisfies the AskUserQuestions type and no comments. Then, create a UI schema focusing on user-friendly interaction methods
                // - Communicate using only the TypeScript types RJSFSchema, UiSchema
                // - Must always use block scalar indicator style in YAML
                // - Make sure you always add help text to input fields
                // - For each form field, start with a sensible default
                // Bonus:
                // - After gathering all the user input, summarize the user's intent in a concise statement, which will inform the choice and configuration of the UI tools that will be invoked using the JSON output from this step.
                // `
            },
            // {
            //     id: nanoid(),
            //     role: 'assistant',
            //     function_call: `{"function_call": {"name": "create_simple_form", "arguments": "{\n  \"id\": \"trip_planning_form\",\n  \"jsonSchema\": \"{\\\"title\\\":\\\"Lake Tahoe Trip Planning\\\",\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"dates\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What are the intended dates for your trip?\\\",\\\"format\\\":\\\"date\\\"},\\\"transportation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"How do you plan to get to Lake Tahoe?\\\",\\\"enum\\\":[\\\"Car\\\",\\\"Bus\\\",\\\"Train\\\",\\\"Plane\\\",\\\"Other\\\"]},\\\"accommodation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What type of accommodation are you looking for?\\\",\\\"enum\\\":[\\\"Hotel\\\",\\\"Motel\\\",\\\"Cabin\\\",\\\"Resort\\\",\\\"Airbnb\\\"]},\\\"activities\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What activities are you interested in at Lake Tahoe?\\\",\\\"description\\\":\\\"e.g., skiing, hiking, boating\\\"},\\\"budget\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What is your budget for the trip per person?\\\"},\\\"preferences\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"Do you have any specific preferences or needs for this trip`,
            // }
            ...messages,
        ],
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
