import { setMessage, setTasksCollection } from "../actions"
import { router } from "../router"
import { setState, state, subscribe } from "../store"
import { taskActionHandler, taskCreator, tasksHandlerLogic } from "./inputHandler"
import { messageHandler } from "./messageHandler"
import taskStore from "./taskStore"

const TODOS_API_ROOT = "/todos"

class TodoStore {
    constructor() {
        this.currentTodo = state.currentTodo
        this.listener = () => { }
        this.errors = []
    }

    listen(listener) {
        this.listener = listener
    }

    unlisten() {
        this.listener = () => { }
    }

    //Appel à l'API pour récupération des tâche en fonction du status
    async getTasksByStatus(todoId, status) {
        const statusLink = {
            todo: 'todo',
            doing: 'progress',
            done: 'done'
        }
        const response = await fetchJson(itemUrl(todoId) + `/tasks?status=${status}`)
        if (!response.ok) throw new Error('Failed to fetch todo')
        const body = await response.json()
        const obj = this

        this.listener()


        subscribe(function (newState) {
            if (newState.currentTodo.tasks[statusLink[status]] !== obj.currentTodo.tasks[statusLink[status]]) {
                const allContainers = document.querySelectorAll('[data-tasks-status]')
                const container = [...allContainers].filter(container => container.getAttribute('data-tasks-status') === statusLink[status])
                if (container.length > 0) {
                    const container = document.querySelector(`[data-tasks-status="${statusLink[status]}"]`)
                    const listItem = container.querySelector('.todo__container__tasks__list');
                    listItem.innerHTML = '';
                    newState.currentTodo.tasks[statusLink[status]].forEach(task => {
                        taskCreator(task, listItem)
                    });
                    tasksHandlerLogic()
                    taskActionHandler(container);
                }
                obj.currentTodo.tasks[statusLink[status]] = newState.currentTodo.tasks[statusLink[status]]
                
            }

        });

        setTasksCollection(status, body);
        return body
    }

    async getTodo(id) {
        const response = await fetchJson(itemUrl(id))
        if (!response.ok) throw new Error('Failed to fetch todo')
        const body = await response.json()
        this.currentTodo.title = body.title
        this.currentTodo.description = body.description
        this.currentTodo.id = body.id
        this.listener()

        const description = document.querySelector('#todo__header__meta__description');
        const title = document.querySelector('#todo__header__meta__title')


        subscribe(function (newState) {
            //Afficher le titre et la desc dans le header
            const todo = newState.currentTodo
            if (todo.title != body.title || todo.description != body.description) {
                const newTodoContainer = document.querySelector('[data-new-todo]')
                if (newTodoContainer) newTodoContainer.removeAttribute('data-new-todo')
                title.textContent = newState.currentTodo.title
                description.textContent = newState.currentTodo.description ? newState.currentTodo.description : 'Description du projet'

            }

        });
        setTodo(body)

        const submitButton = document.querySelector('button[data-todo-submit]');
        submitButton.dataset.todoSubmit = 'update'
        return body
    }


    async createTodo() {
        if (state.currentTodo.title) {
            const response = await fetchJson(rootUrl(), {
                method: 'POST',
                body: JSON.stringify(
                    {
                        title: state.currentTodo.title,
                        description: state.currentTodo.description,
                        user: localStorage.getItem("user_id")
                    }
                )
            })
            const body = await response.json()
            if (!response.ok) {
                this.errors.push(body.error)
            }
            else {
                //Ajouter les tâches
                if (state.currentTodo.tasks) {
                    const statusList = Object.keys(state.currentTodo.tasks)
                    statusList.forEach(status => {

                        const newStatus = {
                            todo: 'todo',
                            progress: 'doing',
                            done: 'done'
                        }
                        state.currentTodo.tasks[status].forEach(async task => {
                            await taskStore.create({
                                title: task.title,
                                id: body.id,
                                status: newStatus[status]
                            })
                        });
                    })
                }

                //Rediriger vers la page
                localStorage.setItem('currentProject', body.id);
                //Mettre un message dans le state et rediriger vers la page de la todo créée
                setMessage({ text: "Les modifications ont bien été sauvegardées", type: 'success' })
                router.setRoute(`/project/${body.id}`)

                this.listener()
            }
        }
    }


    async updateTodo() {
        if (state.currentTodo.title) {
            const response = await fetchJson(itemUrl(state.currentTodo.id), {
                method: 'PATCH',
                body: JSON.stringify(
                    {
                        title: state.currentTodo.title,
                        description: state.currentTodo.description,
                    }
                )
            })
            const body = await response.json()
            if (!response.ok) {
                this.errors.push(body.error)
            }
            else {
                // Ajouter ou modifier les tâches
                if (state.currentTodo.tasks) {
                    const statusList = Object.keys(state.currentTodo.tasks)
                    statusList.forEach(status => {
                        const newStatus = {
                            todo: 'todo',
                            progress: 'doing',
                            done: 'done'
                        }
                        state.currentTodo.tasks[status].forEach(async task => {
                            if(!task.id) {
                                await taskStore.create({
                                    title: task.title,
                                    id: state.currentTodo.id,
                                    status: newStatus[status]
                                })
                            }else {
                                await taskStore.update({
                                    title: task.title,
                                    id: task.id,
                                    status: newStatus[status]
                                })
                            }

                        });
                    })
                    //Supprimer des tâches
                    if(state.currentTodo.tasksToDelete){
                        //TODO: provisoire supprime les doublons générer par le state
                        const newToDelete = state.currentTodo.tasksToDelete.filter((task,index)=>{
                            return state.currentTodo.tasksToDelete.indexOf(task) === index;
                          })
                          newToDelete.forEach(async id => {
                            await taskStore.delete(id)
                        });
                    }
                }

                setMessage({ text: "Les modifications ont bien été sauvegardées", type: 'success' })
                router.setRoute(`/project/${body.id}`)

                this.listener()
            }
        }
    }


    async deleteTodo(id) {
        const response = await fetchJson(itemUrl(id), {
            method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to delete todo')
    }
}




function setTodo(todo) {
    setState({
        ...state,
        currentTodo: {
            ...state.currentTodo,
            id: todo.id,
            title: todo.title,
            description: todo.desc,
        }
    })
}



async function fetchJson(url, options) {
    const response = await fetch(url, {
        credentials: 'include',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        ...options
    })
    return response
}


function rootUrl() {
    return new URL(TODOS_API_ROOT, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`)
}

function itemUrl(id) {
    if (!id) throw new Error(`bad id: ${id}`)
    return new URL(id.toString(), rootUrl() + '/')
}
const todoStore = new TodoStore()

export default todoStore