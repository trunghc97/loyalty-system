import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { username, password } = this.loginForm.value;

      this.apiService.login({ username, password })
      .then( (response: any) => {
        // Store auth token
          this.isLoading = false;
          const token = response.token || response.access_token;
          if (token) {
            localStorage.setItem('auth-storage', JSON.stringify({
              state: { user: { token } }
            }));
          }

          this.router.navigate(['/dashboard']);
      })
      .catch((err : any) => {
        this.errorMessage = err.error?.message || 'Đăng nhập thất bại';
        this.isLoading = false;
      })
      // .subscribe({
      //   next: (response: any) => {
      //     // Store auth token
      //     const token = response.token || response.access_token;
      //     if (token) {
      //       localStorage.setItem('auth-storage', JSON.stringify({
      //         state: { user: { token } }
      //       }));
      //     }

      //     this.router.navigate(['/dashboard']);
      //   },
      //   error: (error: any) => {
      //     this.errorMessage = error.error?.message || 'Đăng nhập thất bại';
      //     this.isLoading = false;
      //   },
      //   complete: () => {
      //     this.isLoading = false;
      //   }
      // });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return fieldName === 'username' ? 'Vui lòng nhập tên đăng nhập' : 'Vui lòng nhập mật khẩu';
      }
      if (control.errors['minlength']) {
        return 'Mật khẩu phải có ít nhất 6 ký tự';
      }
    }
    return '';
  }
}
