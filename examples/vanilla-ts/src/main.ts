document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <button id="signIn">
      Sign in with google
    </button>
`;

import { GoogleOAuthProvider } from 'google-oauth-gsi';

const provider = new GoogleOAuthProvider({
    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    onScriptLoadError: () => console.log('onScriptLoadError'),
    onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
});

const login = provider.useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (res) => console.log('Logged in with google', res),
    onError: (err) => console.error('Failed to login with google', err),
});

document.getElementById('signIn')?.addEventListener('click', () => {
    if (login) login();
});

const buttonEl = document.createElement('div');
document.querySelector<HTMLDivElement>('#app')!.appendChild(buttonEl);

const renderButton = provider.useRenderButton({
    element: buttonEl,
    useOneTap: true,
    width: 200,
    onError: () => console.error('Failed to render button'),
    onSuccess: (res) =>
        console.log('Logged in with google (render button)', res),
});

window.addEventListener('load', () => {
    renderButton();
});
