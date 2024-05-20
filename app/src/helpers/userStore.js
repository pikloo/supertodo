const USERS_API_ROOT = '/api/users'
import dotenv from 'dotenv'
dotenv.config()

class UserStore {
  constructor() {
    this.tasks = []
    this.listener = () => {}
  }

  listen(listener) {
    this.listener = listener
  }

  unlisten() {
    this.listener = () => {}
  }

  async login(email, password){
    const response = await fetchJson(rootUrl(), {
        method: 'POST',
        body: JSON.stringify({ email, password })
      })
      console.log(response)
    //   if (!response.ok) {
    //     if (response.status === 400) {
    //       const body = await response.json()
    //       throw new Error(body.error.message)
    //     }
    //     throw new Error('Failed to create task')
    //   }else {
    //     console.log(response);
    //   }
  }
  

}

async function fetchJson(url, options) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    ...options
  })
  return response
}

function rootUrl() {
  return new URL(USERS_API_ROOT, `${process.env.DOMAIN_URL}:${API_PORT}`)
}

function itemUrl(id) {
  if (!id) throw new Error(`bad id: ${id}`)
  return new URL(id.toString(), rootUrl() + '/')
}

const userStore = new UserStore()

export default userStore