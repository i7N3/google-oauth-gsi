# google-oauth-gsi (OAuth2 | Google)

A user-friendly API for GIS SDK, using the new [**Google Identity Services SDK**](https://developers.google.com/identity/gsi/web) 🚀

-   ⚡️ Lightweight
-   📦 SSR friendly
-   🕊 Dependency free
-   🔑 Fully Typed APIs
-   💡 Framework agnostic

## Install

```
$ pnpm add google-oauth-gsi@latest
```

## Seamless sign-in and sign-up flows

-   **Sign In With Google** - Add a personalized and customizable sign-up or sign-in button to your website.
-   **One-tap sign-up** - Sign up new users with just one tap, without interrupting them with a sign-up screen. Users get a secure, token-based, passwordless account on your site, protected by their Google Account.
-   **Automatic sign-in** - Sign users in automatically when they return to your site on any device or browser, even after their session expires.

## User authorization for Google APIs (with custom button)

OAuth 2.0 implicit and authorization code flows for web apps

> The Google Identity Services JavaScript library helps you to quickly and safely obtain access tokens necessary to call Google APIs. Your web application, complete either the OAuth 2.0 implicit flow, or to initiate the authorization code flow which then finishes on your backend platform.

## How to use

1. Get your [**Google API client ID**](https://console.cloud.google.com/apis/dashboard)

> Key Point: Add both `http://localhost` and `http://localhost:<port_number>` to the Authorized JavaScript origins box for local tests or development. `127.0.0.1` is not a valid origin, use `localhost` instead.

2. Configure your OAuth [**Consent Screen**](https://console.cloud.google.com/apis/credentials/consent)

3. Create instance of `GoogleOAuthProvider` somewhere in your application.

```ts
import { GoogleOAuthProvider } from 'google-oauth-gsi';

export const googleProvider = new GoogleOAuthProvider({
    clientId: process.env.PUBLIC_GOOGLE_CLIENT_ID,
    onScriptLoadError: () => console.log('onScriptLoadError'),
    onScriptLoadSuccess: () => console.log('onScriptLoadSuccess'),
});
```

### Sign In With Google

```ts
import { googleProvider } from './services';

const login = googleProvider.useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (res) => console.log('Logged in with google', res),
    onError: (err) => console.error('Failed to login with google', err),
});

// Call login() on button click
```

### One-tap

```ts
import { googleProvider } from './services';

const oneTap = googleProvider.useGoogleOneTapLogin({
    cancel_on_tap_outside: true,
    onSuccess: (res) => console.log('Logged in with google', res),
});

// Call oneTap() on onMount or onScriptLoadSuccess
```

or

```ts
import { buttonEl } from './somewhere';
import { googleProvider } from './services';

const renderButton = googleProvider.useRenderButton({
    useOneTap: true,
    element: buttonEl as HTMLElement,
    onError: () => console.error('Failed to render button'),
    onSuccess: (res) =>
        console.log('Logged in with google (render button)', res),
});

// Call renderButton() onMount or onScriptLoadSuccess
```

> If you are using one tap login, when logging user out consider [this issue](https://developers.google.com/identity/gsi/web/guides/automatic-sign-in-sign-out#sign-out) may happen, to prevent it call `googleLogout` when logging user out from your application.

```ts
import { googleLogout } from 'google-oauth-gsi';

googleLogout();
```

### Custom login button (implicit & authorization code flow)

#### Implicit flow

```ts
import { googleProvider } from './services';

const login = googleProvider.useGoogleLogin({
    flow: 'implicit',
    onSuccess: (tokenResponse) => console.log(tokenResponse),
});

// Call login() when you need
```

#### Authorization code flow

> Requires backend to exchange code with access and refresh token. If you need `id_token` then use this. Check examples to see how to do it.

```ts
import { googleProvider } from './services';

const login = googleProvider.useGoogleLogin({
    flow: 'auth-code',
    onSuccess: (codeResponse) => console.log(codeResponse),
});

// Call login() when you need
```

#### Checks if the user granted all the specified scope or scopes

```ts
import { hasGrantedAllScopesGoogle } from 'google-oauth-gsi';

const hasAccess = hasGrantedAllScopesGoogle(
    tokenResponse,
    'google-scope-1',
    'google-scope-2',
);
```

#### Checks if the user granted any of the specified scope or scopes

```ts
import { hasGrantedAnyScopeGoogle } from 'google-oauth-gsi';

const hasAccess = hasGrantedAnyScopeGoogle(
    tokenResponse,
    'google-scope-1',
    'google-scope-2',
);
```

## API

### GoogleOAuthProvider

| Required | Prop                | Type       | Description                                                                 |
| :------: | ------------------- | ---------- | --------------------------------------------------------------------------- |
|    ✓     | clientId            | `string`   | [**Google API client ID**](https://console.cloud.google.com/apis/dashboard) |
|          | onScriptLoadSuccess | `function` | Callback fires on load gsi script success                                   |
|          | onScriptLoadError   | `function` | Callback fires on load gsi script failure                                   |

### useGoogleLogin (Both implicit & authorization code flow)

| Required | Prop                  | Type                                                                                      | Description                                                                                                                                                                                                                                                                                                                                     |
| :------: | --------------------- | ----------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          | flow                  | `implicit` \| `auth-code`                                                                 | [Two flows](https://developers.google.com/identity/oauth2/web/guides/how-user-authz-works), implicit and authorization code are discussed. Both return an access token suitable for use with Google APIs                                                                                                                                        |
|          | onSuccess             | `(response: TokenResponse\|CodeResponse) => void`                                         | Callback fires with response ([token](https://developers.google.com/identity/oauth2/web/reference/js-reference#TokenResponse) \| [code](https://developers.google.com/identity/oauth2/web/reference/js-reference#CodeResponse)) based on flow selected after successfully login                                                                 |
|          | onError               | `(errorResponse: {error: string; error_description?: string,error_uri?: string}) => void` | Callback fires after login failure                                                                                                                                                                                                                                                                                                              |
|          | onNonOAuthError       | `(nonOAuthError: NonOAuthError) => void`                                                  | Some non-OAuth errors, such as the popup window is failed to open or closed before an OAuth response is returned. `popup_failed_to_open` \| `popup_closed` \| `unknown`                                                                                                                                                                         |
|          | scope                 | `string`                                                                                  | A space-delimited list of scopes that are approved by the user                                                                                                                                                                                                                                                                                  |
|          | enable_serial_consent | `boolean`                                                                                 | defaults to true. If set to false, [more granular Google Account permissions](https://developers.googleblog.com/2018/10/more-granular-google-account.html) will be disabled for clients created before 2019. No effect for newer clients, since more granular permissions is always enabled for them.                                           |
|          | hint                  | `string`                                                                                  | If your application knows which user should authorize the request, it can use this property to provide a hint to Google. The email address for the target user. For more information, see the [login_hint](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs |
|          | hosted_domain         | `string`                                                                                  | If your application knows the Workspace domain the user belongs to, use this to provide a hint to Google. For more information, see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs                                                               |

### useGoogleLogin (Extra implicit flow props)

| Required | Prop   | Type                                            | Description                                                                                                                                                         |
| :------: | ------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          | prompt | `''` \| `none` \| `consent` \| `select_account` | defaults to 'select_account'. A space-delimited, case-sensitive list of prompts to present the user                                                                 |
|          | state  | `string`                                        | Not recommended. Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response |

### useGoogleLogin (Extra authorization code flow props)

| Required | Prop           | Type                  | Description                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| :------: | -------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|          | ux_mode        | `popup` \| `redirect` | The UX mode to use for the authorization flow. By default, it will open the consent flow in a popup. Valid values are popup and redirect                                                                                                                                                                                                                                                                                                                |
|          | redirect_uri   | `string`              | Required for redirect UX. Determines where the API server redirects the user after the user completes the authorization flow The value must exactly match one of the authorized redirect URIs for the OAuth 2.0 client which you configured in the API Console and must conform to our [Redirect URI validation](https://developers.google.com/identity/protocols/oauth2/web-server#uri-validation) rules. The property will be ignored by the popup UX |
|          | state          | `string`              | Recommended for redirect UX. Specifies any string value that your application uses to maintain state between your authorization request and the authorization server's response                                                                                                                                                                                                                                                                         |
|          | select_account | `boolean`             | defaults to 'false'. Boolean value to prompt the user to select an account                                                                                                                                                                                                                                                                                                                                                                              |

### useGoogleOneTapLogin

| Required | Prop                     | Type                                               | Description                                                                                                                                                                                                                                                                       |
| :------: | ------------------------ | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    ✓     | onSuccess                | `(response: CredentialResponse) => void`           | Callback fires with credential response after successfully login                                                                                                                                                                                                                  |
|          | onError                  | `function`                                         | Callback fires after login failure                                                                                                                                                                                                                                                |
|          | promptMomentNotification | `(notification: PromptMomentNotification) => void` | [PromptMomentNotification](https://developers.google.com/identity/gsi/web/reference/js-reference) methods and description                                                                                                                                                         |
|          | cancel_on_tap_outside    | `boolean`                                          | Controls whether to cancel the prompt if the user clicks outside of the prompt                                                                                                                                                                                                    |
|          | hosted_domain            | `string`                                           | If your application knows the Workspace domain the user belongs to, use this to provide a hint to Google. For more information, see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs |

### useRenderButton

| Required | Prop                               | Type                                                          | Description                                                                                                                                                                                                                                                                       |
| :------: | ---------------------------------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|    ✓     | element                            | `HTMLElement`                                                 | The element to render the button in                                                                                                                                                                                                                                               |
|    ✓     | onSuccess                          | `(response: CredentialResponse) => void`                      | Callback fires with credential response after successfully login                                                                                                                                                                                                                  |
|          | onError                            | `function`                                                    | Callback fires after login failure                                                                                                                                                                                                                                                |
|          | type                               | `standard` \| `icon`                                          | Button type [type](https://developers.google.com/identity/gsi/web/reference/js-reference#type)                                                                                                                                                                                    |
|          | theme                              | `outline` \| `filled_blue` \| `filled_black`                  | Button [theme](https://developers.google.com/identity/gsi/web/reference/js-reference#theme)                                                                                                                                                                                       |
|          | size                               | `large` \| `medium` \| `small`                                | Button [size](https://developers.google.com/identity/gsi/web/reference/js-reference#size)                                                                                                                                                                                         |
|          | text                               | `signin_with` \| `signup_with` \| `continue_with` \| `signin` | Button [text](https://developers.google.com/identity/gsi/web/reference/js-reference#text). For example, "Sign in with Google", "Sign up with Google" or "Sign in"                                                                                                                 |
|          | shape                              | `rectangular` \| `pill` \| `circle` \| `square`               | Button [shape](https://developers.google.com/identity/gsi/web/reference/js-reference#shape)                                                                                                                                                                                       |
|          | logo_alignment                     | `left` \| `center`                                            | Google [logo alignment](https://developers.google.com/identity/gsi/web/reference/js-reference#logo_alignment)                                                                                                                                                                     |
|          | width                              | `string`                                                      | button [width](https://developers.google.com/identity/gsi/web/reference/js-reference#width), in pixels                                                                                                                                                                            |
|          | locale                             | `string`                                                      | If set, then the button [language](https://developers.google.com/identity/gsi/web/reference/js-reference#locale) is rendered                                                                                                                                                      |
|          | useOneTap                          | `boolean`                                                     | Activate One-tap sign-up or not                                                                                                                                                                                                                                                   |
|          | promptMomentNotification           | `(notification: PromptMomentNotification) => void`            | [PromptMomentNotification](https://developers.google.com/identity/gsi/web/reference/js-reference) methods and description                                                                                                                                                         |
|          | cancel_on_tap_outside              | `boolean`                                                     | Controls whether to cancel the prompt if the user clicks outside of the prompt                                                                                                                                                                                                    |
|          | auto_select                        | `boolean`                                                     | Enables automatic selection on Google One Tap                                                                                                                                                                                                                                     |
|          | ux_mode                            | `popup` \| `redirect`                                         | The Sign In With Google button UX flow                                                                                                                                                                                                                                            |
|          | login_uri                          | `string`                                                      | The URL of your login endpoint                                                                                                                                                                                                                                                    |
|          | native_login_uri                   | `string`                                                      | The URL of your password credential handler endpoint                                                                                                                                                                                                                              |
|          | native_callback                    | `(response: { id: string; password: string }) => void`        | The JavaScript password credential handler function name                                                                                                                                                                                                                          |
|          | prompt_parent_id                   | `string`                                                      | The DOM ID of the One Tap prompt container element                                                                                                                                                                                                                                |
|          | nonce                              | `string`                                                      | A random string for ID tokens                                                                                                                                                                                                                                                     |
|          | context                            | `signin` \| `signup` \| `use`                                 | The title and words in the One Tap prompt                                                                                                                                                                                                                                         |
|          | state_cookie_domain                | `string`                                                      | If you need to call One Tap in the parent domain and its subdomains, pass the parent domain to this attribute so that a single shared cookie is used                                                                                                                              |
|          | allowed_parent_origin              | `string` \| `string[]`                                        | The origins that are allowed to embed the intermediate iframe. One Tap will run in the intermediate iframe mode if this attribute presents                                                                                                                                        |
|          | intermediate_iframe_close_callback | `function`                                                    | Overrides the default intermediate iframe behavior when users manually close One Tap                                                                                                                                                                                              |
|          | itp_support                        | `boolean`                                                     | Enables upgraded One Tap UX on ITP browsers                                                                                                                                                                                                                                       |
|          | hosted_domain                      | `string`                                                      | If your application knows the Workspace domain the user belongs to, use this to provide a hint to Google. For more information, see the [hd](https://developers.google.com/identity/protocols/oauth2/openid-connect#authenticationuriparameters) field in the OpenID Connect docs |
|          | click_listener                     | `function`                                                    | If set, this [function](https://developers.google.com/identity/gsi/web/reference/js-reference#click_listener) will be called when the Sign in with Google button is clicked.                                                                                                      |

## How to develop?

-   `dev` - starts dev server
-   `build` - generates the following bundles: CommonJS (`.cjs`) ESM (`.mjs`) and IIFE (`.iife.js`). The name of bundle is automatically taked from `package.json` name property
-   `test` - starts jest and runs all tests
-   `test:coverage` - starts jest and run all tests with code coverage report
-   `lint:scripts` - lint `.ts` files with eslint
-   `prepare` - script for setting up husky pre-commit hook

**If you want to make changes:**

1. Fork repository
2. Install dependencies
3. Make changes in code and run `pnpm build && pnpm pack`. This command will generate `.tgz` file in root directory.
4. Now you can add `.tgz` file to your project and test changes. Run `pnpm add ~/path-to-tgz-file.tgz` to add package to your project.
5. Create Pull request with new changes.

> Commit with `pnpm commit`!

**Inspired by** [react-oauth](https://github.com/MomenSherif/react-oauth)
