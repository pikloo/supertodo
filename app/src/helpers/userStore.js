import Button from "../components/Button"
import { router } from "../router"
import { setState, state, subscribe } from "../store"

const USERS_API_ROOT = '/users'

class UserStore {
  constructor() {
    this.listener = () => { }
    this.todos = state.todos
  }

  listen(listener) {
    this.listener = listener
  }

  unlisten() {
    this.listener = () => { }
  }

  async allTodos(id) {
    const response = await fetchJson(new URL(`${USERS_API_ROOT}/${id.toString()}/todos`, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`))
    if (!response.ok) throw new Error('Failed to fetch all todos')
    const body = await response.json()
    this.listener()

    subscribe(function (newState) {
      if (newState.todos !== this.todos) {
        const todos = newState.todos;
        const projectSection = document.querySelector('#dashboard__content__projects')
        if (todos.length > 0) {
          const projectsList = document.createElement('ul');
          projectsList.setAttribute('id', 'dashboard__content__projects__container');

          todos.forEach(todo => {
            const projectElement = document.createElement('li');
            projectElement.classList.add('dashboard__content__projects__container__item');
            projectElement.innerHTML = `
          <a href="project/${todo.id}" data-navigo class="dashboard__content__projects__container__item__card">
            <h3>${todo.title}</h3>
            <p>${todo.createdAt}</p>
          </a>
        `;
            projectsList.appendChild(projectElement);
          });
          projectSection.innerHTML += `
          ${Button({ type: 'link', text: 'Nouveau projet ➕', centeredPosition: true, href: 'newproject' })}
        `;
          projectSection.appendChild(projectsList);
        } else {
          const projectEmptyDiv = document.createElement('div');
          projectEmptyDiv.setAttribute('id', 'dashboard__content__projects__empty');
          projectEmptyDiv.innerHTML = `
          <p>Vous n'avez pas encore de projet</p>
          ${Button({ type: 'link', text: 'Créer un nouveau projet 📋',  href: 'newproject' })}
        `;

          projectSection.appendChild(projectEmptyDiv);
        }
        this.todos = newState.todos

      }
    })
    setUserTodos(body)

    // const links = document.querySelectorAll('a[data-navigo]')
    // links.forEach(link => {
    //   link.addEventListener('click', (e) => {
    //     e.preventDefault();
    //     router.setRoute(`/${link.href.split('/')[3]}`)
    //   });
    // });

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

function setUserTodos(todos) {
  setState({ ...state, todos });
}

function rootUrl() {
  return new URL(USERS_API_ROOT, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`)
}

function itemUrl(id) {
  if (!id) throw new Error(`bad id: ${id}`)
  return new URL(id.toString(), rootUrl() + '/')
}


const userStore = new UserStore()

export default userStore