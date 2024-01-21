'use client';

import { FunctionCallHandler, nanoid } from 'ai';
import { Message, useChat } from 'ai/react';
import { OpenAiHandler, StreamParser, StreamMode } from "openai-partial-stream";

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
                    return null;
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
                    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
                    // const json = typeof m.function_call === 'string' ? jsonStreamParser.parse(m.function_call) : m.function_call;
                    const json = parseFunctionCall(m.function_call);
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
                                {/* <pre>{JSON.stringify(m.function_call, null, 2)}</pre> */}
                                <pre>{JSON.stringify(json, null, 2)}</pre>
                                <pre>{json?.arguments?.contents ?? json?.arguments?.code}</pre>
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


function streamParseJson_old(jsonString: string) {
    const jsonStreamParser = new StreamParser(StreamMode.StreamObjectKeyValueTokens);
    // const output = jsonStreamParser.parse(jsonString);
    // pass in jsonString incrementally in chunkd
    let output: any;
    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString[i];
        output = jsonStreamParser.parse(char);
    }

    return output?.data;
}

function streamParseJson(jsonString: string) {
    const jsonStreamParser = new StreamParser(StreamMode.StreamObjectKeyValueTokens);
    // const output = jsonStreamParser.parse(jsonString);
    // pass in jsonString incrementally in chunkd
    let output;
    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString[i];
        output = jsonStreamParser.parse(char) ?? output;
        // console.log('char:', char, ' output:', output);
    }

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

// function processNominalJsonString(nominalJsonString: string): any {
//   try {
//       return JSON.parse(nominalJsonString);
//   } catch (error) {
//       // Define a regular expression pattern to match "key": `value` pairs
//       const pattern = /"([^"]+)": `((?:[^`\\]|\\.)*)`/g;
//       console.log("Correcting invalid JSON string...");

//       const replaceMatch = (match: string, key: string, value: string): string => {
//           value = value.replace(/"/g, '\\"').replace(/\\`/g, '`').replace(/\n/g, '\\n');  // Replace " with \" and \` with `
//           return `"${key}": "${value}"`;
//       };

//       // Use replace to modify the input string
//       const replacedString = nominalJsonString.replace(pattern, replaceMatch);

//       try {
//           // Attempt to parse the modified string as JSON
//           return JSON.parse(replacedString);
//       } catch (parseError) {
//           throw new Error(`Input string was invalid JSON, and we weren't able to fix it. We tried converting:\n\t${nominalJsonString}\n\n...to...\n\t${replacedString}`);
//       }
//   }
// }




function parseStreamingJson(jsonString: string) {
    if (typeof jsonString !== "string") {
        return jsonString;
    }
    try {
        if (!jsonString) {
            return null;
        }
        let fixedJsonString = jsonString.trim();
        // if empty
        if (fixedJsonString === "") {
            return null;
        }

        // If starts with "const" then delete up until the first "{" char.
        if (fixedJsonString.startsWith("const")) {
            const firstOpenBraceIndex = fixedJsonString.indexOf("{");
            if (firstOpenBraceIndex > 0) {
                fixedJsonString = fixedJsonString.slice(firstOpenBraceIndex);
            }
        }

        if (!fixedJsonString.startsWith("{")) {
            // Add prefix {
            fixedJsonString = "{" + fixedJsonString;
        }
        // if ends with ; remove it
        if (fixedJsonString.endsWith(";")) {
            fixedJsonString = fixedJsonString.slice(0, -1).trim();
        }
        // if ends with , remove it
        if (fixedJsonString.endsWith(",")) {
            fixedJsonString = fixedJsonString.slice(0, -1).trim();
        }
        // if ends with , followed by 0 or more whitespace then } replace with }
        // if (fixedJsonString.endsWith(",\s*}")) {
        // use regexp
        // if (fixedJsonString.match(/,\s*}$/)) {
        //   fixedJsonString = fixedJsonString.replace(/,\s*}$/, "}");
        // }

        // replace all , followed by 0 or more whitespace then } with }
        fixedJsonString = fixedJsonString.replace(/,\s*}/g, "}");

        // replace all , followed by 0 or more whitespace then ] with ]
        fixedJsonString = fixedJsonString.replace(/,\s*]/g, "]");

        // collect {, [, and " in order from jsonString
        // const openers = [];
        // for (let i = 0; i < fixedJsonString.length; i++) {
        //   const char = fixedJsonString[i];
        //   if (char === "{" || char === "[") { // || char === '"') {
        //     openers.push(char);
        //   }
        //   // if char is } or ] then pop last opener
        //   if (char === "}" || char === "]") {
        //     openers.pop();
        //   }
        // }

        // if ends with ": then add null
        // if (fixedJsonString.endsWith("\":")) {
        if (fixedJsonString.endsWith(":")) {
            fixedJsonString = fixedJsonString + " null";
        }

        const options = [
            () => fixedJsonString,
            () => {
                return fixedJsonString += "\"";
            }
        ];

        // Loop over options until one works
        let i = 0;
        while (i < options.length) {
            const option = options[i];
            try {
                return parseJsonWithoutQuotes(addJsonClosers(option()));
            } catch (error) {
                i++;
            }
        }
        return null;


        // fixedJsonString += "\"";

        // fixedJsonString = addJsonClosers(fixedJsonString);

        // if openers is not empty then add the closer for each opener
        // console.log("openers", openers)
        // if (openers.length > 0) {
        //   for (let i = 0; i < openers.length; i++) {
        //     const opener = openers[i];
        //     if (opener === "{") {
        //       fixedJsonString = fixedJsonString + "}";
        //     }
        //     if (opener === "[") {
        //       fixedJsonString = fixedJsonString + "]";
        //     }
        //     // if (opener === '"') {
        //     //   fixedJsonString = fixedJsonString + '"';
        //     // }
        //   }
        // }


        // console.log("fixedJsonString", fixedJsonString)
        const json = parseJsonWithoutQuotes(fixedJsonString);
        return json;
    } catch (error) {
        console.error(error);
        return null;
    }
}

function addJsonClosers(jsonString: string) {
    let fixedJsonString = jsonString.trim();

    // collect {, [, and " in order from jsonString
    const openers = [];
    for (let i = 0; i < fixedJsonString.length; i++) {
        const char = fixedJsonString[i];
        if (char === "{" || char === "[") { // || char === '"') {
            openers.push(char);
        }
        // if char is } or ] then pop last opener
        if (char === "}" || char === "]") {
            openers.pop();
        }
    }

    // if openers is not empty then add the closer for each opener
    // console.log("openers", openers)
    if (openers.length > 0) {
        // for (let i = 0; i < openers.length; i++) {
        // reverse order
        for (let i = openers.length - 1; i >= 0; i--) {
            const opener = openers[i];
            if (opener === "{") {
                fixedJsonString = fixedJsonString + "}";
            }
            if (opener === "[") {
                fixedJsonString = fixedJsonString + "]";
            }
            // if (opener === '"') {
            //   fixedJsonString = fixedJsonString + '"';
            // }
        }
    }
    return fixedJsonString;
}

function parseJsonWithoutQuotes(jsonString: string) {
    const fixedJsonString = jsonString.replace(/(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '"$2": ');
    // console.log("fixedJsonString", fixedJsonString)
    const json = JSON.parse(fixedJsonString);
    return json;
}
