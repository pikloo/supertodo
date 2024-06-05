export default function verifyFieldForm(input, name, message, inputToCompare = null) {
    input.addEventListener('blur', (e) => {
        if (!matchCondition(input, inputToCompare)) {
            if (!document.querySelector(`td[data-label-${name}] > p`)) {
                e.target.classList.add('error');
                const celElement = document.querySelector(`td[data-label-${name}]`);
                const errorElement = document.createElement('p');
                errorElement.classList.add('input-error-message');
                errorElement.textContent = message;
                celElement.append(errorElement);
            }
        } else {
            e.target.classList.remove('error');
            document.querySelector(`td[data-label-${name}] > p`)?.remove();
        }
    });
}

function matchCondition(input, inputToCompare = null) {
    switch (input.name) {
        case 'email':
            {
                const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return regex.test(input.value);
            }
        case 'password':
            {
                const regex = /^(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
                return regex.test(input.value);
            }
        case 'confirm-password':
            return input.value === inputToCompare.value;
        default:
            return false;
    }
}