import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import CreatableSelect from 'react-select/creatable';
import styled from 'styled-components';
import './edit.css';
import { Button, selectStyle } from './common';
import './index.css';
import toast, { Toaster } from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { v4 as uuidv4 } from 'uuid';
import { Bars3Icon, TrashIcon } from '@heroicons/react/24/outline';

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

const ItemTextSection = styled.div`
  flex: 97%;
`;

const Input = styled.input`
  display: block;
  box-sizing: border-box;
  width: 100%;
  margin: 1rem 0;
  border: 2px solid #2f2f2f;
  border-radius: 0.5rem;
  background-color: #111111;
  outline: none;
  padding: 0.5rem;
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-weight: bold;

  &:hover {
    border-color: #4f4f4f;
  }

  &:focus {
    border-color: #6f6f6f;
  }
`;

const TextArea = styled.textarea`
  display: block;
  box-sizing: border-box;
  width: 100%;
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
  border: none;
  background: none;

  &:hover {
    color: #ed4245;
  }

  &:active {
    opacity: 0.75;
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

async function addList(name) {
  await chrome.storage.sync.set({
    [name]: [
      {
        id: uuidv4(),
        name: 'A short name (appears in overlay)',
        content: 'Type something here!',
      },
    ],
  });
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

  const handleItemUpdate = (value, index, isContent) => {
    const newLists = { ...lists };
    newLists[selected][index][isContent ? 'content' : 'name'] = value;
    setLists(newLists);
  };

  const handleItemAdd = () => {
    const newLists = { ...lists };
    newLists[selected].push({
      id: uuidv4(),
      name: '',
      content: '',
    });
    setLists(newLists);
  };

  const handleItemMove = (src, dst) => {
    const newLists = { ...lists };
    const [item] = newLists[selected].splice(src, 1);
    newLists[selected].splice(dst, 0, item);
    setLists(newLists);
  };

  const handleItemRemove = (index) => {
    const newLists = { ...lists };
    newLists[selected].splice(index, 1);
    setLists(newLists);
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

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    handleItemMove(result.source.index, result.destination.index);
  };

  const onKeyDown = (event) => {
    if (!selected) return;
    const modifier = event.ctrlKey || event.metaKey;
    if (modifier && event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      handleItemAdd();
    }
    if (modifier && event.key === 's') {
      event.preventDefault();
      event.stopPropagation();
      handleSave();
    }
  };

  useEffect(() => {
    getLists().then((l) => {
      setLists(l);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown, false);

    return () => {
      window.removeEventListener('keydown', onKeyDown, false);
    };
  }, [selected]);

  return (
    <div>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: '#484848', color: '#ffffff' } }}
      />
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
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {lists[selected]?.map((item, i) => (
                  <Draggable key={item.id} draggableId={item.id} index={i}>
                    {(provided) => (
                      <Item
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <ItemTextSection>
                          <Input
                            placeholder="Name"
                            defaultValue={item.name}
                            onChange={(e) =>
                              handleItemUpdate(e.target.value, i, false)
                            }
                          />
                          <TextArea
                            placeholder="Content"
                            defaultValue={item.content}
                            onChange={(e) =>
                              handleItemUpdate(e.target.value, i, true)
                            }
                          />
                        </ItemTextSection>
                        <ModifyButtonBox>
                          <ModifyButton
                            title={`Move`}
                            {...provided.dragHandleProps}
                          >
                            <Bars3Icon />
                          </ModifyButton>
                          <ModifyButton
                            title={`Remove item ${i + 1}`}
                            onClick={() => handleItemRemove(i)}
                          >
                            <TrashIcon />
                          </ModifyButton>
                        </ModifyButtonBox>
                      </Item>
                    )}
                  </Draggable>
                )) || <Message>Something went wrong.</Message>}
                {provided.placeholder}
                <ButtonBox>
                  <Button onClick={() => handleItemAdd()}>Add item</Button>
                  <Button onClick={handleSave}>Save list</Button>
                  <Button onClick={handleDelete} color="#ed4245">
                    Delete list
                  </Button>
                </ButtonBox>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {!selected && (
        <Message>Select a list or type a new name to create one.</Message>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<Edit />);
