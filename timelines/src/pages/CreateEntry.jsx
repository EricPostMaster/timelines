import React, { useState } from 'react';
import Layout from '../components/Layout';
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase-config";


const CreateEntry = () => {
  const [entryText, setEntryText] = useState('');
  const [audioRecording, setAudioRecording] = useState(null);

  const handleRecordAudio = () => {
    // Placeholder for recording audio
    alert('Audio recording functionality coming soon!');
  };

  const handleTextChange = (event) => {
    setEntryText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Entry submitted!');
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
