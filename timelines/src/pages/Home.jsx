import React from 'react';
import Layout from '../components/Layout';

const Home = () => {
  const mockEntries = [
    { id: 1, title: 'My First Entry', content: 'This is my first entry content.' },
    { id: 2, title: 'My Second Entry', content: 'This is some more content.' },
  ];

  return (
    <Layout>
      <div>
        <h1>Recent Journal Entries</h1>
        <ul>
          {mockEntries.map(entry => (
            <li key={entry.id}>
              <h3>{entry.title}</h3>
              <p>{entry.content}</p>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

export default Home;
