import { setState, state } from "./store"

export function setTodoInformations({ field, value }) {
    setState({
        ...state, currentTodo: {
            ...state.currentTodo,
            [field]: value,
        }
    })

    console.log(state.currentTodo)
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
}


export function updateTasks({ field, value, id }) {
    setState({
        ...state, currentTodo: {
            ...state.currentTodo,
            tasks: {
                ...state.currentTodo.tasks,
                [field]: 
                    state.currentTodo.tasks[field].map(task => {
                        if (task.id == id) {
                            task.title = value
                        }
                        return task
                    })
            }
        }
    })
}


export function updateTasksStatus({oldStatus, newStatus, task}){
    const statusLink = {
        todo: 'todo',
        progress: 'doing',
        done: 'complete'
    }
    
    

    const currentTask = state.currentTodo.tasks[oldStatus].find(item => item.id == task.id)
    

    setState({
        ...state, currentTodo: {
            ...state.currentTodo,
            tasks: {
                ...state.currentTodo.tasks,
                [oldStatus]: state.currentTodo.tasks[oldStatus].filter(item => item && item.id!= task.id),
                
            }
        }
    })


    if(currentTask){
        const {id, title, created_at, updated_at} = currentTask

        setState({
            ...state, currentTodo: {
                ...state.currentTodo,
                tasks: {
                    ...state.currentTodo.tasks,
                    [newStatus]: [
                        ...state.currentTodo.tasks[newStatus],
                        {
                            id,
                            title,
                            status: statusLink[newStatus],
                            created_at,
                            updated_at
                        }
                    ],
                    
                }
            }
        })
    }
}

export function deleteTasks({ field, id }) {
    setState({
        ...state, currentTodo: {
           ...state.currentTodo,
           tasksToDelete: [...state.currentTodo.tasksToDelete, id],
            tasks: {
               ...state.currentTodo.tasks,
                [field]: state.currentTodo.tasks[field].filter(task => task.id!= id),
                
            }
        }
    })
}

export function setTasksCollection(status, collection) {
    const statusLink = {
        todo: 'todo',
        doing: 'progress',
        complete: 'done'
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