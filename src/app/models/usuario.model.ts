import { environment } from "../../environments/environments"

const base_url = environment.base_url;

export class Usuario {

    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: string,
        public uid?: string | any,
    ) {}

    get imagenUrl() {
        // /upload/usuarios/no-image        

        if(!this.img) {
            return `${base_url}/upload/usuarios/no-image`;
        } else if (this.img) {
            if(this.img.includes('https://')) {
                return this.img;
            } else {
                return `${base_url}/upload/usuarios/${this.img}`;
            }
        } else {
            return `${base_url}/upload/usuarios/no-image`;
        }
    }

    get getNombre() {
        return this.nombre;
    }
}