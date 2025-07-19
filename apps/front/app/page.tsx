"use client";

import React, { useState, useEffect } from 'react';

function Page() {
  const [filename, setFilename] = useState('');
  const [data, setData] = useState([]);
  const [folders, setFolders] = useState([]);

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

  return (
    <div>
      <label>select: </label>
      <select value={filename} onChange={e => setFilename(e.target.value)}>
        <option value="">-- select the ... --</option>
        {folders.map((folder, index) => (
          <option key={index} value={folder}>
            {folder}
          </option>
        ))}
      </select>
      <button onClick={fetchData}>โหลดไฟล์</button>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default Page;