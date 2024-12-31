import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          const entriesCollection = collection(db, "journalEntries");
          const q = query(entriesCollection, where("userId", "==", user.uid), orderBy("createdAt", "desc"));
          const querySnapshot = await getDocs(q);
          const fetchedEntries = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          console.log('Fetched entries:', fetchedEntries); // Debugging line
          setEntries(fetchedEntries);
        } catch (error) {
          console.error('Error fetching entries:', error);
        }
      }
    };

    fetchEntries();
  }, [user]);

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
