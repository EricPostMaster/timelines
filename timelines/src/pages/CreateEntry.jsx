import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const CreateEntry = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const [entryText, setEntryText] = useState('');
  const [audioRecording, setAudioRecording] = useState(null);

  const handleRecordAudio = () => {
    alert('Audio recording functionality coming soon!');
  };

  const handleTextChange = (event) => {
    setEntryText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!entryText.trim()) {
      alert('Please enter some text!');
      return;
    }

    try {
      // Save the journal entry to Firestore
      const docRef = await addDoc(collection(db, "journalEntries"), {
        text: entryText,
        createdAt: new Date(), // Add a timestamp
        audioRecording, // Placeholder for audio recordings
        userId: user.uid, // Store the user ID
      });
      console.log('Document written with ID:', docRef.id);

      // Clear the input fields after submission
      setEntryText('');
      alert('Entry submitted successfully!');
    } catch (error) {
      console.error('Error adding document:', error);
      alert('Failed to submit entry. Please try again.');
    }
  };

  return (
    <Layout>
      <div>
        <h1>Create New Journal Entry</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="entryText">Write your entry:</label>
            <textarea
              id="entryText"
              value={entryText}
              onChange={handleTextChange}
              placeholder="Type your journal entry here..."
              rows="6"
              cols="40"
            />
          </div>
          <div>
            <button type="button" onClick={handleRecordAudio}>Record Audio</button>
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
