import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../models/usuario.model';
import { BusquedasService } from '../../../services/busquedas.service';
import Swal from 'sweetalert2';
import { ModalImagenService } from '../../../services/modal-imagen.service';
import { delay } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: ``
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios: number = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];

  public imgSubs: Subscription | undefined
  public desde: number = 0;
  public cargando: boolean = true;

  constructor(private usuarioService: UsuarioService,
              private busquedasService: BusquedasService,
              private modalImagenService: ModalImagenService) {}

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }
  
  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(500)
    )
    .subscribe(img => {
      // console.log(img);
      this.cargarUsuarios()
    })
  }

  cargarUsuarios() {
    this.cargando = true;
    this.usuarioService.cargarUsuarios(this.desde)
    .subscribe( ({total, usuarios}) => {
      // console.log(resp);
      this.totalUsuarios = total;

      if(usuarios.length !== 0) {
        this.usuarios = usuarios;        
        this.usuariosTemp = usuarios;        
      }

      this.cargando = false;
    })
  }

  cambiarPagina(valor: number) {
    this.desde += valor;

    if(this.desde < 0) {
      this.desde = 0;
    } else  if(this.desde > this.totalUsuarios) {
      this.desde = this.totalUsuarios;
      // this.desde -= valor;
    }

    this.cargarUsuarios();
  }

  buscar(termino: string) {
    // console.log(termino);

    if(termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }

    this.busquedasService.buscar('usuarios', termino)
        .subscribe(resp => {
          // console.log(resp);
          this.usuarios = resp;
        })

        return true;
  }

  eliminarUsuario(usuario: Usuario) {

    if(usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo', 'error')
    }

    Swal.fire({
      title: "¿Borrar usuario?",
      text: `Está a punto de borrar a ${usuario.nombre}`,
      icon: "question",
      showCancelButton: true,
      // confirmButtonColor: "#3085d6",
      // cancelButtonColor: "#d33",
      confirmButtonText: "Sí, borrarlo"
    }).then((result) => {
      if (result.isConfirmed) {
        // Swal.fire({
        //   title: "Deleted!",
        //   text: "Your file has been deleted.",
        //   icon: "success"
        // });

        this.usuarioService.eliminarUsuario(usuario)
          .subscribe(resp =>  {
            Swal.fire({
              title: "Usuario borrado",
              text: `${usuario.nombre} fue eliminado correctamente`,
              icon: "success"
            })

            this.cargarUsuarios();
          });
      }
    });

    return true;
  }

  cambiarRole(usuario: Usuario) {
    // console.log(usuario);

    this.usuarioService.guardarUsuario(usuario)
      .subscribe(resp => {
        // console.log(resp);
        
      })
    
  }

  abrirModal(usuario: Usuario) {
    // console.log(usuario);
    this.modalImagenService.abrirModal('usuarios', usuario.uid, usuario.img)    
  }
}
