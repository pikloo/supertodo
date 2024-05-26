// Define the initial state
let state = {
  userDatas: [],
  todos: [],
};

// Define a list of subscribers
let subscribers = [];

// Define a function to update the state and notify subscribers
function setState(newState) {
  // console.log(newState, subscribers[0]);
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
