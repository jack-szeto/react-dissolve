import React, { useState } from 'react';
import './App.scss';
import DissolveEffect from 'react-dissolve';
import {FpsView} from "react-fps";
import sample from './assets/example.jpg';

function App() {
  const [handles, setHandles] = useState(true);
  console.log("DissolveEffect", DissolveEffect);
  
  return (
    <div className="App">
      <header className="dissolve-effect">
        <h1>Dissolve Effect</h1>
      </header>
      <label>
        Use Handles <input type="checkbox" onChange={(e)=>setHandles(e.target.checked)} checked={handles} />
      </label>
      <section>
        <div className="container">
          <DissolveEffect 
            width={500}
            height={500}
            handle={handles}
            src={sample}
            debug
            animate={"none"}
            style={{
              maxWidth: "100%"
            }}
          />
        </div>
        <figure>
          <caption>Sample</caption>
          <img src={sample} alt="" style={{width: 500, height: 500, objectFit: "cover"}} />
        </figure>
      </section>
      <div className="section"></div>
      {process.env.NODE_ENV === "development" && <FpsView />}
    </div>
  );
}

export default App;
