import { router } from "../router"
import { setState, state, subscribe } from "../store"
import taskStore from "./taskStore"

const TODOS_API_ROOT = "/todos"

class TodoStore {
    constructor() {
        this.todos = []
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

    // async getTodo(id) {
    //     const response = await fetchJson(itemUrl(id))
    //     if (!response.ok) throw new Error('Failed to fetch todo')
    //     const body = await response.json()
    //     this.todos = body
    //     this.listener()
    //     setTodo(body)

    //     subscribe(function (newState) {
    //         //Afficher le titre dans le header
    //         const header = document.querySelector('#todo-container__header');
    //         const title = document.querySelector('#todo-container__header__title')
    //         title.textContent = body.title
    //         header.innerHTML += `
    //         <p id="todo-container__header__description">${body.description}</p>
    //         <p id="todo-container__header__infos">Créé par ${body.owner.firstname} ${body.owner.lastname} le ${body.createdAt}. <span>Dernière modification le ${body.updatedAt}</span></p>
    //         `
    //     });

    //     return body
    // }


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
                console.log(body.id)
                //Ajouter les tâches
                if (state.currentTodo.tasks) {
                    const statusList = Object.keys(state.currentTodo.tasks)
                    statusList.forEach(status => {

                    const newStatus = {
                        todo: 'todo',
                        progress: 'doing',
                        done: 'done'
                    }
                        state.currentTodo.tasks[status].forEach(task => {
                            taskStore.create({
                                title: task,
                                id: body.id,
                                status: newStatus[status]
                                    
                            
                            })

                        });
                    })

                }

                //Rediriger vers la page
                router.setRoute(`/project/${body.id}`)
                //Mettre un message dans le state
                setMessage({text: "Les modifications ont bien été sauvegardées", type: 'success'})
                // //Vider le state
                // setState({...state, currentTodo: {
                //     id: null,
                //     title: "",
                //     description: "",
                //     tasks: {
                //         done: [],
                //         todo: [],
                //         progress: [],
                //     }
                // }
                // })
                
                this.listener()
                // setTodo(body)
            }
        }
    }




}

function setMessage(message) {
    setState({...state, message })
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

function setTodo(todo) {
    setState({ ...state, currentTodo: todo });
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