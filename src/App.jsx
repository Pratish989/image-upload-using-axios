/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import "./App.css";
import UploadImage from "./UploadImage";
import axios from "axios";

const baseUrl = "http://192.168.1.209:3000/api/v1/uploadSingleImage";

function App() {
  const [file, setFile] = useState("");
  const [fileError, setFileError] = useState("");
  const [previewError, setPreviewError] = useState(false);
  const [previewMessage, setPreviewMessage] = useState("");
  const [uploadBtn, setUploadBtn] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);

  // function onUpload() {
  //   axios
  //     .post(baseUrl, {
  //       title: "Image Uploaded Succesfully!",
  //       body: "This is a new Image."
  //     })
  //     .then((response) => {
  //       setSuccessMessage(response.data);
  //     });
  // }


  const onUploadImage = async (e)=>{
    e.preventDefault();
    try{
      const response = await axios.post(baseUrl,{ message : "Image successfully uploaded"})
      console.log(response.data)
    }catch (err){
      console.log(err.response)
    }
  }

  function chooseImage(e) {
    console.log(e.target.files[0]);
    setFile(URL.createObjectURL(e.target.files[0]));
    setPreviewMessage(`${e.target.files[0].name}`);

    if (e.target.files[0].size > maxAllowedSize) {
      setFileError(
        <p style={{ color: "red" }}>
          File is too big! Max size allowed upto 5mb{" "}
        </p>
      );
      setPreviewError(true);
      setFile("");
    } else {
      setPreviewError(false);
      setFileError(false);
    }


    if (
      e.target.files[0].type === "image/jpg" ||
      e.target.files[0].type === "image/jpeg" ||
      e.target.files[0].type === "image/png"
    ) {
      console.log("confirm");
      setUploadBtn(false);
    } else {
      console.log("not supported");
      setFileError(
        <p style={{ color: "red" }}>
          File you uploaded is not an Image. Unsupported Extension
        </p>
      );
      setFile("");
      console.log("not supported file format");
    }

    if (
      (e.target.files[0].type === "image/jpg" ||
        e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/png") &&
      e.target.files[0].size > maxAllowedSize
    ) {
      setUploadBtn(true);
    }
  }

  const maxAllowedSize = 5 * 1024 * 1024;
  console.log(maxAllowedSize);

  return (
    <>
      <UploadImage />
      <div className="upload-section">
        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          onChange={chooseImage}
          style={{ position: "absolute" }}
        />{" "}
        <br />
        <p>{fileError}</p>
        {previewError && fileError ? null : (
          <img style={{ height: "500px", width: "500px" }} src={file} />
        )}
        <button
          disabled={uploadBtn ? true : false}
          onClick={onUploadImage}
        >
          Upload
        </button>
        <p>{successMessage}</p>
      </div>
      {/* 
    <h1>{post.title}</h1>
      <p>{post.body}</p> */}
    </>
  );
}

export default App;
