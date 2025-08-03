"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";

function Page() {
  const [data, setData] = useState<Record<string, string | number>[]>([]);
  const [mode, setMode] = useState<string>("RCA");
  const [optionList, setOptionList] = useState<string[]>([]);
  const [nation, setNation] = useState<string>("temp");

  useEffect(() => {
    (async () => {
      const res = await fetch(
        `http://localhost:8000/getOptionList?mode=${mode}`
      );
      const json = await res.json();
      if (json.optionList) {
        setOptionList(json.optionList);
        setNation(json.optionList[0]);
      }
    })();
  }, []);

  const handleSetMode = () => {
    const newmode: string = mode === "RCA" ? "RCD" : "RCA";
    (async () => {
      const res = await fetch(
        `http://localhost:8000/getOptionList?mode=${newmode}`
      );
      const json = await res.json();
      if (json.optionList) {
        setOptionList(json.optionList);
      }
    })();
    setMode(newmode);
    setData([]);
  };

  const handleShow = async () => {
    const query = `nation=${encodeURIComponent(nation)}&mode=${encodeURIComponent(mode)}`;
    const response = await fetch(`http://localhost:8000/getRawdata?${query}`);
    const json = await response.json();

    const formatted = (json.data as any[][]).map((row: any[]) =>
      Object.fromEntries(
        (json.columns as string[]).map((key: string, i: number) => [
          key,
          row[i],
        ])
      )
    );
    setData(formatted);
  };

  const handleExportELSX = () => {
    if (data.length > 0) {
      var wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(data);

      XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
      if (mode === "RCA") {
        XLSX.writeFile(wb, "RCA.xlsx");
      } else {
        XLSX.writeFile(wb, "RCD.xlsx");
      }
    }
  };

  return (
    <div>
      <nav>
        <Link href="../">Back</Link>&nbsp;|&nbsp;<Link href="/map">Map</Link>
      </nav>
      <br />
      <br />
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-10 text-right">RCA</span>
        <div
          onClick={handleSetMode}
          className={`w-20 h-10 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors ${mode === "RCD" ? "bg-blue-500" : "bg-green-500"}`}
        >
          <div
            className={`w-8 h-8 bg-white rounded-full shadow-md transform transition-transform duration-300 ${mode === "RCD" ? "translate-x-10" : "translate-x-0"}`}
          />
        </div>
        <span className="text-sm font-medium w-10 text-left">RCD</span>
        <br />
      </div>

      <br />
      <br />
      <select
        value={nation}
        onChange={(e) => {
          let temp: string | undefined = nation;
          temp = e.target.value;
          setNation(temp);
        }}
      >
        {optionList.map((optionList, index) => (
          <option key={index} value={optionList}>
            {optionList}
          </option>
        ))}
      </select>
      <br />
      <br />
      <button onClick={handleShow}>Show</button>
      <br />
      <button onClick={handleExportELSX}>Download</button>
      <br />
      {Array.isArray(data) && data.length > 0 && (
        <table className="mx-auto">
          <thead>
            <tr>
              {data[0] &&
                Object.keys(data[0]).map((key) => (
                  <th className="pr-[20px] border border-black" key={key}>
                    {key}
                  </th>
                ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.values(item).map((value, i) =>
                  i < 2 ? (
                    <td className="pr-[20px] border border-black" key={i}>
                      {value}
                    </td>
                  ) : value == "0" ? (
                    <td className="pr-[20px] border border-black " key={i}>
                      0
                    </td>
                  ) : Number(value) < 0 ? (
                    <td className="pr-[20px] border border-black " key={i}>
                      n/a
                    </td>
                  ) : (
                    <td className="pr-[20px] border border-black " key={i}>
                      {Number(value)}
                    </td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Page;
