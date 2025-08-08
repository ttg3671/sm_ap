// position.reducer.js

// const INITIAL_STATE = {
//   value: 1
// };

// const positionReducer = (state = INITIAL_STATE, action) => {
//   switch (action.type) {
//     case 'INCREMENT_POSITION':
//       return {
//         ...state,
//         value: state.value + 1
//       };

//     case 'RESET_POSITION':
//       return INITIAL_STATE;

//     default:
//       return state;
//   }
// };

// export default positionReducer;

const INITIAL_STATE = {
  value: 1, // fallback if nothing is set
};

const positionReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'SET_POSITION':
      return {
        ...state,
        value: action.payload,
      };

    case 'INCREMENT_POSITION':
      return {
        ...state,
        value: state.value + 1,
      };

    case 'RESET_POSITION':
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default positionReducer;

