import React, { useState, useContext, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import '../CreateEntry.css'; // Import the CSS file
import EntryForm from '../components/EntryForm';

const CreateEntry = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const [subject, setSubject] = useState('');
  const [entryText, setEntryText] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [audioRecording, setAudioRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [existingAudioUrl, setExistingAudioUrl] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!entryText.trim()) {
      alert('Please enter some text');
      return;
    }

    const imageUrls = [];
    for (const image of images) {
      const imageRef = ref(storage, `images/${image.name}`);
      const metadata = {
        customMetadata: {
          userId: user.uid
        }
      };
      await uploadBytes(imageRef, image, metadata);
      const imageUrl = await getDownloadURL(imageRef);
      imageUrls.push(imageUrl);
    }

    let audioUrl = '';
    if (audioRecording) {
      const audioRef = ref(storage, `audios/${Date.now()}.wav`);
      const metadata = {
        customMetadata: {
          userId: user.uid
        }
      };
      await uploadBytes(audioRef, audioRecording, metadata);
      audioUrl = await getDownloadURL(audioRef);
    }

    try {
      // Save the journal entry to Firestore
      const docRef = await addDoc(collection(db, "journalEntries"), {
        subject,
        text: entryText,
        tags: tags.split(',').map(tag => tag.trim()), // Split tags by comma and trim whitespace
        createdAt: new Date(), // Add a timestamp
        audioUrl, // Store the audio URL
        imageUrls, // Store the image URLs
        userId: user.uid, // Store the user ID
      });
      console.log('Document written with ID:', docRef.id);

      // Clear the input fields after submission
      setSubject('');
      setEntryText('');
      setTags('');
      setImages([]);
      setAudioRecording(null);
      setRecordingComplete(false);
      alert('Entry submitted successfully!');
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to submit entry. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="create-entry">
        <h2>Create New Entry</h2>
        <EntryForm
          subject={subject}
          setSubject={setSubject}
          entryText={entryText}
          setEntryText={setEntryText}
          tags={tags}
          setTags={setTags}
          images={images}
          setImages={setImages}
          existingImageUrls={existingImageUrls}
          moveImage={() => {}}
          deleteImage={() => {}}
          deleteExistingImage={() => {}}
          audioRecording={audioRecording}
          setAudioRecording={setAudioRecording}
          isRecording={isRecording}
          setIsRecording={setIsRecording}
          setRecordingComplete={setRecordingComplete}
          existingAudioUrl={existingAudioUrl}
          handleSubmit={handleSubmit}
        />
      </div>
    </Layout>
  );
};

export default CreateEntry;

