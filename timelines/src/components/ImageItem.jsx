import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';

const ItemType = {
  IMAGE: 'image',
};

const ImageItemEdit = ({ image, index, moveImage, deleteImage }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemType.IMAGE,
    hover(item) {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1, position: 'relative' }}>
      <img
        className="entry-image"
        src={URL.createObjectURL(image)}
        alt="Attached"
        onClick={() => window.open(URL.createObjectURL(image), '_blank')}
      />
      <button
        style={{ position: 'absolute', top: 0, right: 0 }}
        onClick={() => deleteImage(index)}
      >
        Delete
      </button>
    </div>
  );
};

const ImageItemCreate = ({ image, index, moveImage }) => {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: ItemType.IMAGE,
    hover(item) {
      if (item.index !== index) {
        moveImage(item.index, index);
        item.index = index;
      }
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType.IMAGE,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  return (
    <div ref={ref} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <img className="entry-image" src={URL.createObjectURL(image)} alt="Attached" />
    </div>
  );
};

export { ImageItemEdit, ImageItemCreate };