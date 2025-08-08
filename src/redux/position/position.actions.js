// position.actions.js

export const incrementPosition = () => ({
  type: 'INCREMENT_POSITION'
});

export const resetPosition = () => ({
  type: 'RESET_POSITION'
});

export const setPosition = (newValue) => ({
  type: 'SET_POSITION',
  payload: newValue,
});

