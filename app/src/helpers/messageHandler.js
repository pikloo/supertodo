import FlashMessage from "../components/FlashMessage";
import { setState, state } from "../store";



const animeMessage = (messageElement, container, isAnimate = true) => {
  container.setAttribute('data-has-message', 'true');

  let keyFrame1 = {opacity: 1};
  let keyFrame2 = {opacity: 0};

  if (isAnimate) {
    keyFrame1 = {...keyFrame1, transform: 'translateY(0)'};
    keyFrame2 = {...keyFrame2, transform: 'translateY(-200%)'};
  }

  const anim = messageElement.animate([
    keyFrame1, keyFrame2
  ],
    {
      duration: isAnimate ? 1000 : 300,
      delay: isAnimate ? 2000 : 0,
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
        animeMessage(messageElement, container, false);
      })
}

