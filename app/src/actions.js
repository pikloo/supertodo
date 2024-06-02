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

export function setMessage(message) {
    setState({ ...state, message })
}


export function setTasks({ field, value }) {
    setState({
        ...state, currentTodo: {
            ...state.currentTodo,
            tasks: {
                ...state.currentTodo.tasks,
                [field]: [
                    ...state.currentTodo.tasks[field],
                    {
                        title: value,
                        status: field
                    }
                ]
            }
        }
    })

    console.log(state)
}

export function setTasksCollection(status, collection) {
    const statusLink = {
        todo: 'todo',
        doing: 'progress',
        done: 'done'
    }
    setState({
        ...state, currentTodo: {
            ...state.currentTodo,
            tasks: {
                ...state.currentTodo.tasks,
                [statusLink[status]]: collection
            }
        }
    })
}