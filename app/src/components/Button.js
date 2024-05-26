const Button = ({
    type,
    text,
    centeredPosition,
    href = null,
    color = null,
    data = null,
    dataValue = null,
}) => {
    const colorPalette = {
        green: 'button--green',
        red: 'button--red',
        blue: 'button--blue',
    }
    return (`
            <${type === 'link' ? 'a data-navigo' : 'button'}
             class="custom-button ${centeredPosition ? ' button--centered' :  ''} ${color ? colorPalette[color] : ''}"
             ${type === 'button' ? 'type=' + type : ''}
             ${type === 'link' ? 'href=' + href : ''}
             >
            ${text}
            </${type === 'link' ? 'a' : 'button'}>
        `)
}

export default Button;