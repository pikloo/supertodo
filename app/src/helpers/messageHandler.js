import FlashMessage from "../components/FlashMessage";
import { setState, state } from "../store";



const animeMessage = (messageElement, container) => {
  container.setAttribute('data-has-message', 'true');
  const anim = messageElement.animate([
    { opacity: 1, transform: 'translateY(0)' },
    { opacity: 0, transform: 'translateY(-200%)' }
  ],
    {
      duration: 1000,
      delay: 2000,
      fill: "both",
    },
  )
  anim.onfinish = () => {
    setState({ ...state, message: { text: null, type: null } })
    messageElement.remove();
    container.removeAttribute('data-has-message')
  }

}

export const messageHandler = (container) => {
    if (state.message.text) {
      //Pour insérer du contenu en choisissant l'emplacement exact
      container.insertAdjacentHTML('afterbegin', FlashMessage({ message: state.message.text, type: state.message.type, animation:state.message.animation }));
      }
    
      const messageElement = document.querySelector('.flash-message');
      if (messageElement && state.message.animation ) {
        animeMessage(messageElement, container);
      }
      const closeButton = messageElement?.querySelector('#flash-message__close');
      closeButton?.addEventListener('click', (e) => {
        e.preventDefault();
        animeMessage(messageElement, container);
      })
}

