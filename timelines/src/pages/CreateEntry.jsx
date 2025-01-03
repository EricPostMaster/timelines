import React, { useState, useContext, useRef, useEffect } from 'react';
import Layout from '../components/Layout';
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../CreateEntry.css'; // Import the CSS file

const CreateEntry = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const quillRef = useRef(null);
  const [subject, setSubject] = useState('');
  const [entryText, setEntryText] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [audioRecording, setAudioRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [audioStream, setAudioStream] = useState(null);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    setAudioStream(stream);
    mediaRecorderRef.current = new MediaRecorder(stream);
    mediaRecorderRef.current.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
    mediaRecorderRef.current.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      setAudioRecording(audioBlob);
      audioChunksRef.current = [];
    };
    mediaRecorderRef.current.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    audioStream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    setRecordingComplete(true);
  };

  const playRecording = () => {
    if (audioRecording) {
      const audioUrl = URL.createObjectURL(audioRecording);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

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
      return;a
    }

    let imageUrl = '';
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    let audioUrl = '';
    if (audioRecording) {
      const audioBlob = await fetch(audioRecording).then(res => res.blob());
      const audioRef = ref(storage, `audios/${Date.now()}.wav`);
      await uploadBytes(audioRef, audioBlob);
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
        imageUrl, // Store the image URL
        userId: user.uid, // Store the user ID
      });
      console.log('Document written with ID:', docRef.id);

      // Clear the input fields after submission
      setSubject('');
      setEntryText('');
      setTags('');
      setImage(null);
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
            <button type="button" onClick={startRecording} disabled={isRecording}>
              Start Recording
            </button>
            <button type="button" onClick={stopRecording} disabled={!isRecording}>
              Stop Recording
            </button>
            <button type="button" onClick={playRecording} disabled={!recordingComplete}>
              Play Recording
            </button>
          </div>
          {audioRecording && (
            <div>
              <audio controls src={URL.createObjectURL(audioRecording)} />
            </div>
          )}
          <div>
            <button type="submit">Submit Entry</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default CreateEntry;

