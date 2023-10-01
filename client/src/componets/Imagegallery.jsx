import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import "./image.css";
import { BsPlusCircle } from "react-icons/bs";
import { CgClose } from "react-icons/cg";

export const ImageGallery = () => {
  const [image, setImage] = useState(null);
  const [prevImage, setPrevImage] = useState(null);
  const [imageData, setImageData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [progressbar, setprogressbar] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await axios.get("https://image-gallery-server.vercel.app/images/api");
    
      console.log(response.data, "data in images array");
      setImageData(response.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    setImage(selectedFile);
    setPrevImage(URL.createObjectURL(selectedFile));
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("image_file", image);

    try {
      const response = await axios("https://image-gallery-server.vercel.app/upload",{
      
       method : "POST",
        headers : {
          "Content-Type" : "multipart/form-data",
        },
        data : formData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            setUploadProgress(progress);
          },
        }
      );
      console.log(response.data, "after upload");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setprogressbar(true);
  };

  const openModal = (userClickedImage) => {
    setSelectedImage(userClickedImage);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setIsModalOpen(false);
  };

  const handlecancel = () => {
    setPrevImage("");
  };
  const handleok = () => {
    setprogressbar(false);
    setPrevImage("");
    fetchImages();
  };

  return (
    <>
      <div className="gallery-main-container">
        <div className="gallery-h1">
          <h1>Photo Gallery</h1>
        </div>
        <div>
          <h4>A Picture is Worth thousand Words</h4>
        </div>
        {!prevImage ? (
          <div>
            <div>
              <input
                type="file"
                id="fileinput"
                accept="image/*"
                onChange={handleChange}
                hidden
              />
            </div>
            <div>
              <label className="input" htmlFor="fileinput">
                <BsPlusCircle />
              </label>
            </div>
            <div>
              <h5>Select Your Image</h5>
            </div>
          </div>
        ) : (
          <div>
            <div className="image-container">
              <img src={prevImage} alt="" />
              <button onClick={handlecancel} className="btn">
                <CgClose />
              </button>
            </div>
            <div className="btn2">
              <button onClick={handleUpload}>Upload</button>
            </div>

            {progressbar && (
              <div>
                <div className="error-box">
                  <h3>Your Image Has been Succesfully Uploaded!</h3>
                  <button onClick={handleok}>Ok</button>
                </div>

                <div
                  className="progress bar"
                  role="progressbar"
                  aria-label="Example with label"
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className="progress-bar"
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress}%
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="line"></div>
    
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          appElement={document.getElementById("root")}
          className="selectedimage"
        >
          <div className="btn3">
          <button  onClick={closeModal}><CgClose /></button>
          </div>
          {selectedImage && (
            
            <img
              src={selectedImage}
              className="popup"
              alt=""
            />
          )}
          
        </Modal>
        </div>
     

      <div className="image-con">
        {imageData.map((data, index) => (
          <div key={index} className="image">
            <img
              src={`https://image-gallery-server.vercel.app/images/${data}`}
              // 
              onClick={() => openModal(`https://image-gallery-server.vercel.app/images/${data}`)}
              // 
            />
          </div>
        ))}
      </div>
    </>
  );
};
