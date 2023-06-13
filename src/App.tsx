import { useMemo, useState } from "react";
import "./App.css";
import ConfigInput from "./components/ConfigInput";
import logo from "./logo.svg";
import generateUris from "./uri-gen";

function App() {
  const [rawData, setRawData] = useState("");

  const generatedUris = useMemo(() => {
    if (rawData === "") {
      return null;
    }
    return generateUris(rawData);
  }, [rawData]);

  return (
    <main className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <ConfigInput setRawData={setRawData} />

      {generatedUris?.map((uri) => (
        <code
          style={{
            display: "block",
            overflowX: "auto",
            whiteSpace: "nowrap",
          }}
          key={uri}
        >
          {uri}
        </code>
      ))}
    </main>
  );
}

export default App;
