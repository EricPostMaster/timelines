import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ImageItemCreate } from './ImageItem';

const SubjectField = ({ subject, setSubject }) => {
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  return (
    <div>
      <label htmlFor="subject">Subject:</label>
      <input
        id="subject"
        type="text"
        value={subject}
        onChange={handleSubjectChange}
        placeholder="e.g. First Date, College Graduation"
      />
    </div>
  );
};

const TextField = ({ entryText, setEntryText }) => {
  const handleTextChange = (value) => {
    setEntryText(value);
  };

  return (
    <div>
      <label htmlFor="entryText">Write your entry:</label>
      <ReactQuill
        value={entryText}
        onChange={handleTextChange}
        placeholder="Type your journal entry here..."
        theme="snow"
      />
    </div>
  );
};

const TagsField = ({ tags, setTags }) => {
    const handleTagsChange = (event) => {
      setTags(event.target.value);
    };
  
    return (
      <div>
        <label htmlFor="tags">Tags (comma separated):</label>
        <input
          id="tags"
          type="text"
          value={tags}
          onChange={handleTagsChange}
          placeholder="e.g. travel, memories, family"
        />
      </div>
    );
};

const ImageUploadField = ({ handleImageChange }) => {
    return (
      <div>
        <label htmlFor="image">Attach images:</label>
        <input
          id="image"
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />
      </div>
    );
};

const ImagePreview = ({ images, moveImage }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="image-preview">
        {images.map((image, index) => (
          <ImageItemCreate
            key={index}
            index={index}
            image={image}
            moveImage={moveImage}
          />
        ))}
      </div>
    </DndProvider>
  );
};

export { SubjectField, TextField, TagsField, ImageUploadField, ImagePreview };