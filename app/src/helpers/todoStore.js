import { setMessage, setTasksCollection, setTodoInformations } from "../actions"
import FlashMessage from "../components/FlashMessage"
import { router } from "../router"
import { setState, state, subscribe } from "../store"
import { inputHandlerLogic, taskCreator } from "./inputHandler"
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
            console.log(obj.currentTodo.tasks[statusLink[status]], newState.currentTodo.tasks[statusLink[status]])     
            if (newState.currentTodo.tasks[statusLink[status]] !== obj.currentTodo.tasks[statusLink[status]]) {
                // if (newState.currentTodo!= this.currentTodo) {
                const allContainers = document.querySelectorAll('[data-tasks-status]')
                const container = [...allContainers].filter(container => container.getAttribute('data-tasks-status') === statusLink[status])
                if (container.length > 0) {
                    const container = document.querySelector(`[data-tasks-status="${statusLink[status]}"]`)
                    const listItem = container.querySelector('.todo__container__tasks__list');
                    listItem.innerHTML = '';
                    // listItem.setAttribute('class', `todo__container__tasks__list`);
                    newState.currentTodo.tasks[statusLink[status]].forEach(task => {
                        taskCreator(task, listItem)
                    });
                    // container.appendChild(listItem);
                }
                obj.currentTodo.tasks[statusLink[status]] = newState.currentTodo.tasks[statusLink[status]]
            }


            // inputHandlerLogic()
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
            //Afficher le titre dans le header
            const todo = newState.currentTodo
            if (todo.title != body.title || todo.description != body.description) {
                const newTodoContainer = document.querySelector('[data-new-todo]')
                if (newTodoContainer) newTodoContainer.removeAttribute('data-new-todo')
                title.textContent = newState.currentTodo.title
                description.textContent = newState.currentTodo.description ? newState.currentTodo.description : 'Description du projet'
                // this.currentTodo.title = todo.title
                // this.currentTodo.description = todo.description
            }

        });
        setTodo(body)

        // await this.getTasksByStatus('todo', this.currentTodo)
        // await this.getTasksByStatus('doing', this.currentTodo)
        // await this.getTasksByStatus('done', this.currentTodo)


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
                        state.currentTodo.tasks[status].forEach(async task => {
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
                method: 'PATCH',
                body: JSON.stringify(
                    {
                        title: state.currentTodo.title,
                        desc: state.currentTodo.description,
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
                subscribe(function (newState) {
                    const todoContainer = document.querySelector('#todo');
                    messageHandler(newState, todoContainer)

                });
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