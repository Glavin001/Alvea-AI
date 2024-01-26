'use client';
import { Message } from 'ai/react';
import { StreamParser, StreamMode } from "openai-partial-stream";
// const { StreamParser, StreamMode } = require("openai-partial-stream");

function parseFunctionCall(functionCall: Message['function_call']) {
    if (typeof functionCall !== 'string') {
        // return functionCall;
        const output2 = functionCall?.arguments ? parseStreamingJsonString(functionCall.arguments) : null;
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
    const output1 = parseStreamingJsonString(functionCall);
    // const topJson: any = output1?.data.function_call;
    const topJson: any = output1?.function_call;
    const output2 = topJson?.arguments ? parseStreamingJsonString(topJson.arguments) : null;
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
    let output: any = null;

    const updateEvery = 1;
    let buffer = '';
    for (let i = 0; i < jsonString.length; i++) {
        const char = jsonString[i];
        const shouldUpdate = i % updateEvery === 0 || i === jsonString.length - 1;
        if (shouldUpdate) {
            // output = jsonStreamParser.parse(char) ?? output;
            const tempParsed: any = jsonStreamParser.parse(char)?.data;
            buffer += char;
            if (tempParsed && Object.keys(tempParsed).length > 0) {
                // output = tempParsed;

                // pick either output or tempParsed based on which is longer when JSON.stringify
                const outputString: string = output && JSON.stringify(output) || '';
                const tempParsedString = JSON.stringify(tempParsed) ?? '';
                output = outputString.length > tempParsedString.length ? output : tempParsed;

                // console.log('char:', char, ' output:', output);
                // console.log('char:', char, ' buffer:', buffer, ' output:', output);
            }
        }
    }

    // let buffer = jsonString;
    // while (buffer.length > 0) {
    //     try {
    //         const tempParsed = jsonStreamParser.parse(buffer);
    //         if (tempParsed && tempParsed.data && Object.keys(tempParsed.data).length > 0) {
    //             output = tempParsed;
    //             break; // Successfully parsed, break the loop
    //         }
    //     } catch (e) {
    //         // Parsing failed, remove the last character and try again
    //     }
    //     buffer = buffer.slice(0, -1);
    // }

    // console.log('json parsed',
    //     jsonString,
    //     output,
    // )
    return output;
}

/**
 * See https://github.com/langchain-ai/langchain/blame/08d3fd7f2e5aec466abb62171e69959f3594771e/libs/core/langchain_core/output_parsers/json.py#L49
 * 
 */
function streamParseJson2(s: string): any {
    // Attempt to parse the string as-is.
    try {
        return JSON.parse(s);
    } catch (e) {
        // if (!(e instanceof JSONDecodeError)) {
        //     throw e; // Re-throw if it's not a JSONDecodeError
        // }
    }

    // Initialize variables.
    let newS = "";
    const stack: string[] = [];
    let isInsideString = false;
    let escaped = false;

    // Process each character in the string one at a time.
    for (const char of s) {
        let currentChar = char;
        if (isInsideString) {
            if (currentChar === '"' && !escaped) {
                isInsideString = false;
            } else if (currentChar === "\n" && !escaped) {
                currentChar = "\\n"; // Replace the newline character with the escape sequence.
            } else if (currentChar === "\\") {
                escaped = !escaped;
            } else {
                escaped = false;
            }
        } else {
            if (currentChar === '"') {
                isInsideString = true;
                escaped = false;
            } else if (currentChar === "{") {
                stack.push("}");
            } else if (currentChar === "[") {
                stack.push("]");
            } else if (currentChar === "}" || currentChar === "]") {
                if (stack.length > 0 && stack[stack.length - 1] === currentChar) {
                    stack.pop();
                } else {
                    // Mismatched closing character; the input is malformed.
                    return null;
                }
            }
        }

        // Append the processed character to the new string.
        newS += currentChar;
    }

    // If we're still inside a string at the end of processing,
    // we need to close the string.
    if (isInsideString) {
        newS += '"';
    }

    // Try to parse mods of string until we succeed or run out of characters.
    while (newS) {
        let finalS = newS;

        // Close any remaining open structures in the reverse
        // order that they were opened.
        for (const closingChar of stack.reverse()) {
            finalS += closingChar;
        }

        // Attempt to parse the modified string as JSON.
        try {
            return JSON.parse(finalS);
        } catch (e) {
            // if (!(e instanceof JSONDecodeError)) {
            //     throw e; // Re-throw if it's not a JSONDecodeError
            // }

            // If we still can't parse the string as JSON,
            // try removing the last character
            newS = newS.slice(0, -1);
        }
    }

    // If we got here, we ran out of characters to remove
    // and still couldn't parse the string as JSON, so return the parse error
    // for the original string.
    try {
        return JSON.parse(s);
    } catch (e) {
        // return e; // Return the parse error
        return null;
    }
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

export function parseStreamingJsonString(nominalJsonString: string): any {
    try {
        if (typeof nominalJsonString !== 'string') {
            console.warn('parseStreamingJsonString: input is not a string', nominalJsonString);
            return nominalJsonString;
        }
        return JSON.parse(nominalJsonString);
    } catch (error1) {
        // return null; // TODO: streaming
        try {
            return streamParseJson(nominalJsonString);
        } catch (error2) {
            return null;
            // Define a regular expression pattern to match "key": `value` pairs
            const pattern = /"([^"]+)": `((?:[^`\\]|\\.)*)`/g;
            // console.log("Correcting invalid JSON string...");
            const replaceMatch = (match: string, key: string, value: string): string => {
                value = value.replace(/"/g, '\\"').replace(/\\`/g, '`').replace(/\n/g, '\\n'); // Replace " with \" and \` with `
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

export function parseStreamingFunctionCall(functionCall: string) {
    let output = parseStreamingJsonString(functionCall);
    const argsPrefix = `"arguments": "{`;
    // check if output has "name" and "arguments" keys
    // console.log('output', output);

    output = output?.function_call ?? output;

    const functionCallObject = {
        name: output?.name,
        arguments: output?.arguments,
    };

    // if (output?.name && output?.arguments && Object.keys(output?.arguments).length === 0) {
    // if (output?.name && output?.arguments && output?.arguments === '{}') {
    if (output?.name && output?.arguments) {
        // find argsPrefix starting index
        // get string after argsPrefix - 1 (for opening "{")
        const argsStartIndex = functionCall.indexOf(argsPrefix) + argsPrefix.length - 1;
        const argsString = functionCall.slice(argsStartIndex);
        const cleanArgsString = argsString.replace(/\\"/g, '"');
        console.log('argsString', argsString)
        console.log('cleanArgsString', cleanArgsString)
        const argsJson = parseStreamingJsonString(argsString);
        const cleanArgsJson = parseStreamingJsonString(cleanArgsString);
        // functionCallObject.arguments = argsJson;
        // functionCallObject.arguments = cleanArgsJson;
        // JSON.stringify both argsJson and cleanArgsJson and whichever is longest use that
        const argsJsonString = JSON.stringify(argsJson) ?? '';
        const cleanArgsJsonString = JSON.stringify(cleanArgsJson) ?? '';
        functionCallObject.arguments = argsJsonString.length > cleanArgsJsonString.length ? argsJson : cleanArgsJson;
    }
    return {
        function_call: functionCallObject,
    };
}