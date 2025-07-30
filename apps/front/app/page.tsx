"use client";

import React, { useState, useEffect } from 'react';
import * as XLSX from "xlsx";

function Page() {
  const [data, setData] = useState<Record<string, string | number>[]>([]);
  const [optionList, setOptionList] = useState<string[]>([]);
  const [mode, setMode] = useState<string>("RCA");
  const [size, setSize] = useState<number>(2);/* amount of nation */
  const [precis, setPrecis] = useState<number>(2);
  const [nation, setNation] = useState<string[]>([]);
  const [firstNa,setFirstNa] = useState<string>("");


  useEffect(() => {
    (async () => {
      const res = await fetch(`http://localhost:8000/getOptionList?mode=${mode}`);
      const json = await res.json();
      if (json.optionList) {
        setOptionList(json.optionList);
        setFirstNa(json.optionList[0]);
        const firstNation=json.optionList[0];
        const temp:string[]=[];
        for(let i:number=0;i<size;i++){
          temp.push(firstNation);
        }
        setNation(temp);
      }
    })()
  }, []);

  const gen = async () => {
    const query = [
      ...nation.map(n => `filename=${encodeURIComponent(n)}`),
      `mode=${encodeURIComponent(mode)}`
    ].join("&");
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
    (async () => {
      const res = await fetch(`http://localhost:8000/getOptionList?mode=${newmode}`);
      const json = await res.json();
      if (json.optionList) {
        setOptionList(json.optionList);
      }
    })()
    setMode(newmode);
    setData([]);
  };

  const handleExportELSX = () => {
  var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    if(mode==="RCA"){
      XLSX.writeFile(wb, "RCA.xlsx");
    }
    else{
      XLSX.writeFile(wb, "RCD.xlsx");
    }
  };

  const handleChangeSize = (event:React.ChangeEvent<HTMLInputElement>) =>{
    const now:number=size;
    let newVal:number=Number(event.target.value);
    if(newVal<1){
      newVal=1;
    }
    else if(newVal>10){
      newVal=10;
    }
      const temp:string[]=nation;
      for(let i:number=now;i<newVal;i++){
        temp.push(firstNa);
      }
      for(let i:number=now;i>newVal;i--){
        temp.pop()
      }
      setNation(temp);
      setSize(newVal);
  }

  const handleChangePrecis = (event:React.ChangeEvent<HTMLInputElement>) =>{
    if(Number(event.target.value)<1){
      setPrecis(1);
    }
    else if(Number(event.target.value)>10){
      setPrecis(10);
    }
    else{
      setPrecis(Number(event.target.value));
    }
  }

  return (
    <div>
      <br />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-10 text-right">RCA</span>
        <div onClick={handleSetMode} className={`w-20 h-10 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${mode === 'RCD' ? 'bg-blue-500' : 'bg-green-500'}`} >
          <div className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${mode === 'RCD' ? 'translate-x-10' : 'translate-x-0'}`} />
        </div>
        <span className="text-sm font-medium w-10 text-left">RCD</span>
      </div>
      Size: <input type="number" value={size} onChange={handleChangeSize}/><br/>
      precis: <input type="number" value={precis} onChange={handleChangePrecis}/><br/>

      <br /><br />
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
      <button onClick={handleExportELSX}>Download</button>
      <br/>
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
                  i < 2 ? <td key={i}>{value}</td> : value == '0' ? <td key={i}>0</td> :
                  <td key={i}>{Number(value).toFixed(precis)}</td>
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