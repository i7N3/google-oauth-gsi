import { extractClientId } from './utils';
import type {
    CodeClient,
    TokenClient,
    CodeResponse,
    TokenResponse,
    NonOAuthError,
    GoogleLoginProps,
    UseGoogleLoginOptions,
    UseLoadGsiScriptOptions,
    GoogleCredentialResponse,
    GoogleOAuthProviderProps,
    UseGoogleOneTapLoginOptions,
    OverridableTokenClientConfig,
} from './types';

export default class GoogleOAuthProvider {
    private clientId: string;
    private scriptLoadedSuccessfully = false;
    private containerHeightMap = { large: '40', medium: '32', small: '20' };

    constructor({
        clientId,
        onScriptLoadError,
        onScriptLoadSuccess,
    }: GoogleOAuthProviderProps) {
        this.clientId = clientId;
        if (typeof window === 'undefined') return;
        this.useLoadGsiScript({ onScriptLoadError, onScriptLoadSuccess });
    }

    private useLoadGsiScript({
        onScriptLoadSuccess,
        onScriptLoadError,
    }: UseLoadGsiScriptOptions = {}) {
        /**
         *
         * TODO: think about how to make this more flexible.
         *
         * This method of initializing the script has some security implications.
         *
         * - What if we want to serve script from our own domain?
         * - What if we want to use nonce?
         *
         */
        const scriptTag = document.createElement('script');
        scriptTag.src = 'https://accounts.google.com/gsi/client';
        scriptTag.async = true;
        scriptTag.defer = true;
        scriptTag.onload = () => {
            this.scriptLoadedSuccessfully = true;
            if (onScriptLoadSuccess) onScriptLoadSuccess();
        };
        scriptTag.onerror = () => {
            this.scriptLoadedSuccessfully = false;
            if (onScriptLoadError) onScriptLoadError();
        };
        document.body.appendChild(scriptTag);
    }

    useGoogleLogin(opts: UseGoogleLoginOptions) {
        // curry to postpone execution
        return (overrideConfig?: OverridableTokenClientConfig) => {
            return this.useGoogleLoginPostponed(opts)(overrideConfig);
        };
    }

    private useGoogleLoginPostponed({
        flow = 'implicit',
        scope = '',
        onSuccess,
        onError,
        onNonOAuthError,
        overrideScope,
        ...rest
    }: UseGoogleLoginOptions) {
        if (!this.scriptLoadedSuccessfully) {
            return () => {};
        }

        const clientMethod =
            flow === 'implicit' ? 'initTokenClient' : 'initCodeClient';

        const client = window.google?.accounts.oauth2[clientMethod]({
            client_id: this.clientId,
            scope: overrideScope ? scope : `openid profile email ${scope}`,
            callback: (response: CodeResponse | TokenResponse) => {
                if (onError && response.error) return onError(response);
                if (onSuccess) onSuccess(response as any);
            },
            error_callback: (nonOAuthError: NonOAuthError) => {
                if (onNonOAuthError) onNonOAuthError(nonOAuthError);
            },
            ...rest,
        }) as CodeClient | TokenClient;

        const loginImplicitFlow = (
            overrideConfig?: OverridableTokenClientConfig,
        ) => {
            return (client as TokenClient).requestAccessToken(overrideConfig);
        };

        const loginAuthCodeFlow = () => {
            return (client as CodeClient).requestCode();
        };

        return flow === 'implicit' ? loginImplicitFlow : loginAuthCodeFlow;
    }

    useGoogleOneTapLogin(opts: UseGoogleOneTapLoginOptions) {
        return () => {
            this.useGoogleOneTapLoginPostponed(opts);
        };
    }

    private useGoogleOneTapLoginPostponed({
        onError,
        onSuccess,
        hosted_domain,
        use_fedcm_for_prompt,
        cancel_on_tap_outside,
        promptMomentNotification,
    }: UseGoogleOneTapLoginOptions) {
        if (typeof window === 'undefined') return;
        if (!this.scriptLoadedSuccessfully) return;

        window.google?.accounts.id.initialize({
            hosted_domain,
            cancel_on_tap_outside,
            client_id: this.clientId,
            use_fedcm_for_prompt: use_fedcm_for_prompt ?? true,
            callback: (credentialResponse: GoogleCredentialResponse) => {
                if (!credentialResponse?.credential && onError) {
                    return onError();
                }

                const { credential, select_by } = credentialResponse;
                onSuccess({
                    select_by,
                    credential,
                    clientId: extractClientId(credentialResponse),
                });
            },
        });

        window.google?.accounts.id.prompt(promptMomentNotification);
    }

    useRenderButton(opts: GoogleLoginProps) {
        return () => {
            this.useRenderButtonPostponed(opts);
        };
    }

    private useRenderButtonPostponed({
        onSuccess,
        onError,
        useOneTap,
        promptMomentNotification,
        type = 'standard',
        theme = 'outline',
        size = 'large',
        text,
        shape,
        element,
        logo_alignment,
        width,
        locale,
        click_listener,
        use_fedcm_for_prompt,
        ...props
    }: GoogleLoginProps) {
        if (!this.scriptLoadedSuccessfully) return;

        window.google?.accounts.id.initialize({
            client_id: this.clientId,
            use_fedcm_for_prompt: use_fedcm_for_prompt ?? true,
            callback: (credentialResponse: GoogleCredentialResponse) => {
                if (!credentialResponse?.credential && onError) {
                    return onError();
                }

                const { credential, select_by } = credentialResponse;
                onSuccess({
                    select_by,
                    credential,
                    clientId: extractClientId(credentialResponse),
                });
            },
            ...props,
        });

        element.style.height = this.containerHeightMap[size];
        window.google?.accounts.id.renderButton(element, {
            type,
            size,
            text,
            theme,
            shape,
            width,
            locale,
            logo_alignment,
            click_listener,
        });

        if (useOneTap) {
            window.google?.accounts.id.prompt(promptMomentNotification);
        }
    }
}
