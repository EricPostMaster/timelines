import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImagePreview from './ImagePreview';
import AudioRecorder from './AudioRecorder';

const EntryForm = ({
  subject,
  setSubject,
  entryText,
  setEntryText,
  tags,
  setTags,
  images,
  setImages,
  existingImageUrls,
  moveImage,
  deleteImage,
  deleteExistingImage,
  audioRecording,
  setAudioRecording,
  isRecording,
  setIsRecording,
  setRecordingComplete,
  existingAudioUrl,
  handleSubmit,
}) => {
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleTextChange = (value) => {
    setEntryText(value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleImageChange = (event) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
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
      <div>
        <label htmlFor="entryText">Write your entry:</label>
        <ReactQuill
          value={entryText}
          onChange={handleTextChange}
          placeholder="Type your journal entry here..."
          theme="snow"
        />
      </div>
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
      <ImagePreview
        images={images}
        existingImageUrls={existingImageUrls}
        moveImage={moveImage}
        deleteImage={deleteImage}
        deleteExistingImage={deleteExistingImage}
      />
      <AudioRecorder
        audioRecording={audioRecording}
        setAudioRecording={setAudioRecording}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        setRecordingComplete={setRecordingComplete}
      />
      {existingAudioUrl && (
        <div>
          <audio controls src={existingAudioUrl} />
        </div>
      )}
      <div>
        <button type="submit">Submit Entry</button>
      </div>
    </form>
  );
};

export default EntryForm;