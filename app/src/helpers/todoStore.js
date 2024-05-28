import { setMessage, setTodoInformations } from "../actions"
import { router } from "../router"
import { setState, state, subscribe } from "../store"
import { inputHandlerLogic } from "./inputHandler"
import taskStore from "./taskStore"

const TODOS_API_ROOT = "/todos"

class TodoStore {
    constructor() {
        this.currentTodo = {
            id: null,
            title: "",
            description: "",
            tasks: {
                done: [],
                todo: [],
                progress: [],
            }
        }
        this.listener = () => { }
        this.errors = []
    }

    listen(listener) {
        this.listener = listener
    }

    unlisten() {
        this.listener = () => { }
    }

    async getTodo(id) {
        const response = await fetchJson(itemUrl(id))
        if (!response.ok) throw new Error('Failed to fetch todo')
        const body = await response.json()
        this.currentTodo = body
        this.listener()

        const description = document.querySelector('#todo__header__meta__description');
                const title = document.querySelector('#todo__header__meta__title')

        subscribe(function (newState) {
            //Afficher le titre dans le header
            // if (newState.currentTodo != this.currentTodo) {
                
                const newTodoContainer = document.querySelector('[data-new-todo]')
                if (newTodoContainer) newTodoContainer.removeAttribute('data-new-todo')
                title.textContent = newState.currentTodo.title
                description.textContent = newState.currentTodo.description ? newState.currentTodo.description : 'Description du projet'
                this.currentTodo = newState.currentTodo
            // }

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
                        desc: state.currentTodo.description,
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
                        state.newTodo.tasks[status].forEach(async task => {
                            await taskStore.create({
                                title: task,
                                id: body.id,
                                status: newStatus[status]


                            })

                        });
                    })

                }

                //Rediriger vers la page
                localStorage.setItem('currentProject', body.id);
                setMessage({ text: "Les modifications ont bien été sauvegardées", type: 'success' })
                router.setRoute(`/project/${body.id}`)
                //Mettre un message dans le state

                this.listener()
                // setTodo(body)
            }
        }
    }


    async updateTodo(todo) {
        if (state.currentTodo.title) {
            const response = await fetchJson(itemUrl(state.currentTodo.id), {
                method: 'POST',
                body: JSON.stringify(
                    {
                        title: state.currentTodo.title,
                        desc: state.newTodo.description,
                    }
                )
            })
            const body = await response.json()
            if (!response.ok) {
                this.errors.push(body.error)
            }
            else {
                //Ajouter les tâches
                // if (state.newTodo.tasks) {
                //     const statusList = Object.keys(state.newTodo.tasks)
                //     statusList.forEach(status => {

                //         const newStatus = {
                //             todo: 'todo',
                //             progress: 'doing',
                //             done: 'done'
                //         }
                //         state.newTodo.tasks[status].forEach(async task => {
                //             await taskStore.create({
                //                 title: task,
                //                 id: body.id,
                //                 status: newStatus[status]


                //             })

                //         });
                //     })

                // }

                //Rediriger vers la page
                // localStorage.setItem('currentProject', body.id);
                setMessage({ text: "Les modifications ont bien été sauvegardées", type: 'success' })
                // router.setRoute(`/project/${body.id}`)
                //Mettre un message dans le state

                this.listener()
                // setTodo(body)
            }
        }
        
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