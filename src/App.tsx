import { useMemo, useState } from "react";
import "./App.css";
import ConfigInput from "./components/organisms/ConfigInput";
import ConfigOutput from "./components/organisms/ConfigOutput";
import logo from "./logo.svg";
import generateUris from "./uri-gen";

function App() {
  const [rawData, setRawData] = useState("");

  const generatedUris = useMemo(() => {
    if (rawData === "") {
      return [];
    }
    return generateUris(rawData);
  }, [rawData]);

  return (
    <main className="App">
      <img src={logo} className="App-logo" alt="logo" />
      <ConfigInput setRawData={setRawData} />
      <ConfigOutput outboundUrls={generatedUris} />
    </main>
  );
}

export default App;
