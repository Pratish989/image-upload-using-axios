import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const baseUrl = "http://192.168.1.209:3000/api/v1/uploadSingleImage";

function App() {
  const [files, setFiles] = useState([]);
  const [fileErrors, setFileErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);

  const onUploadImages = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(baseUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage("Images successfully uploaded");
      console.log(response.data);
    } catch (err) {
      console.log(err.response);
    }
  };

  const chooseImages = (e) => {
    const selectedFiles = e.target.files;
    const newFiles = [];
    const newErrors = [];

    if (selectedFiles.length > 5) {
      newErrors.push("You can't choose more than 5 images");
    } else {
      for (let i = 0; i < Math.min(5, selectedFiles.length); i++) {
        const file = selectedFiles[i];

        if (file.size > maxAllowedSize) {
          newErrors.push(`${file.name} is too big! Max size allowed up to 5mb`);
        } else if (
          !(
            file.type === "image/jpg" ||
            file.type === "image/jpeg" ||
            file.type === "image/png"
          )
        ) {
          newErrors.push(`${file.name} is not an image. Unsupported extension`);
        } else {
          newFiles.push(file);
        }
      }
    }

    setFiles(newFiles);
    setFileErrors(newErrors);
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);

    setFiles(newFiles);
  };

  const maxAllowedSize = 5 * 1024 * 1024;

  return (
    <>
      <div className="upload-section">
        <input
          type="file"
          name="images"
          id="images"
          accept="image/*"
          multiple
          onChange={chooseImages}
        />
        <br />
        {fileErrors.map((error, index) => (
          <p key={index} style={{ color: "red" }}>
            {error}
          </p>
        ))}
        <div className="image-panel">
          {files.map((file, index) => (
            <div key={index} className="selected-image">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                style={{ height: "100px", width: "100px" }}
              />
              <button
                className="remove-button"
                onClick={() => removeImage(index)}
              >
                X
              </button>
            </div>
          ))}
        </div>
        <button disabled={files.length === 0} onClick={onUploadImages}>
          Upload
        </button>
        <p>{successMessage}</p>
      </div>
    </>
  );
}

export default App;
