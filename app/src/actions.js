import { setState, state } from "./store"

export function setTodoInformations({ field, value }) {
    console.log(field, value)
    setState({
      ...state, currentTodo: {
        ...state.currentTodo,
        [field]: value,
      }
    })
  }

//   export function setNewTodoInformations({ field, value }) {
//     setState({
//       ...state, newTodo: {
//         ...state.newTodo,
//         [field]: value,
//       }
//     })
//   }

export function setMessage(message) {
    setState({...state, message })
}


export function setTasks({ field, value }) {
    setState({
      ...state, currentTodo: {
        ...state.currentTodo,
        tasks: {
          ...state.currentTodo.tasks,
          [field]: [
            ...state.currentTodo.tasks[field],
            value
          ]
        }
      }
    })
  }

//   export function setNewTasks({ field, value }) {
//     setState({
//       ...state, newTodo: {
//         ...state.newTodo,
//         tasks: {
//           ...state.newTodo.tasks,
//           [field]: [
//             ...state.newTodo.tasks[field],
//             value
//           ]
//         }
//       }
//     })
//   }