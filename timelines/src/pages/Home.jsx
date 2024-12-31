import React, { useEffect, useState, useContext } from 'react';
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase-config";
import Layout from '../components/Layout';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/" />;
  }

  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesCollection = collection(db, "journalEntries");
        const q = query(entriesCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const fetchedEntries = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEntries(fetchedEntries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      }
    };

    fetchEntries();
  }, []);

  return (
    <Layout>
      <div>
        <h1>Recent Journal Entries</h1>
        {entries.length === 0 ? (
          <p>No entries found. Create a new one!</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <h3>{entry.createdAt?.toDate().toLocaleString()}</h3>
                <p>{entry.text}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Home;
