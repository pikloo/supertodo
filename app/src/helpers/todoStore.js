const TODOS_API_ROOT = "/todos"

class TodoStore {
    constructor() {
        this.todos = []
        this.listener = () => { }
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
        this.todos = body
        this.listener()
        setTodo(body)

        subscribe(function (newState) {
            //Afficher le titre dans le header
            const header = document.querySelector('#todo-container__header');
            const title = document.querySelector('#todo-container__header__title') 
            title.textContent = body.title
            header.innerHTML += `
            <p id="todo-container__header__description">${body.description}</p>
            <p id="todo-container__header__infos">Créé par ${body.owner.firstname} ${body.owner.lastname} le ${body.createdAt}. <span>Dernière modification le ${body.updatedAt}</span></p>
            ` 
          });

        return body
    }



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