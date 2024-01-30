import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { RegisterForm } from '../interfaces/register-form.interface';
import { environment } from '../../environments/environments';
import { LoginForm } from '../interfaces/login-form.interface';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public usuario: Usuario | undefined;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) 
  {
    this.googleInit();
  }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string {
    return this.usuario?.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: "653431202545-nvqtlj0eg1godtta3n188taos9sr5qm5.apps.googleusercontent.com",
    });
  }

  logout() {
    localStorage.removeItem('token');
    
    google.accounts.id.revoke('jahirgracia05@gmail.com', () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      })
    })
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map((resp: any) => {
        // console.log(resp);
        const {  email, google, nombre, role, img = '', uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);
        // this.usuario = resp.usuario;
        // this.usuario?.imprimirUsuario();
        localStorage.setItem('token', resp.token)

        return true;
      }),
      catchError(error => of(false))
    );
  }

  crearUsuario(formData: RegisterForm) {
    return this.http.post(`${base_url}/usuarios`, formData)
                .pipe(
                  tap((resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                )
  }

  actualizarPerfil(data: {email: string, nombre: string, role: string | undefined}) {

    data = {
      ...data,
      role: this.usuario?.role
    }

    return this.http.put(`${base_url}/usuarios/${this.uid}`, data, this.headers)
  }

  login(formData: LoginForm) {
    return this.http.post(`${base_url}/login`, formData)
                .pipe(
                  tap((resp: any) => {
                    localStorage.setItem('token', resp.token)
                  })
                )
  }

  loginGoogle(token: string) {
    return this.http.post(`${base_url}/login/google`, { token })
      .pipe(
        tap((resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      )
  }

  cargarUsuarios(desde: number = 0) {
    // http://localhost:3000/api/usuarios?desde=5

    const url = `${base_url}/usuarios?desde=${desde}`;
    return this.http.get<CargarUsuario>(url, this.headers)
            .pipe(
              // delay(5000),
              map(resp => {
                // console.log(resp);
                const usuarios = resp.usuarios.map(
                  user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                );
                
                return {
                  total: resp.total,
                  usuarios
                };
              })
            )
  }

  eliminarUsuario(usuario: Usuario) {
    // console.log('eliminando');

    // http://localhost:3000/api/usuarios/65b018f4370a2a19f2d94d7b

    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario(usuario: Usuario) {

    // data = {
    //   ...data,
    //   role: this.usuario?.role
    // }

    return this.http.put(`${base_url}/usuarios/${usuario.uid}`, usuario, this.headers)
  }
}
