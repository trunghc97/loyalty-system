import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

// Import atoms components
import {
  ButtonComponent,
  InputComponent
} from '../../components/atoms';

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    // Atoms components
    ButtonComponent,
    InputComponent
  ]
})
export class LoginModule { }
