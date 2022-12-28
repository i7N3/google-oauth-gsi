import { GoogleOAuthProvider } from 'google-oauth-gsi';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';

export const provider = new GoogleOAuthProvider({
	clientId: PUBLIC_GOOGLE_CLIENT_ID,
	onScriptLoadError: () => console.log('onScriptLoadError'),
	onScriptLoadSuccess: () => {
		console.log('onScriptLoadSuccess');
		// oneTap();
	}
});

// const oneTap = provider.useGoogleOneTapLogin({
// 	cancel_on_tap_outside: true,
// 	onSuccess: (tokenResponse) => {
// 		console.log('(one-tap) tokenResponse: ', tokenResponse);
// 	}
// });
