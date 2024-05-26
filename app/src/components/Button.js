const Button = ({
    type,
    text,
    centeredPosition,
    href = null
}) => {
    return (`
            <${type === 'link' ? 'a data-navigo' : 'button'}
             class="button ${centeredPosition && 'button--centered'}"
             ${type === 'button' ? 'type=' + type : ''}
             ${type === 'link' ? 'href=' + href : ''}
             >
            ${text}
            </${type === 'link' ? 'a' : 'button'}>
        `)
}

export default Button;