import React, { useState, useContext, useRef, useEffect, useCallback } from 'react';
import Layout from '../components/Layout';
import { collection, addDoc } from "firebase/firestore";
import { db, storage } from "../firebase-config";
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../CreateEntry.css'; // Import the CSS file
// import { DndProvider } from 'react-dnd';
// import { HTML5Backend } from 'react-dnd-html5-backend';
// import { ImageItemCreate } from '../components/ImageItem';
import { SubjectField, TextField, TagsField, ImageUploadField, ImagePreview } from '../components/FormFieldCreate';

const CreateEntry = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/" />;
  }

  const quillRef = useRef(null);
  const [subject, setSubject] = useState('');
  const [entryText, setEntryText] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [audioRecording, setAudioRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingComplete, setRecordingComplete] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [audioStream, setAudioStream] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        setEntryText((prevText) => prevText + finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error', event);
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const startRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current.stop();
      audioStream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      setRecordingComplete(true);
      stopListening();
    } else {
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
      setRecordingComplete(false);
      startListening();
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
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  const moveImage = useCallback((dragIndex, hoverIndex) => {
    const dragImage = images[dragIndex];
    const updatedImages = [...images];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, dragImage);
    setImages(updatedImages);
  }, [images]);

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
        <form onSubmit={handleSubmit}>
          <SubjectField subject={subject} setSubject={setSubject} />
          <TextField entryText={entryText} setEntryText={setEntryText} />
          <TagsField tags={tags} setTags={setTags} />
          <ImageUploadField handleImageChange={handleImageChange} />
          <ImagePreview images={images} moveImage={moveImage} />
          <div>
            <button type="button" onClick={startRecording}>
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
            {isRecording && <div className="blinking-dot"></div>}
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
