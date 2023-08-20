import { useState, useRef } from "react";
import "./App.css";
import { ReactSketchCanvas } from "react-sketch-canvas";

function App() {
  const sketchRef = useRef(null);
  const [dataURI, setDataURI] = useState("");
  const [prediction, setPrediction] = useState("");

  const handleClear = () => {
    sketchRef.current.clearCanvas();
  };

  const handleSave = async () => {
    const exportImage = sketchRef.current?.exportImage;

    if (exportImage) {
      const exportedDataURI = await exportImage("png");
      setDataURI(exportedDataURI);

      // Send the dataURI to Flask backend
      try {
        // const dataURIToSend = `data:image/png;base64,${exportedDataURI}`;
        // console.log(dataURIToSend)
        const response = await fetch(
          "https://mnist-virtual.onrender.com/process-canvas-image/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ dataURI: exportedDataURI }),
          }
        );

        if (response.ok) {
          const responseText = await response.text();
          console.log("Image sent to Flask server", responseText);
          setPrediction(responseText);
        } else {
          console.error("Error sending image to Flask:", response.statusText);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <>
      <center>
        <h1 style={{ color: "cyan" }}>Mnist dataset</h1>
      </center>
      <center>
        <ReactSketchCanvas
          ref={sketchRef}
          width={400}
          height={400}
          strokeWidth={50}
          strokeColor="black"
        />
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleSave}>Save</button>

        {prediction !== "" && prediction !== undefined ? (
          <h1 style={{ color: "cyan" }}>Prediction: {prediction}</h1>
        ) : (
          null
        )}
      </center>
      <br></br>
      <center>
        <img src={dataURI} alt="Drawn Canvas" />
      </center>
    </>
  );
}

export default App;
