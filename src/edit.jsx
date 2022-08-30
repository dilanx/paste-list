import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';
import './edit.css';
import { Button, selectStyle } from './common';
import './index.css';
import toast, { Toaster } from 'react-hot-toast';

const Title = styled.h1`
  letter-spacing: 0.2rem;
  font-size: 1.5rem;
  text-align: center;
`;

const Item = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Number = styled.p`
  flex: 10%;
  text-align: center;
  font-weight: bold;
  color: #888888;
  font-size: 1.2rem;
`;

const TextArea = styled.textarea`
  flex: 87%;
  resize: vertical;
  margin: 1rem 0;
  border: 2px solid #2f2f2f;
  border-radius: 0.5rem;
  background-color: #111111;
  outline: none;
  padding: 0.5rem;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  min-height: 3rem;

  &:hover {
    border-color: #4f4f4f;
  }

  &:focus {
    border-color: #6f6f6f;
  }
`;

const Message = styled.p`
  text-align: center;
`;

const ButtonBox = styled.div`
  display: flex;
  justify-content: right;
  width: 100%;
  gap: 1rem;
  margin: 1rem 0;
`;

const ModifyButtonBox = styled.div`
  flex: 3%;
`;

const ModifyButton = styled.button`
  display: block;
  color: #777777;
  font-size: 0.8rem;
  font-weight: bold;
  border: none;
  background: none;

  &:hover {
    color: #ed4245;
  }

  &:active {
    opacity: 0.75;
  }
`;

async function addList(name) {
  await chrome.storage.sync.set({ [name]: ['Type something here!'] });
  return await getLists();
}

async function getLists() {
  return await chrome.storage.sync.get();
}

async function updateList(name, list) {
  await chrome.storage.sync.set({ [name]: list });
}

async function removeList(name) {
  await chrome.storage.sync.remove(name);
  return await getLists();
}

function Edit() {
  const [lists, setLists] = useState({});
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stateRefresh, setStateRefresh] = useState(false);

  useEffect(() => {
    getLists().then((l) => {
      setLists(l);
      setLoading(false);
    });
  }, []);

  const handleCreate = (inputValue) => {
    setLoading(true);
    addList(inputValue).then((l) => {
      setLists(l);
      setLoading(false);
      toast.success(`Created list: ${inputValue}`);
    });
  };

  const handleChange = (value) => {
    setSelected(value?.value);
  };

  const handleItemUpdate = (value, index) => {
    const newLists = { ...lists };
    newLists[selected][index] = value;
    setLists(newLists);
  };

  const handleItemAdd = () => {
    const newLists = { ...lists };
    newLists[selected].push('');
    setLists(newLists);
  };

  const handleItemMove = (index, direction) => {
    const newLists = { ...lists };
    const item = newLists[selected][index];
    newLists[selected].splice(index, 1);
    newLists[selected].splice(index + direction, 0, item);
    setLists(newLists);
    setStateRefresh(!stateRefresh);
  };

  const handleItemRemove = (index) => {
    const newLists = { ...lists };
    newLists[selected].splice(index, 1);
    setLists(newLists);
    setStateRefresh(!stateRefresh);
  };

  const handleSave = () => {
    setLoading(true);
    updateList(selected, lists[selected]).then(() => {
      setLoading(false);
      toast.success(`Saved list: ${selected}`, {
        iconTheme: {
          primary: '#eb459e',
        },
      });
    });
  };

  const handleDelete = () => {
    setLoading(true);
    removeList(selected).then((l) => {
      setLists(l);
      setSelected(null);
      setLoading(false);
      toast.success(`Deleted list: ${selected}`, {
        iconTheme: {
          primary: '#ed4245',
        },
      });
    });
  };

  return (
    <div>
      <Toaster position="top-right" />
      <Title>PASTE LIST</Title>
      <CreatableSelect
        isSearchable
        isClearable
        isLoading={loading}
        isDisabled={loading}
        options={Object.keys(lists).map((l) => ({ value: l, label: l }))}
        styles={selectStyle}
        onCreateOption={handleCreate}
        onChange={handleChange}
        placeholder="Select or create a list..."
      />
      {selected && (
        <div>
          {lists[selected]?.map((item, i) => (
            <Item key={`${i}-${stateRefresh}`}>
              <Number>{i + 1}</Number>
              <TextArea
                defaultValue={item}
                onChange={(e) => handleItemUpdate(e.target.value, i)}
              />
              <ModifyButtonBox>
                <ModifyButton
                  title={`Move item ${i + 1} up`}
                  onClick={() => handleItemMove(i, -1)}
                >
                  Up
                </ModifyButton>
                <ModifyButton
                  title={`Remove item ${i + 1}`}
                  onClick={() => handleItemRemove(i)}
                >
                  Del
                </ModifyButton>
                <ModifyButton
                  title={`Move item ${i + 1} down`}
                  onClick={() => handleItemMove(i, 1)}
                >
                  Down
                </ModifyButton>
              </ModifyButtonBox>
            </Item>
          )) || <Message>Something went wrong.</Message>}
          <ButtonBox>
            <Button onClick={() => handleItemAdd()}>Add item</Button>
            <Button onClick={handleSave}>Save list</Button>
            <Button onClick={handleDelete} color="#ed4245">
              Delete list
            </Button>
          </ButtonBox>
        </div>
      )}
      {!selected && (
        <Message>Select a list or type a new name to create one.</Message>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Edit />);
