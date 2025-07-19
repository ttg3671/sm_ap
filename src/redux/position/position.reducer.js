// position.reducer.js

const INITIAL_STATE = {
  value: 1
};

const positionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INCREMENT_POSITION':
      return {
        ...state,
        value: state.value + 1
      };

    case 'RESET_POSITION':
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default positionReducer;
