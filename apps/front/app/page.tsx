"use client";

import React, { useState, useEffect } from 'react';

function Page() {
  const [filename, setFilename] = useState<string>('');
  const [data, setData] = useState([]);
  const [folders, setFolders] = useState([]);
  const [mode, setMode] = useState<string>("RCA");
  const [size, setSize] = useState<number>(2);
  const [nation, setNation] = useState<string[]>(["Thailand", "Thailand"]);

  useEffect(() => {
    const fetchFolders = async () => {
      const response = await fetch("http://localhost:8000/get_folders");
      const json = await response.json();
      if (json.folders) {
        setFolders(json.folders);
      }
    };
    fetchFolders();
  }, []);

  const fetchData = async () => {
    const response = await fetch(`http://localhost:8000/read_csv?filename=${filename}`);
    const json = await response.json();
    setData(json);
  };

  const handleSetMode = () => {
    setMode(mode === 'RCA' ? 'RCD' : 'RCA');
  };

  return (
    <div>
      <br />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-10 text-right">RCA</span>
        <div onClick={handleSetMode} className={`w-20 h-10 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${mode === 'RCD' ? 'bg-blue-500' : 'bg-green-500'}`} >
          <div className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${mode === 'RCD' ? 'translate-x-10' : 'translate-x-0'}`} />
        </div>
        <span className="text-sm font-medium w-10 text-left">RCD</span>
      </div><br /><br />

      {Array.from({ length: size }, (_, i) => (
        <span key={i} className="bg-white border-black border-[1px] text-center p-[1em] my-[10px]" >
          <select value={nation[i]} onChange={e => { const temp = [...nation]; temp[i] = e.target.value; setNation(temp); }}>
            {folders.map((folder, index) => (
              <option key={index} value={folder}>
                {folder}
              </option>
            ))}
          </select>
        </span>
      ))}<br /><br />

      <button onClick={fetchData}>โหลดไฟล์</button>

    </div>
  );
}

export default Page;