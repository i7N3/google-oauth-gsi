import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { GoogleOAuthProvider } from 'google-oauth-gsi';

@Component({
    standalone: true,
    selector: 'auth-component',
    templateUrl: './auth.component.html',
})
export class AuthComponent implements AfterViewInit {
    private provider: GoogleOAuthProvider;

    constructor(private elementRef: ElementRef) {
        this.provider = new GoogleOAuthProvider({
            clientId: 'YOUR_CLIENT_ID.apps.googleusercontent.com',
            onScriptLoadError: () => console.log('onScriptLoadError'),
            onScriptLoadSuccess: () => {
                console.log('onScriptLoadSuccess');
                this.renderSignInButton();
            },
        });
    }

    private renderSignInButton(): void {
        const renderButton = this.provider.useRenderButton({
            element: this.elementRef.nativeElement,
            onError: () => console.error('Failed to render button'),
            onSuccess: (res) =>
                console.log('Logged in with Google (render button)', res),
        });

        renderButton();
    }

    ngAfterViewInit(): void {}
}
