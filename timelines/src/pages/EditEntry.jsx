import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase-config';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditEntry = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [subject, setSubject] = useState('');
  const [entryText, setEntryText] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntry = async () => {
      const docRef = doc(db, 'journalEntries', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().userId === user.uid) {
        setSubject(docSnap.data().subject || '');
        setEntryText(docSnap.data().text);
        setTags(docSnap.data().tags.join(', ')); // Join tags array into a comma-separated string
        setExistingImageUrl(docSnap.data().imageUrl || '');
      } else {
        navigate('/home');
      }
    };

    fetchEntry();
  }, [id, user, navigate]);

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

    let imageUrl = existingImageUrl;
    if (image) {
      const imageRef = ref(storage, `images/${image.name}`);
      await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(imageRef);
    }

    try {
      const docRef = doc(db, 'journalEntries', id);
      await updateDoc(docRef, {
        subject,
        text: entryText,
        tags: tags.split(',').map(tag => tag.trim()), // Split tags by comma and trim whitespace
        imageUrl, // Store the image URL
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
            <label htmlFor="entryText">Edit your entry:</label>
            <ReactQuill
              value={entryText}
              onChange={handleTextChange}
              placeholder="Edit your journal entry here..."
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
          {existingImageUrl && (
            <div>
              <img src={existingImageUrl} alt="Attached" style={{ maxWidth: '100%' }} />
            </div>
          )}
          <div>
            <button type="submit">Update Entry</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EditEntry;