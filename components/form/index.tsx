'use client';

import { RJSFSchema } from '@rjsf/utils';
import RjsfForm from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';

// const schema: RJSFSchema = {
//   title: 'Todo',
//   type: 'object',
//   required: ['title'],
//   properties: {
//     title: { type: 'string', title: 'Title', default: 'A new task' },
//     done: { type: 'boolean', title: 'Done?', default: false },
//   },
// };

// const log = (type) => console.log.bind(console, type);

export const Form = ({ jsonSchema, uiSchema, onSubmit }: any) => {
    return <div>
        <RjsfForm
            className="schema-form"
            // schema={schema}
            schema={jsonSchema}
            uiSchema={uiSchema}
            validator={validator}
            // onChange={log('changed')}
            // onSubmit={log('submitted')}
            onSubmit={onSubmit}
            // onError={log('errors')}
        />
        {/*
        <div>JSON schema:</div>
        <pre>
            {JSON.stringify(jsonSchema, null, 2)}
        </pre>
        <div>UI schema:</div>
        <pre>
            {JSON.stringify(uiSchema, null, 2)}
        </pre>
        */}
    </div>;
}

export default Form;
