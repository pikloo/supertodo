import Button from "../components/Button";
import AuthStore from "../helpers/authStore";
import verifyFieldForm from "../helpers/verifyFieldForm";

const Register = (() => {
    const shell = document.querySelector('#app');

    shell.innerHTML = `
    <div id="register">
        <div id="register__container" class="box">
            <div id="register__container__title">
            <h1>Toudou</h1>
            <h2>Inscription</h2>
            </div>
            <form id="register__container__form">
                <p id="register__container__form__rules">
                Tous les champs sont obligatoires
                </p>
                <table id="register__container__form__table">
                    <tr>
                        <td data-label-firstname>
                            <label for="firstname">Prénom</label>
                        </td>
                        <td>
                            <input type="text" name="firstname" id="firstname" placeholder="John">
                        </td>
                    </tr>
                    <tr>
                        <td data-label-lastname>
                            <label for="lastname">Nom</label>
                        </td>
                        <td>
                            <input type="text" name="lastname" id="lastname" placeholder="Doe">
                        </td>
                    </tr>
                    <tr>
                        <td data-label-email>
                            <label for="email">Email</label>
                        </td>
                        <td>
                            <input type="text" name="email" id="email" placeholder="john@doe.com">
                        </td>
                    </tr>
                    <tr>
                        <td data-label-password>
                            <label for="password">Mot de passe</label>
                        </td>
                        <td>
                            <input type="password" name="password" id="password" placeholder="********">
                        </td>
                    </tr>
                    <tr>
                        <td data-label-confirm-password>
                            <label for="confirm-password">Confirmer le mot de passe</label>
                        </td>
                        <td>
                            <input type="password" name="confirm-password" id="confirm-password" placeholder="********">
                        </td>
                    </tr>
                </table>
            ${Button({ type: "submit", text: "S'inscrire", centeredPosition: true })}
            </form>
        </div>
        <div class="home__links">
        <p>Vous êtes déja inscrit? <a href="/" data-navigo>Connectez-vous</a></p>
        </div>
    </div>
    `;

    const form = document.querySelector('#register__container__form');
    const passwordInput = document.querySelector('input[id="password"]');
    const confirmPasswordInput = document.querySelector('input[id="confirm-password"]');
    const emailInput = document.querySelector('input[id="email"]');

    verifyFieldForm(emailInput, 'email', 'L\'email n\'est pas valide');
    verifyFieldForm(passwordInput, 'password', 'Le mot de passe doit contenir 1 majuscule, 8 caractères et au moins un chiffre');
    verifyFieldForm(confirmPasswordInput, 'confirm-password', 'Les mots de passe ne sont pas identiques',  passwordInput);


    form.addEventListener('submit', (e) => {
        e.preventDefault();
        AuthStore.register(e.target.elements.firstname.value, e.target.elements.lastname.value, e.target.elements.email.value, e.target.elements.password.value);

    });

    return {
        node: shell.firstElementChild,
        markup: shell.innerHTML,
    };
});

export default Register;