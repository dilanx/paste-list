import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import styled from 'styled-components';
import './index.css';
import Select from 'react-select';
import { Button, selectStyle } from './common';

const Container = styled.div`
  width: 240px;
  padding: 0.5rem 1rem;
`;

const Title = styled.h1`
  letter-spacing: 0.2rem;
  font-size: 1.2rem;
  text-align: center;
`;

const FullButton = styled(Button)`
  width: 100%;
  margin: 0.5rem 0;
`;

const Message = styled.p`
  font-size: 0.9rem;
  text-align: center;
`;

function Popup() {
  const [lists, setLists] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    chrome.storage.sync.get().then((l) => {
      setLists(l);
      setLoading(false);
    });
  }, []);

  const handleChange = (value) => {
    setSelected(value?.value);
  };

  const handleStart = () => {
    chrome.storage.sync.get(selected, (s) => {
      chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'start',
          selected,
          items: s[selected],
        });
        window.close();
      });
    });
  };

  return (
    <Container>
      <Title>PASTE LIST</Title>
      <Select
        isSearchable
        isClearable
        isLoading={loading}
        isDisabled={loading}
        options={Object.keys(lists).map((l) => ({ value: l, label: l }))}
        styles={selectStyle}
        onChange={handleChange}
        placeholder="Select or create a list..."
      />
      <FullButton
        disabled={!selected || loading}
        onClick={handleStart}
        color="#22c55e"
      >
        {loading ? 'Loading...' : 'Load'}
      </FullButton>
      <FullButton
        onClick={() => {
          chrome.tabs.create({ url: chrome.runtime.getURL('edit.html') });
        }}
      >
        Edit lists
      </FullButton>
      {message && <Message>{message}</Message>}
    </Container>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Popup />);
