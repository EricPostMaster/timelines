import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, doc, getDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase-config';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';

const ViewEntry = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [entry, setEntry] = useState(null);
  const [entries, setEntries] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const entriesCollection = collection(db, "journalEntries");
          const q = query(entriesCollection, where("userId", "==", user.uid), orderBy("createdAt", "asc"));
          const querySnapshot = await getDocs(q);
          const fetchedEntries = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setEntries(fetchedEntries);
        } catch (error) {
          console.error('Error fetching entries:', error);
        }
      }
    };

    fetchEntries();
  }, [user]);

  useEffect(() => {
    const fetchEntry = async () => {
      const docRef = doc(db, 'journalEntries', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().userId === user.uid) {
        setEntry(docSnap.data());
      } else {
        navigate('/home');
      }
    };

    fetchEntry();
  }, [id, user, navigate]);

  const getNextEntryId = () => {
    const currentIndex = entries.findIndex(entry => entry.id === id);
    if (currentIndex !== -1 && currentIndex < entries.length - 1) {
      return entries[currentIndex + 1].id;
    }
    return null;
  };

  const getPreviousEntryId = () => {
    const currentIndex = entries.findIndex(entry => entry.id === id);
    if (currentIndex > 0) {
      return entries[currentIndex - 1].id;
    }
    return null;
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this entry?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'journalEntries', id));
        alert('Entry deleted successfully!');
        navigate('/home');
      } catch (error) {
        console.error('Error deleting document:', error);
        alert('Failed to delete entry. Please try again.');
      }
    }
  };

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  if (!entry) {
    return <p>Loading...</p>;
  }

  return (
    <Layout>
      <div>
        <h1>View Journal Entry</h1>
        <h3>{entry.createdAt?.toDate().toLocaleString()}</h3>
        <h4>{entry.subject}</h4>
        <div dangerouslySetInnerHTML={{ __html: entry.text }} />
        {entry.tags && (
          <p>Tags: {entry.tags.join(', ')}</p>
        )}
        {entry.imageUrls && entry.imageUrls.map((imageUrl, index) => (
          <img
            key={index}
            className="entry-image"
            src={imageUrl}
            alt={`Attached ${index}`}
            onClick={() => handleImageClick(imageUrl)}
          />
        ))}
        {entry.audioUrl && (
          <audio controls src={entry.audioUrl} />
        )}
        <Link to={`/edit-entry/${id}`}>Edit</Link>
        <button onClick={handleDelete}>Delete</button>
        <div>
          {getPreviousEntryId() && (
            <Link to={`/view-entry/${getPreviousEntryId()}`}>Previous Entry</Link>
          )}
          {getNextEntryId() && (
            <Link to={`/view-entry/${getNextEntryId()}`}>Next Entry</Link>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ViewEntry;