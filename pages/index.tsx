import type {NextPage} from 'next'
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";
import React, {useState} from 'react';
import {Button, Link} from '@mui/material';

import { transpile } from 'typescript';

import {parse as joiToJson} from 'joi-to-json';

import Joi from 'joi/lib/index';
import {jsonSchemaToZod} from 'json-schema-to-zod';

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default) as any,
  { ssr: false }
);

function HomePage() {
  const [initial, setInitial] = React.useState(
    `Joi.object().keys({ 
  name: Joi.string().alphanum().min(3).max(30).required(),
  birthyear: Joi.number().integer().min(1970).max(2013), 
});`
  );
  const [final, setFinal] = React.useState(
    ``
  );

  const [isError, setIsError] = useState(false);

  const convert = () => {
    setIsError(false);

    if (!initial.trim()) {
      setFinal('');
    }

    try {
      (global as any).Joi = Joi;
      (global as any).joi = Joi;
      (global as any).JOI = Joi;
      (global as any).J = Joi;
      (global as any).j = Joi;

      const joiObject = eval(transpile(initial));
      const zodSchema = jsonSchemaToZod(joiToJson(joiObject));
      if (!zodSchema.includes('export')) {
        throw new Error('Something broken in process of conversion, please report any bugs with input data for reproduce it');
      }

      setFinal(zodSchema);
    } catch (e) {
      console.error( e );
      setIsError(true);
    }
  }

  return (
    <div>
      <CodeEditor
        value={initial}
        language="ts"
        placeholder="Please enter TS/JS code."
        onChange={(evn) => setInitial(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button variant="outlined" style={{ margin: '10px auto' }}  onClick={convert}>Convert</Button>
      </div>


      <div style={{ color: 'red', fontSize: '24px', margin: '10px', textAlign: 'center' }}>
        {isError ? 'Code is not valid, check browser console, if it don\'t suggest that is wrong, please open a issue on github and add there your joi schema': ''}
      </div>

      <CodeEditor
        value={final}
        language="ts"
        placeholder="Here will be your zod schema after conversion"
        // onChange={(evn) => setFinal(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "#f5f5f5",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace"
        }}
      />

      <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
        <Link href="https://github.com/HardCoreQual/joi-to-zod">GitHub Repo</Link>
      </div>
    </div>
  );
}

const Home: NextPage = () => {
  return (
    <div>
      <HomePage></HomePage>
    </div>
  )
}

export default Home
