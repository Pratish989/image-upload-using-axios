import { useState } from "react";
import "./App.css";
import axios from "axios";

const baseUrl = "http://192.168.1.209:3000/api/v1/uploadMultiImage";

function App() {
  const [files, setFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fileErrors, setFileErrors] = useState([])
  const [fileErrorMessage, setFileErrorMessage] = useState("");

  const onUploadImages = async (e) => {
    e.preventDefault();
    console.log(files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file", file);
    });

    try {
      console.log({ files });
      const response = await axios.post(baseUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Images successfully uploaded");
      console.log(response);
    } catch (err) {
      console.log(err.response);
    }
  };

  // const chooseImages = (e) => {
  //   const selectedFiles = e.target.files;
  //   const newFiles = [];

  //   if (selectedFiles.length > 5) {
  //     setFileErrorMessage("You can't choose more than 5 images");
  //     setSuccessMessage("");
  //   } else {
  //     for (let i = 0; i < Math.min(5, selectedFiles.length); i++) {
  //       const file = selectedFiles[i];
  //       console.log(file);
  //       if (file.size > maxAllowedSize) {
  //         setFileErrorMessage(`${file.name} is too big! Max size allowed up to 5mb`)
  //       } else if (file.type !== "image/*") {
  //         setFileErrorMessage(`${file.name} is not an image. Unsupported extension`)
  //       } else if(file.type === "image/*"){
  //         newFiles.push(file)
  //       }
  //     }
  //   }
  // };


  const chooseImages = (e) => {
    const selectedFiles = e.target.files;
    const newFiles = [];
    const newErrors = []

    if (selectedFiles.length > 5) {
      setFileErrorMessage("You can't choose more than 5 images")

    } else {
      for (let i = 0; i < Math.min(5, selectedFiles.length); i++) {
        const file = selectedFiles[i];
        console.log(file)

        if (file.size > maxAllowedSize) {
          setFileErrorMessage(`${file.name} is too big! Max size allowed up to 5mb`)
        } else if (
          !file.name.match(/\.(jpg|jpeg|png|gif|heic|avif|JPG|JPEG)$/)
        ) {
          newErrors.push(`\n  ${file.name} is not an image. Unsupported extension! `)
          // setFileErrorMessage(`${file.name} is not an image. Unsupported extension`)
        } else  {
          newFiles.push(file);
        }
      } 
    }

    setFiles(newFiles);
    setFileErrors(newErrors)

  };


  const removeImage = (index) => {
    console.log(`Image at ${index} removed`);
    const tempArr = [...files];
    const newFiles = tempArr.filter((file, i) => i !== index);
    console.log(newFiles);
    setFiles(newFiles);
  };

  const maxAllowedSize = 5 * 1024 * 1024;

  return (
    <>
      <h3>Multiple image </h3>
      <h4 style={{color:"red"}}>{fileErrors}</h4>
      <p style={{ color: "greenyellow" }}>{successMessage}</p>
      <h4 style={{ color: "red" }}>{fileErrorMessage}</h4>
      <form>
        <div className="upload-section">
          <input
            type="file"
            name="file"
            id="images"
            accept="*"
            multiple
            onChange={chooseImages}
          />
          <br />
          <div className="image-panel">
            {files.map((file, index) => (
              <div key={index}>
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  style={{ height: "100px", width: "100px" }}
                />
                <button
                  type="button"
                  key={index}
                  onClick={() => removeImage(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          <button
            disabled={files.length === 0}
            onClick={onUploadImages}
            className="upload-button"
          >
            Upload
          </button>
        </div>
      </form>
    </>
  );
}

export default App;

