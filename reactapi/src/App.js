import React, { useState, useEffect } from "react";

import "./App.css";

const Spaces = () => {
  const [spaces, setSpaces] = useState([]);

  const loadSpaces = async () => {
    console.log("loadSpaces");
    try {
      const response = await fetch("http://localhost:3088/spaces", {
        mode: "cors",
        method: "GET",
        url: "http://localhost:3088",
        headers: {
          "Content-type": "application/json",
        },
      });
      const jsonData = await response.json();
      if (Array.isArray(jsonData)) {
        console.log("it IS an array");
        setSpaces(jsonData);
      } else {
        console.log("it is NOT an array");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  useEffect(() => {}, [spaces]);

  return (
    <ul>
      {spaces.map((s) => (
        <li key={s.id}>
          Space :: id:{s.id} - state:{s.state} - data:{s.data} - car:{s.carID} -
          date:{s.date}
        </li>
      ))}
    </ul>
  );
};

const App = () => {
  return (
    <div className="App">
      <Spaces />
    </div>
  );
};

export default App;
