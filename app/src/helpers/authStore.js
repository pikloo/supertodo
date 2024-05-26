import { router } from "../router"
import { setState, state, subscribe } from "../store";

const LOGIN_API_ROOT = '/login';
const ME_API_ROOT = '/me';

class AuthStore {
  constructor() {
    this.loginFormError = []
    this.listener = () => { }
    this.userDatas = state.userDatas
  }

  listen(listener) {
    this.listener = listener
  }

  unlisten() {
    this.listener = () => { }
  }

  async login(email, password) {
    const response = await fetchJson(new URL(LOGIN_API_ROOT, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`), {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    if (!response.ok) {
      this.loginFormError = [];
      const body = await response.json()
      switch (response.status) {
        case 400:
          this.loginFormError.push(body.error)
          break;
        case 503:
          this.loginFormError.push(body.errors)
          break;
        default:
          break;
      }
      //Afficher les erreurs sous le sous titre
      let errorList = document.querySelector('.errors');
      if (errorList) errorList.innerHTML = '';
      errorList = errorList != null ? errorList : document.createElement('ul');
      errorList.classList.add('errors');
      this.loginFormError.forEach(error => {
        let errorItem = document.createElement('li');
        errorItem.textContent = error;
        errorList.appendChild(errorItem);
      });
      const titleContainer = document.querySelector('#home__container__title');
      titleContainer.after(errorList);
    } else {
      const body = await response.json()
      this.listener()

      // await this.me()
      // Redirection vers la page dashboard
      router.setRoute('/dashboard')
      return body
    }
  }

  async me() {
    const response = await fetchJson(new URL(ME_API_ROOT, `${process.env.DOMAIN_URL}:${process.env.API_PORT}`))
    if (!response.ok) throw new Error('Failed to fetch me')
    // Récupération de l'utilisateur connecté
    const body = await response.json()
    // On stocke l'id de l'utilisateur dans le localstorage
    localStorage.setItem('user_id', body.id)

    subscribe(function (newState) {
      //On compare l'ancien et le nouveau state pour éviter les doublons de mis à jour du DOM
      if (newState.userDatas !== this.userDatas){
        document.querySelector('#dashboard__header__text').textContent += `${newState.userDatas.firstname} ${newState.userDatas.lastname} 👋🏿 !`;
        const memberRowElement = document.querySelector('#dashboard__content__user__stats [data-stats-member]');
        const celElement = document.createElement('td');
        celElement.innerHTML = newState.userDatas.member_since;
        memberRowElement.appendChild(celElement);
        this.userDatas = newState.userDatas
      }
      
    });

    setUserDatas(body)
    return body
  }


}

function setUserDatas(userDatas) {
  setState({...state, userDatas});
}

async function fetchJson(url, options) {
  const response = await fetch(url, {
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    ...options
  })
  return response
}


const authStore = new AuthStore()

export default authStore