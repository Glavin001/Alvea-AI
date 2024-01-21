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

export const Form = ({ jsonSchema, uiSchema }) => {
    return <div>
        My Form:
        {/* <pre>
            {JSON.stringify(jsonSchema, null, 2)}
        </pre>
        <pre>
            {JSON.stringify(uiSchema, null, 2)}
        </pre> */}
        <RjsfForm
            className="schema-form"
            // schema={schema}
            schema={jsonSchema}
            uiSchema={uiSchema}
            validator={validator}
            // onChange={log('changed')}
            // onSubmit={log('submitted')}
            // onError={log('errors')}
        />
    </div>;
}

export default Form;
