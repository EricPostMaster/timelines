import React from 'react';
import { DndProvider, HTML5Backend } from 'react-dnd';
import ImageItem from './ImageItem';

const ImagePreview = ({ images, existingImageUrls, moveImage, deleteImage, deleteExistingImage }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="image-preview">
        {existingImageUrls && existingImageUrls.map((imageUrl, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <img
              className="entry-image"
              src={imageUrl}
              alt={`Attached ${index}`}
              onClick={() => window.open(imageUrl, '_blank')}
            />
            <button
              style={{ position: 'absolute', top: 0, right: 0 }}
              onClick={() => deleteExistingImage(index)}
            >
              Delete
            </button>
          </div>
        ))}
        {images && images.map((image, index) => (
          <ImageItem
            key={index}
            index={index}
            image={image}
            moveImage={moveImage}
            deleteImage={deleteImage}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export default ImagePreview;