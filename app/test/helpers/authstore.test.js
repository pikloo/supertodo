import authStore from "../../src/helpers/authStore";

const originalEnv = process.env;

beforeEach(() => {
    jest.resetModules();
    process.env = {
        ...originalEnv,
        DOMAIN_URL: 'http://localhost',
        API_PORT: '8000'
    };
});

afterEach(() => {
    process.env = originalEnv;
});

// beforeEach(() => {
//     process.env = Object.assign(process.env, { DOMAIN_URL: 'http://localhost', API_PORT: '8000'});
// });


/**
 * @jest-environment node || jsdom
 */
test.only('Un message d\'erreur est-il bien visible si la connexion a échoué', async () => {
    const username = 'p.loukakou@gmail.com';
    const password = 'p';
    // authStore.login(username, password)
    // expect(authStore.getUserDatas()).toBe(userDatas);
    authStore.login(username, password);

    expect(authStore.loginFormError.length).not.toEqual(0);
})

test('Les informations sur l\'utilisateur sont elles bien envoyés après la connexion', async () => {
    const username = 'p.loukakou3@gmail.com';
    const password = 'p';
    await authStore.login(username, password)
    await waitFor(() => {
        expect(authStore.getUserDatas()).toHaveProperty('firstname');
        expect(authStore.getUserDatas()).toHaveProperty('lastname');
        expect(authStore.getUserDatas()).toHaveProperty('email')
    });

})