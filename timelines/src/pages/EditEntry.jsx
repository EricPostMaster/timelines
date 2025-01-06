import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase-config';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import EntryForm from '../components/EntryForm';

const EditEntry = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [subject, setSubject] = useState('');
  const [entryText, setEntryText] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState([]);
  const [existingImageUrls, setExistingImageUrls] = useState([]);
  const [existingAudioUrl, setExistingAudioUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      const docRef = doc(db, 'journalEntries', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().userId === user.uid) {
        setSubject(docSnap.data().subject || '');
        setEntryText(docSnap.data().text);
        setTags(docSnap.data().tags.join(', ')); // Join tags array into a comma-separated string
        setExistingImageUrls(docSnap.data().imageUrls || []);
        setExistingAudioUrl(docSnap.data().audioUrl || '');
      } else {
        navigate('/home');
      }
    };

    fetchEntry();
  }, [id, user, navigate]);

  const moveImage = useCallback((dragIndex, hoverIndex) => {
    const dragImage = images[dragIndex];
    const updatedImages = [...images];
    updatedImages.splice(dragIndex, 1);
    updatedImages.splice(hoverIndex, 0, dragImage);
    setImages(updatedImages);
  }, [images]);

  const deleteImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const deleteExistingImage = (index) => {
    setExistingImageUrls(existingImageUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!entryText.trim()) {
      alert('Please enter some text!');
      return;
    }

    const imageUrls = [...existingImageUrls];
    for (const image of images) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      imageUrls.push(imageUrl);
    }

    try {
      const docRef = doc(db, 'journalEntries', id);
      await updateDoc(docRef, {
        subject,
        text: entryText,
        tags: tags.split(',').map(tag => tag.trim()), // Split tags by comma and trim whitespace
        imageUrls, // Store the image URLs
        updatedAt: new Date(),
      });
      alert('Entry updated successfully!');
      navigate(`/view-entry/${id}`);
    } catch (error) {
      console.error('Error updating document:', error);
      alert('Failed to update entry. Please try again.');
    }
  };

  return (
    <Layout>
      <div>
        <h1>Edit Journal Entry</h1>
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
          moveImage={moveImage}
          deleteImage={deleteImage}
          deleteExistingImage={deleteExistingImage}
          audioRecording={null}
          setAudioRecording={() => {}}
          isRecording={false}
          setIsRecording={() => {}}
          setRecordingComplete={() => {}}
          existingAudioUrl={existingAudioUrl}
          handleSubmit={handleSubmit}
        />
      </div>
    </Layout>
  );
};

export default EditEntry;