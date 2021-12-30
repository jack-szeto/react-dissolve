import React, { useState } from 'react';
import './App.scss';
import DissolveEffect, {easing} from 'react-dissolve';
import {FpsView} from "react-fps";

function App() {
  const [handles, setHandles] = useState(true);
  console.log("DissolveEffect", DissolveEffect);
  console.log("FpsView", FpsView);
  console.log(easing);
  console.log(useState);
  
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
            debug
            style={{
              maxWidth: "100%"
            }}
          />
        </div>
      </section>
      <div className="section"></div>
      {process.env.NODE_ENV === "development" && <FpsView />}
    </div>
  );
}

export default App;
