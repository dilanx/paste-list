import styled from 'styled-components';

export const Button = styled.button`
  background-color: #111111;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  color: ${(props) => props.color || '#ffffff'};
  font-weight: bold;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
    rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;

  &:not(:disabled):hover {
    background-color: ${(props) => props.color || '#2684ff'};
    color: #ffffff;
  }

  &:not(:disabled):active {
    opacity: 0.75;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const selectStyle = {
  control: (styles) => ({ ...styles, backgroundColor: '#242424' }),
  placeholder: (styles) => ({ ...styles, color: '#afafaf' }),
  input: (styles) => ({ ...styles, color: '#ffffff' }),
  singleValue: (styles) => ({ ...styles, color: '#afafaf' }),
  menu: (styles) => ({ ...styles, backgroundColor: '#242424' }),
  option: (styles, state) => ({
    ...styles,
    backgroundColor: state.isFocused ? '#454545' : undefined,
    ':active': {
      ...styles[':active'],
      backgroundColor: '#555555',
    },
  }),
};
