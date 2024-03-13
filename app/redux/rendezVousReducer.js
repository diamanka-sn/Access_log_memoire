const rendezVousReducer = (state = {}, action) => {
    switch (action.type) {
      case 'UPDATE_RDV':
        return action.payload;
      default:
        return state;
    }
  };
  
  export default rendezVousReducer;