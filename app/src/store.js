// Define the initial state
let state = {
  message: {
    text: null,
    type: null
  },
  userDatas: [],
  todos: [],
  currentTodo:
  {
    id: null,
    title: "",
    description: "",
    tasks: {
      done: [],
      todo: [],
      progress : [],
    }
  },


};

// Define a list of subscribers
let subscribers = [];

// Define a function to update the state and notify subscribers
function setState(newState) {
  state = newState;

  // Notify subscribers
  for (let i = 0; i < subscribers.length; i++) {
    subscribers[i](newState);
  }

}

// Define a function to subscribe to state changes
function subscribe(callback) {
  subscribers.push(callback);
}

// Export the state, setState, and subscribe functions
export { state, setState, subscribe };
