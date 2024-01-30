import { Component } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: ``
})
export class ModalImagenComponent {

  public imagenSubir: File | any;
  public imgTemp: any = '';

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) {}

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
  }

  cambiarImagen(file: File) {
    // console.log(file);
    this.imagenSubir = file;

    // Actualizamos la vista previa de la imagen
    if(!file) { 
      return this.imgTemp = null;
    }

    const reader = new FileReader();
    const url64 = reader.readAsDataURL(file); // convertimos a base64

    reader.onloadend = () => {
      this.imgTemp = reader.result;
      // console.log(reader.result);
    }

    return true;
  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
    .then(img => {
      Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');

      this.modalImagenService.nuevaImagen.emit(img);
      
      this.cerrarModal();
    }).catch(err => {
      Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      console.log(err);
      
    })
  }
}
