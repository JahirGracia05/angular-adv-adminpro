import { EventEmitter, Injectable } from '@angular/core';
import { environment } from '../../environments/environments';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {

  private _ocultarModal: boolean = true;
  public tipo: 'usuarios'|'medicos'|'hospitales' | any;
  public id: string = '';
  public img: string = '';

  public nuevaImagen : EventEmitter<string> = new EventEmitter<string>();

  get ocultarModal() {
    return this._ocultarModal;
  }

  constructor() { }

  abrirModal(
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string,
    img: string = 'no-img'
  ) {
    this._ocultarModal = false;
    this.tipo = tipo;
    this.id = id;

    // http://localhost:3000/api/upload/medicos/22774523-a815-42b4-b7c5-5ff8b166492b.png

    if(img.includes('https')) {
      this.img = img;
    } else {
      this.img = `${base_url}/upload/${tipo}/${img}`;
    }

    // console.log(this.img);
    
  }

  cerrarModal() {
    this._ocultarModal = true;
  }
}
