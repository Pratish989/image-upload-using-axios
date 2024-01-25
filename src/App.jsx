import { useState } from "react";
import "./App.css";
import axios from "axios";
import UploadImage from "./UploadImage";

const baseUrl = "http://192.168.1.209:3000/api/v1/uploadMultiImage";

function App() {
  const [files, setFiles] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [fileErrors, setFileErrors] = useState([]);
  // const [ errorState, setErrorState] = useState(false)
  const [disabled, setDisabled] = useState(false);
  console.log(disabled);

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

  const chooseImages = (e) => {
    // console.log(files)
    // console.log(disabled)
    if (disabled) {
      setDisabled(!disabled);
    }
    const selectedFiles = e.target.files;
    console.log(selectedFiles);
    const newFiles = [];
    const newErrors = [];

    if (selectedFiles.length > 5) {
      newErrors.push(`You can't choose more than 5 images`);
      setDisabled(true);
    } else {
      for (let i = 0; i < Math.min(5, selectedFiles.length); i++) {
        const file = selectedFiles[i];
        console.log(file);

        if (file.size > maxAllowedSize) {
          setDisabled(true);
          newErrors.push(
            `${file.name} is too big! Max size allowed up to 5mb `
          );
        } else if (
          !file.name.match(
            /\.(jpg|jpeg|png|gif|heic|avif|PNG|JPG|JPEG|svg|SVG|APNG|HEIC|bmp)$/
          )
        ) {
          newErrors.push(
            `\n  ${file.name} is not an image. Unsupported extension!`
          );
          setDisabled(true);
        } else {
          newFiles.push(file);
          // setDisabled(false)
        }
      }
    }
    setFiles(newFiles);
    setFileErrors(
      newErrors.map((error) => (
        <p key={error}>
          {error}
          <br />
        </p>
      ))
    );
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
      <UploadImage />
      <div className="error-div">
        <p style={{ color: "red", fontSize: "15px" }}>{fileErrors}</p>
        <p style={{ color: "greenyellow" }}>{successMessage}</p>
      </div>
      <form>
        <div className="upload-section">
          <div className="choose-file-section">
            <input
              type="file"
              name="file"
              id="images"
              accept="*"
              multiple
              onChange={chooseImages}
            />
          </div>
          <br />
          <div className="image-show">
            <div className="image-panel">
              {files.map((file, index) => (
                <div key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{ height: "100px", width: "100px" }}
                  />
                  <button
                    className="remove-button"
                    type="button"
                    key={index}
                    onClick={() => removeImage(index)}
                  >
                    X
                  </button>
                  <p>{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="upload-button-div">
          <button
            disabled={files.length === 0 || disabled}
            onClick={onUploadImages}
            className="upload-button"
            type="button"
          >
            Upload
          </button>
        </div>
      </form>
    </>
  );
}

export default App;
