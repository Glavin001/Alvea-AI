'use client';

import Home from '@/components/home';
import Sidebar from '@/components/sidebar';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useState } from 'react';

const Map = dynamic(() => import('../../components/map/map'), {
    ssr: false,
});

import './style.css';

export default function Component() {
    const [mode, setMode] = useState('home')

    const changeMode = (mode: string) => {
        setMode(mode);
    };

    return (
        <>
        <Head>
            <title>Alvea - UI Demo`</title>
        </Head>
        <div className={`mode-${mode}`}>
            <Home setMode={changeMode} />
            <div className={"tools"}>
                <Sidebar/>
            </div>
        </div>
      </>
    )
  }
  
  