import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: ``
})
export class SidebarComponent {

  public usuario: Usuario | undefined;

  menuItems: any[];

  constructor(private sidebarService: SidebarService,
              private usuarioService: UsuarioService) {
    this.menuItems = sidebarService.menu;

    // this.imgUrl = usuarioService.usuario?.imagenUrl;
    // this.nombreUsuario = usuarioService.usuario?.nombre;

    this.usuario = usuarioService.usuario;

    // console.log(this.menuItems);
    
  }

}
