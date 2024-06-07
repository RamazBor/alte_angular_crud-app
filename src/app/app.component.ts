import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { CreateEditUserComponent } from "./components/create-edit-user/create-edit-user.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [CommonModule, RouterOutlet, CreateEditUserComponent]
})
export class AppComponent {
  title = 'crud-app';
}
