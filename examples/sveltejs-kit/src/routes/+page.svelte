<script lang="ts">
	import { provider } from "$lib/core/services";
	import type { Credentials } from "google-auth-library";
	import {
		googleLogout,
		hasGrantedAnyScopeGoogle,
		hasGrantedAllScopesGoogle,
		type SuccessAuthCodeResponse,
	} from "google-oauth-gsi";

	async function onGoogleLoginSuccess(tokenResponse: SuccessAuthCodeResponse) {
		console.log("(auth-code) tokenResponse: ", tokenResponse)
		const { code } = tokenResponse
		try {
			const response = await fetch(`/api/auth/google`, {
				method: 'POST',
				body: JSON.stringify({ code }),
				headers: { 'Content-Type': 'application/json' }
			})
			const data = (await response.json()) as Credentials
			if (!data.id_token) {
				return console.error('Failed to login with google')
			}
			console.log("id_token:", data.id_token)
			// Send id_token to BE
		} catch (err) {
			console.error(err)
		}
	}

	const loginWithCode = provider.useGoogleLogin({
		flow: 'auth-code',
		onSuccess: onGoogleLoginSuccess,
		onError: (res) => console.error('Failed to login with google', res),
	})
	const loginWithToken = provider.useGoogleLogin({
		flow: 'implicit',
		onSuccess: (tokenResponse) => {
			console.log("(implicit) tokenResponse: ", tokenResponse)
			const hasGrantedAnyScope = hasGrantedAnyScopeGoogle(
				tokenResponse,
				'email'
			)
			const hasGrantedAllScopes = hasGrantedAllScopesGoogle(
				tokenResponse,
				'profile'
			)
			console.log("hasGrantedAnyScope: ", hasGrantedAnyScope)
			console.log("hasGrantedAllScopes: ", hasGrantedAllScopes)
		}
	})
</script>

<button on:click={() => loginWithCode()}>
	Sign in with google (auth-code)
</button>
<button on:click={() => loginWithToken()}>
	Sign in with google (implicit)
</button>
<button on:click={googleLogout}>
	Logout
</button>
