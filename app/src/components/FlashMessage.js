const FlashMessage = ({ message, type, animation = true }) => {
    const color = {
        success: 'flash-message--success',
        error: 'flash-message--error',
        warning: 'flash-message--warning',
        info: 'flash-message--info'
    }

    //Animer le message de bas en haut pendant 3 secondes, puis supprimer le message du state à la fin de l'animation
    return (
        `
        <div class="flash-message ${color[type]}" data-animate="${animation ? 'true' : 'false'}">
            ${!animation ? '<span id="flash-message__close"><i class="fa-solid fa-xmark"></i></span>': ''}
            <p>${message}</p>
        </div>
    `
    )

    

}


export default FlashMessage;