import FlashMessage from "../components/FlashMessage";
import { setState, state } from "../store";

export const messageHandler = (dependState, container) => {
    if (dependState.message.text) {
      container.insertAdjacentHTML('afterbegin', FlashMessage({ message: dependState.message.text, type: dependState.message.type }));
      }
    
      const messageElement = document.querySelector('.flash-message');
      if (messageElement) {
        //A la fin de l'animation supprimer le state
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
        }
    
      }
}