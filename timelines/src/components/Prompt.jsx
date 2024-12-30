import { useState } from 'react';

const prompts = [
  "Tell me about a time you traveled somewhere you loved.",
  "What's the best gift you've ever received?",
  "Describe a favorite memory from childhood."
];

const Prompt = () => {
  const [prompt, setPrompt] = useState(prompts[0]);

  const getRandomPrompt = () => {
    const randomIndex = Math.floor(Math.random() * prompts.length);
    setPrompt(prompts[randomIndex]);
  };

  return (
    <div>
      <p>{prompt}</p>
      <button onClick={getRandomPrompt}>Get New Prompt</button>
    </div>
  );
};

export default Prompt;
