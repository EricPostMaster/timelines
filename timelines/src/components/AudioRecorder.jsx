import { useState, useRef } from 'react';
import { uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { doc, setDoc, collection } from "firebase/firestore";
import { db, storage } from "../firebase"; // Import Firebase config

const AudioRecorder = ({ onSave }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          mediaRecorderRef.current = new MediaRecorder(stream);
          mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
          };
          mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            audioChunksRef.current = []; // Clear the chunks for next recording
          };
          mediaRecorderRef.current.start();
          setIsRecording(true);
        })
        .catch(error => {
          console.error("Error accessing microphone:", error);
        });
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
  };

  const handleSave = async (audioUrl) => {
    if (audioUrl) {
      // Upload audio to Firebase Storage
      const fileName = `audio_${Date.now()}.wav`; // Create unique file name based on timestamp
      const storageRef = ref(storage, `audios/${fileName}`);
      
      const audioBlob = await fetch(audioUrl).then((res) => res.blob());
      await uploadBytes(storageRef, audioBlob);
      
      // Get the download URL
      const audioDownloadUrl = await getDownloadURL(storageRef);
  
      // Save the metadata (URL) to Firestore
      const entry = {
        audioUrl: audioDownloadUrl,
        timestamp: new Date().toISOString(),
      };
  
      try {
        const entryRef = await setDoc(doc(collection(db, "entries")), entry);
        console.log("Entry saved:", entryRef.id);
      } catch (e) {
        console.error("Error adding entry: ", e);
      }
    }
  };

  return (
    <div>
      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioUrl && (
        <div>
          <audio controls src={audioUrl} />
          <button onClick={handleSave}>Save Recording</button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
