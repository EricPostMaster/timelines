import React, { useEffect, useState, useContext } from 'react';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import Select from 'react-select';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [entries, setEntries] = useState([]);
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterTags, setFilterTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEntries = async () => {
      if (user) {
        try {
          let entriesCollection = collection(db, "journalEntries");
          let q = query(entriesCollection, where("userId", "==", user.uid), orderBy("createdAt", sortOrder));

          if (filterTags.length > 0) {
            q = query(entriesCollection, where("userId", "==", user.uid), where("tags", "array-contains-any", filterTags.map(tag => tag.value)), orderBy("createdAt", sortOrder));
          }

          const querySnapshot = await getDocs(q);
          const fetchedEntries = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Filter entries based on search query
          const filteredEntries = fetchedEntries.filter(entry =>
            (entry.text && entry.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (entry.subject && entry.subject.toLowerCase().includes(searchQuery.toLowerCase()))
          );

          console.log('Fetched entries:', filteredEntries); // Debugging line
          setEntries(filteredEntries);
        } catch (error) {
          console.error('Error fetching entries:', error);
        }
      }
    };

    const fetchTags = async () => {
      if (user) {
        try {
          const entriesCollection = collection(db, "journalEntries");
          const q = query(entriesCollection, where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const fetchedEntries = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Extract unique tags
          const tagsSet = new Set();
          fetchedEntries.forEach(entry => {
            if (entry.tags) {
              entry.tags.forEach(tag => tagsSet.add(tag));
            }
          });
          setAvailableTags(Array.from(tagsSet).sort().map(tag => ({ value: tag, label: tag })));
        } catch (error) {
          console.error('Error fetching tags:', error);
        }
      }
    };

    fetchEntries();
    fetchTags();
  }, [user, sortOrder, filterTags, searchQuery]);

  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };

  const handleFilterChange = (selectedOptions) => {
    setFilterTags(selectedOptions || []);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const truncateText = (text, length) => {
    if (text.length <= length) {
      return text;
    }
    return text.substring(0, length) + '...';
  };

  const handleImageClick = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  return (
    <Layout>
      <div>
        <h1>Recent Journal Entries</h1>
        <div>
          <label htmlFor="sortOrder">Sort by date:</label>
          <select id="sortOrder" value={sortOrder} onChange={handleSortChange}>
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterTags">Filter by tags:</label>
          <Select
            id="filterTags"
            isMulti
            value={filterTags}
            onChange={handleFilterChange}
            options={availableTags}
            placeholder="Select tags..."
          />
        </div>
        <div>
          <label htmlFor="searchQuery">Search:</label>
          <input
            id="searchQuery"
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search entries..."
          />
        </div>
        {entries.length === 0 ? (
          <p>No entries found. Create a new one!</p>
        ) : (
          <ul>
            {entries.map((entry) => (
              <li key={entry.id}>
                <h3>{entry.createdAt?.toDate().toLocaleString()}</h3>
                <h4>{entry.subject}</h4>
                <div dangerouslySetInnerHTML={{ __html: truncateText(entry.text, 250) }} />
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
                <Link to={`/view-entry/${entry.id}`}>View</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default Home;
