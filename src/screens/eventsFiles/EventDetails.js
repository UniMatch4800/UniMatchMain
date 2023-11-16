import React, { useState, useEffect } from "react";
import "./EventDetails.css";
import { Carousel } from "react-responsive-carousel";
import { FaRegArrowAltCircleLeft } from 'react-icons/fa';

function EventDetails({ event, onClose }) {
  const [showImageOverlay, setShowImageOverlay] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    // Reset the index to 0 when a new event is selected
    setSelectedImageIndex(0);
  }, [event]);

  const images =
    event && event.images
      ? event.images.map((image, index) => ({
        original: image,
        thumbnail: image,
        originalWidth: 200,
        originalHeight: 200,
      }))
      : [];

  const openImageOverlay = (index) => {
    setShowImageOverlay(true);
  };

  const closeImageOverlay = () => {
    setShowImageOverlay(false);
  };

  if (!event) {
    return null;
  }

  return (
    <div className="event-details-container">
      {isMobile && (
        <div className="back-btn-and-title">
          <div className="back-button-events" onClick={onClose}>
            <FaRegArrowAltCircleLeft />
          </div>
          <h2 className="event-title">{event.title}</h2>
        </div>
      )}
      <div className="carousel-container">
        <Carousel
          selectedItem={selectedImageIndex}
          onChange={(index) => setSelectedImageIndex(index)}
          showArrows={true}
          showStatus={true}
          showThumbs={true}
        >
          {images.map((image, index) => (
            <div key={index} className="carousel-image" onClick={() => openImageOverlay(index)}>
              <img src={image.original} alt={event.title} className="carousel-image" />
            </div>
          ))}
        </Carousel>
      </div>

      <div className="data-box">
        {!isMobile && (
          <h2 className="event-title">{event.title}</h2>
        )}
        <p className="eventDate">
          Date: {event.date ? new Date(event.date).toLocaleDateString() : ""}
        </p>

        <p className="eventPrice">Price: ${event.price}</p>
        <p className="eventLocation">Location: {event.location}</p>
        <p className="eventDescription">Description: {event.description}</p>
      </div>

      {showImageOverlay && (
        <div className="image-overlay" onClick={closeImageOverlay}>
          {selectedImageIndex < images.length ? (
            <img src={images[selectedImageIndex].original} alt={event.title} />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default EventDetails;
