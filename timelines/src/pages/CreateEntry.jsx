import React, { useState, useContext, useRef } from 'react';
import Layout from '../components/Layout';
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateEntry = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const [subject, setSubject] = useState('');
  const [entryText, setEntryText] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const quillRef = useRef(null);

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
    if (event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!entryText.trim()) {
      alert('Please enter some text!');
      return;
    }

    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      // Save the journal entry to Firestore
      const docRef = await addDoc(collection(db, "journalEntries"), {
        subject,
        text: entryText,
        tags: tags.split(',').map(tag => tag.trim()), // Split tags by comma and trim whitespace
        createdAt: new Date(), // Add a timestamp
        imageUrl, // Store the image URL
        userId: user.uid, // Store the user ID
      });
      console.log('Document written with ID:', docRef.id);

      // Clear the input fields after submission
      setSubject('');
      setEntryText('');
      setTags('');
      setImage(null);
      alert('Entry submitted successfully!');
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to submit entry. Please try again.');
    }
  };

  const handleRecordAudio = () => {
    alert('Audio submissions coming soon!');
  };

  return (
    <Layout>
      <div>
        <h1>Create New Journal Entry</h1>
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
              ref={quillRef}
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
            <label htmlFor="image">Attach an image:</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <div>
            <button type="button" onClick={handleRecordAudio}>
              Record Audio
            </button>
          </div>
          <div>
            <button type="submit">Submit Entry</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEntry;

