'use client';

import Home from '@/components/home';
import Sidebar from '@/components/sidebar';
import { useChat } from 'ai/react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';

const Map = dynamic(() => import('../../components/map/map'), {
    ssr: false,
});

import './style.css';

export default function Component() {
    const [query, setQuery] = useState('');
    const [mode, setMode] = useState('home')

    const { messages, append, input, handleInputChange, handleSubmit } = useChat({
        api: '/api/chat-with-functions-2'
    });

    const runQuery = (query: string) => {
        setQuery(query);
        console.log('run query', query)
        append({
            id: 'abc123',
            role: 'user',
            content: query,
            createdAt: new Date(),
        });
        setMode('tools');
    };

    return (
        <>
        <Head>
            <title>Alvea - UI Demo`</title>
        </Head>
        <div className={`mode-${mode}`}>
            <Home runQuery={runQuery}/>
            <div className={"tools"}>
                <Sidebar messages={messages}/>
            </div>
        </div>
      </>
    )
  }
  
  