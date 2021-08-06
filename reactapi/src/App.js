import React, {useState, useEffect} from 'react';

import './App.css';

function DataFetch() {
  const [post, setPost] = useState({});
  const [id, setId] = useState(1);

  const [idClick, setIdClick] = useState(1);

  useEffect(() => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${idClick}`)
        .then(res => res.json())
        .then(data => {
          console.log("data", data);
          console.log(data.title);
          setPost(data);
        })
        .catch(err => {
          console.erro(err);
        });
  }, [idClick])

  const handleClick = () => {
    setIdClick(id);
  }

  return (
    <div>
      <input type="text" value={id} onChange={e => setId(e.target.value)} />
      <button type="button" onClick={handleClick}>Fetch post</button>
      <div>{post.title}</div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <DataFetch />
    </div>
  );
}

export default App;
