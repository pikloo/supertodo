const TASKS_API_ROOT = '/tasks'

class TaskStore {
  constructor() {
    this.tasks = {}
    this.errors = []
  }

  listen(listener) {
    this.listener = listener
  }

  unlisten() {
    this.listener = () => { }
  }

  //Appel à l'API pour récupération des tâche en fonction du status
  async getTasksByStatus(status, currentTodo) {
    const statusLink = {
      todo: 'todo',
      doing: 'progress',
      complete: 'done'
    }
    const response = await fetchJson(itemUrl(state.currentTodo.id) + `/tasks?status=${status}`)
    if (!response.ok) throw new Error('Failed to fetch todo')
    const body = await response.json()

    this.listener()

    subscribe(function (newState) {

      console.log(newState.currentTodo.tasks[statusLink[status]], currentTodo.tasks[statusLink[status]])
      if (newState.currentTodo.tasks[statusLink[status]] !== currentTodo.tasks[statusLink[status]]) {
        // if (newState.currentTodo!= this.currentTodo) {
        const allContainers = document.querySelectorAll('[data-tasks-status]')
        const container = [...allContainers].filter(container => container.getAttribute('data-tasks-status') === statusLink[status])
        if (container.length > 0) {
          const container = document.querySelector(`[data-tasks-status="${statusLink[status]}"]`)
          const listItem = document.createElement('ul');
          listItem.setAttribute('class', `todo__container__tasks__list`);
          newState.currentTodo.tasks[statusLink[status]].forEach(task => {
            taskCreator(task.title, listItem)
          });
          container.appendChild(listItem);
        }
      }
    });

    setTasksCollection(status, body);
    return body
  }


  async create(task) {
    const response = await fetchJson(rootUrl(), {
      method: 'POST',
      body: JSON.stringify(
        {
          title: task.title,
          status: task.status,
          todo: task.id,
        }
      )
    })
    const body = await response.json()
    if (!response.ok) {
      this.errors.push(body.error)
    }
  }

  async update(task) {
    const response = await fetchJson(itemUrl(task.id), {
      method: 'PATCH',
      body: JSON.stringify(
        {
          title: task.title,
          status: task.status,
        }
      )
    })
    const body = await response.json()
    if (!response.ok) {
      this.errors.push(body.error)
    }
  }

  async delete(id) {
    console.log(id)
    const response = await fetchJson(itemUrl(id), { method: 'DELETE' })
    // const body = await response.json()
    // if (!response.ok) {
    //   this.errors.push(body.error)
    // }
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

function rootUrl() {
  return new URL(TASKS_API_ROOT, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`)
}

function itemUrl(id) {
  if (!id) throw new Error(`bad id: ${id}`)
  return new URL(id.toString(), rootUrl() + '/')
}

const taskStore = new TaskStore()

export default taskStore