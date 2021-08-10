import React, { useState, useEffect } from "react";

import "./App.css";

const Spaces = (props) => {
  return (
    <div>
      <p>{props.title}</p>
      <ul>
        {props.spaces.map((s) => (
          <li key={s.id}>
            Space :: id:{s.id} - state:{s.state} - data:{s.data} - car:{s.carID}{" "}
            - date:{s.date}
          </li>
        ))}
      </ul>
    </div>
  );
};

const App = () => {
  const [id, setId] = useState();
  const [state, setState] = useState(false);
  const [freeSpaces, setFreeSpaces] = useState([]);
  const [occuppiedSpaces, setOccuppiedSpaces] = useState([]);

  const [create, setCreate] = useState(false);
  const [checkFree, setCheckFree] = useState(false);
  const [checkOccuppied, setCheckOccuppied] = useState(false);
  const [reserveSpace, setReserveSpace] = useState(false);

  const createSpace = async () => {
    if (create === false) {
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/spaces", {
        mode: "cors",
        method: "POST",
        url: "http://localhost:3088",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          data: "reactjs",
        }),
      });
      const jsonData = await response.json();
    } catch (error) {
      console.error(error);
    }
    setCreate(false);
  };

  const loadSpace = async () => {
    if (state === false) {
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/spaces", {
        mode: "cors",
        method: "GET",
        url: "http://localhost:3088",
        headers: {
          "Content-type": "application/json",
        },
      });
      const jsonData = await response.json();
    } catch (error) {
      console.error(error);
    }
    setState(false);
  };

  const checkFreeSpaces = async () => {
    if (checkFree === false) {
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/spaces?state=free", {
        mode: "cors",
        method: "GET",
        url: "http://localhost:3088",
        headers: {
          "Content-type": "application/json",
        },
      });
      const jsonData = await response.json();
      setFreeSpaces(jsonData);
    } catch (error) {
      console.error(error);
    }
    setCheckFree(false);
  };

  const checkOccupiedSpaces = async () => {
    if (checkOccuppied === false) {
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:5000/spaces?state=in-use",
        {
          mode: "cors",
          method: "GET",
          url: "http://localhost:3088",
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      const jsonData = await response.json();
      setOccuppiedSpaces(jsonData);
    } catch (error) {
      console.error(error);
    }
    setCheckOccuppied(false);
  };

  const checkReserve = async () => {
    if (reserveSpace === false) {
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/reservations", {
        mode: "cors",
        method: "POST",
        url: "http://localhost:3088",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          placa: "RE4C7",
        }),
      });
      const jsonData = await response.json();
    } catch (error) {
      console.error(error);
    }
    setReserveSpace(false);
  };

  const handleClick = (e) => {
    setCreate(true);
  };

  const checkFreeClick = (e) => {
    setCheckFree(true);
  };

  const checkOccuppiedClick = (e) => {
    setCheckOccuppied(true);
  };

  const reserveSpaceClick = (e) => {
    setReserveSpace(true);
  };

  useEffect(() => {
    checkReserve();
  }, [reserveSpace]);

  useEffect(() => {
    checkOccupiedSpaces();
  }, [checkOccuppied]);

  useEffect(() => {
    checkFreeSpaces();
  }, [checkFree]);

  useEffect(() => {
    createSpace();
  }, [create]);

  useEffect(() => {
    loadSpace();
  }, [state]);

  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="space_id"
          value={id}
          onChange={(e) => setId(e.target.value)}
        ></input>
        <button type="button" onClick={handleClick}>
          crear espacio
        </button>
        <button type="button" onClick={checkFreeClick}>
          consultar libres
        </button>
        <button type="button" onClick={checkOccuppiedClick}>
          consultar ocupados
        </button>
        <button type="button" onClick={reserveSpaceClick}>
          reservar
        </button>
      </div>
      <Spaces title={"free spaces"} spaces={freeSpaces} />
      <Spaces title={"occupied spaces"} spaces={occuppiedSpaces} />
    </div>
  );
};

export default App;
