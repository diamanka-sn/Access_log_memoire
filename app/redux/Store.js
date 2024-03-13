import { createStore, combineReducers } from 'redux';
import rendezVousReducer from './rendezVousReducer';

const rootReducer = combineReducers({
  rendezVous: rendezVousReducer,
});

const store = createStore(rootReducer);

export default store;