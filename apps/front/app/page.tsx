"use client";

import React, { useState, useEffect } from 'react';

function Page() {
  const [data, setData] = useState<Record<string, string | number>[]>([]);
  const [optionList, setOptionList] = useState<string[]>([]);
  const [mode, setMode] = useState<string>("RCA");
  const [size, setSize] = useState<number>(2);/* amount of nation */
  const [nation, setNation] = useState<string[]>(["Thailand", "Thailand"]);

  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:8000/getOptionList?mode=${mode}`);
      const json = await res.json();
      console.log(json)
      if (json.optionList) {
        setOptionList(json.optionList);
      }
    })()
  }, []);

  const gen = async () => {
    const query = nation.map(n => `filename=${encodeURIComponent(n)}`).join("&");
    const response = await fetch(`http://localhost:8000/gen?${query}`);
    const json = await response.json();

    const formatted = (json.data as any[][]).map((row: any[]) =>
      Object.fromEntries(
        (json.columns as string[]).map((key: string, i: number) => [key, row[i]])
      )
    );

    setData(formatted);
  };

  const handleSetMode = () => {
    const newmode: string = (mode === 'RCA' ? 'RCD' : 'RCA');
    console.log(newmode);
    (async () => {
      const res = await fetch(`http://localhost:8000/getOptionList?mode=${newmode}`);
      const json = await res.json();
      console.log(json)
      if (json.optionList) {
        setOptionList(json.optionList);
      }
    })()
    setMode(newmode);
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
            {optionList.map((optionList, index) => (
              <option key={index} value={optionList}>
                {optionList}
              </option>
            ))}
          </select>
        </span>
      ))}<br /><br />

      <button onClick={gen}>generate</button>
      <br />
      {Array.isArray(data) && data.length > 0 && (
        <table>
          <thead>
            <tr>
              {data[0] && Object.keys(data[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <br />
    </div>
  );
}

export default Page;