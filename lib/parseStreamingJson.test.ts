import { parseStreamingJsonString, parseStreamingFunctionCall } from './parseStreamingJson';

describe('streamParseJson', () => {
    it('should parse a simple JSON string correctly', () => {
        const jsonString = '{"key": "value"}';
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({ key: 'value' });
    });

    it('should parse a complex JSON string correctly', () => {
        const jsonString = '{"key1": "value1", "key2": {"subKey": "subValue"}}';
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({ key1: 'value1', key2: { subKey: 'subValue' } });
    });

    it('should return partial object for a partial JSON string', () => {
        const jsonString = '{"key": "value", "invalid}';
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({ key: 'value' });
    });

    it('should return object for a double nested stringified JSON string', () => {
        const jsonString = JSON.stringify({
            parent: JSON.stringify({ key: 'value' }),
        });
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({ parent: JSON.stringify({ key: 'value' }) });
    });
    it('should return object for a truncated/partial double nested stringified JSON string', () => {
        const jsonString = JSON.stringify({
            parent: JSON.stringify({ key: 'value' }),
        })
            // truncate a bit to make partial JSON
            .slice(0, -4)
            ;
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({ parent: JSON.stringify({ key: 'value' }) });
    });
    it('should return partial object for a partial JSON string (2)', () => {
        const jsonString = `{"function_call": {"name": "create_simple_form", "arguments": "{\n  \"id\": \"trip_planning_form\",`
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({
            function_call: {
                name: 'create_simple_form',
                // arguments: '{\n  "id": "trip_planning_form"',
                arguments: '{}',
            },
        });
    });

    it.skip('should return partial object for a partial JSON string (2)', () => {
        const jsonString = `{"function_call": {"name": "create_simple_form", "arguments": "{\n  \"id\": \"trip_planning_form\",\n  \"jsonSchema\": \"{\\\"title\\\":\\\"Lake Tahoe Trip Planning\\\",\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"dates\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What are the intended dates for your trip?\\\",\\\"format\\\":\\\"date\\\"},\\\"transportation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"How do you plan to get to Lake Tahoe?\\\",\\\"enum\\\":[\\\"Car\\\",\\\"Bus\\\",\\\"Train\\\",\\\"Plane\\\",\\\"Other\\\"]},\\\"accommodation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What type of accommodation are you looking for?\\\",\\\"enum\\\":[\\\"Hotel\\\",\\\"Motel\\\",\\\"Cabin\\\",\\\"Resort\\\",\\\"Airbnb\\\"]},\\\"activities\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What activities are you interested in at Lake Tahoe?\\\",\\\"description\\\":\\\"e.g., skiing, hiking, boating\\\"},\\\"budget\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What is your budget for the trip per person?\\\"},\\\"preferences\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"Do you have any specific preferences or needs for this trip`
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({
            function_call: {
                name: 'create_simple_form',
                arguments: {
                    id: 'trip_planning_form',
                }
            },
        });
    });

    it('should handle real life example 2', () => {
        const jsonString = '{\"id\":\"trip_plan_lake_tahoe\",\"jsonSchema\":\"{\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"dates\\\":{\\\"type';
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({
            'id': 'trip_plan_lake_tahoe',
            'jsonSchema': '{\"type\":\"object\",\"properties\":{\"dates\":{}}}',
        });
    });
    it('should handle real life example 3', () => {
        const jsonString = '{\"id\":\"trip_plan_lake_tahoe\",\"jsonSchema\":\"{\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"dates\\\":{\\\"type\\\": \\\"hello\\\"';
        const result = parseStreamingJsonString(jsonString);
        expect(result).toEqual({
            'id': 'trip_plan_lake_tahoe',
            'jsonSchema': '{\"type\":\"object\",\"properties\":{\"dates\":{\"type\": \"hello\"}}}',
        });
    });
    describe('parseStreamingFunctionCall', () => {
        it('should return partial object for a partial JSON string (2)', () => {
            const jsonString = `{"function_call": {"name": "create_simple_form", "arguments": "{\n  \"id\": \"trip_planning_form\",`
            const result = parseStreamingFunctionCall(jsonString);
            expect(result).toEqual({
                function_call: {
                    name: 'create_simple_form',
                    // arguments: '{\n  "id": "trip_planning_form"',
                    arguments: {
                        id: 'trip_planning_form',
                    }
                },
            });
        });
        it('should return partial object for a partial JSON string (2)', () => {
            const jsonString = `{"function_call": {"name": "create_simple_form", "arguments": "{\n  \"id\": \"trip_planning_form\",\n  \"jsonSchema\": \"{\\\"title\\\":\\\"Lake Tahoe Trip Planning\\\",\\\"type\\\":\\\"object\\\",\\\"properties\\\":{\\\"dates\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What are the intended dates for your trip?\\\",\\\"format\\\":\\\"date\\\"},\\\"transportation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"How do you plan to get to Lake Tahoe?\\\",\\\"enum\\\":[\\\"Car\\\",\\\"Bus\\\",\\\"Train\\\",\\\"Plane\\\",\\\"Other\\\"]},\\\"accommodation\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What type of accommodation are you looking for?\\\",\\\"enum\\\":[\\\"Hotel\\\",\\\"Motel\\\",\\\"Cabin\\\",\\\"Resort\\\",\\\"Airbnb\\\"]},\\\"activities\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What activities are you interested in at Lake Tahoe?\\\",\\\"description\\\":\\\"e.g., skiing, hiking, boating\\\"},\\\"budget\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"What is your budget for the trip per person?\\\"},\\\"preferences\\\":{\\\"type\\\":\\\"string\\\",\\\"title\\\":\\\"Do you have any specific preferences or needs for this trip`
            const result = parseStreamingFunctionCall(jsonString);
            expect(result).toEqual({
                function_call: {
                    name: 'create_simple_form',
                    arguments: {
                        id: 'trip_planning_form',
                        jsonSchema: "{\"title\":\"Lake Tahoe Trip Planning\",\"type\":\"object\",\"properties\":{\"dates\":{\"type\":\"string\",\"title\":\"What are the intended dates for your trip?\",\"format\":\"date\"},\"transportation\":{\"type\":\"string\",\"title\":\"How do you plan to get to Lake Tahoe?\",\"enum\":[\"Car\",\"Bus\",\"Train\",\"Plane\",\"Other\"]},\"accommodation\":{\"type\":\"string\",\"title\":\"What type of accommodation are you looking for?\",\"enum\":[\"Hotel\",\"Motel\",\"Cabin\",\"Resort\",\"Airbnb\"]},\"activities\":{\"type\":\"string\",\"title\":\"What activities are you interested in at Lake Tahoe?\",\"description\":\"e.g., skiing, hiking, boating\"},\"budget\":{\"type\":\"string\",\"title\":\"What is your budget for the trip per person?\"},\"preferences\":{\"type\":\"string\",\"title\":}}}",
                    }
                },
            });

            const jsonSchemaString = result.function_call.arguments.jsonSchema;
            const jsonSchema = parseStreamingJsonString(jsonSchemaString);
            expect(jsonSchema).toEqual({
                title: 'Lake Tahoe Trip Planning',
                type: 'object',
                properties: {
                    dates: {
                        type: 'string',
                        title: 'What are the intended dates for your trip?',
                        format: 'date',
                    },
                    transportation: {
                        type: 'string',
                        title: 'How do you plan to get to Lake Tahoe?',
                        enum: ['Car', 'Bus', 'Train', 'Plane', 'Other'],
                    },
                    accommodation: {
                        type: 'string',
                        title: 'What type of accommodation are you looking for?',
                        enum: ['Hotel', 'Motel', 'Cabin', 'Resort', 'Airbnb'],
                    },
                    activities: {
                        type: 'string',
                        title: 'What activities are you interested in at Lake Tahoe?',
                        description: 'e.g., skiing, hiking, boating',
                    },
                    budget: {
                        type: 'string',
                        title: 'What is your budget for the trip per person?',
                    },
                    preferences: {
                        type: 'string',
                    },
                },
            });
        });

        it.skip('should handle real life example', () => {
            const jsonString = "{\"function_call\": {\"name\": \"create_simple_form\", \"arguments\": \"{\\\"id\\\":\\\"trip_plan_lake_tahoe\\\",\\\"jsonSchema\\\":\\\"{\\\\\\\"type\\\\\\\":\\\\\\\"object\\\\\\\",\\\\\\\"properties\\\\\\\":{\\\\\\\"dates\\\\\\\":{\\\\\\\"type"
            const result = parseStreamingFunctionCall(jsonString);
            expect(result).toEqual({
                function_call: {
                    name: 'create_simple_form',
                    arguments: {
                        id: 'trip_plan_lake_tahoe',
                        jsonSchema: "{\"type\":\"object\",\"properties\":{\"dates\":{}}}",
                    }
                },
            });
        });

    });
});

