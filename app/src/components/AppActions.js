const AppAction = () => {
    return (`
    <div id="app-actions">
      <button type="button" id="app-actions__theme" role="switch" data-theme-toggle="light" aria-label="Changer le thème" aria-checked="false">
        <span id="app-actions__theme__cursor"></span>
      </button>
    </div>
    `)
}

export default AppAction;