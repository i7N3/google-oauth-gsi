import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthComponent } from './core/auth/auth.components';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, AuthComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
    title = 'angular';
}
