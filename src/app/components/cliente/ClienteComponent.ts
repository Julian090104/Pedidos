// src/app/components/cliente/cliente.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from 'src/app/services/cliente.service';
import Swal from 'sweetalert2'
//import Swal from 'sweetalert2/dist/sweetalert2.js'
import 'sweetalert2/src/sweetalert2.scss'

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.css']
})
export class ClienteComponent implements OnInit {
  listaClientes: any[] = [];
  formClientes: FormGroup;
  accion = 'Agregar';
  idcliente: number | undefined;
  //swal = require('sweetalert2')

  constructor(private fb: FormBuilder, private _clienteService: ClienteService) {
    this.formClientes = this.fb.group({
      idcliente: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1)]],
      nombre: ['', [Validators.required, Validators.maxLength(16), Validators.minLength(1)]],
      direccion: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(1)]],
      telefono: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(10), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  }

  ngOnInit(): void {
    this.obtenerClientes();
    this.setActionState();
  }

  obtenerClientes() {
    this._clienteService.getListCliente().subscribe(data => {
      console.log("data->", data);
      this.listaClientes = data;
    }, error => {
      console.log("Error", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo obtener la lista de clientes. Inténtelo de nuevo más tarde.",
        
        icon: "error"
      });
    });
  }

  eliminarClientes(id: number) {
    Swal.fire({
      title: "Eliminar?",
      text: "¿Está seguro de eliminar?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar!",
      cancelButtonText: "No, cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this._clienteService.deleteCliente(id).subscribe(response => {
          console.log("Cliente Eliminado", response);
          this.listaClientes = this.listaClientes.filter(cliente => cliente.idCliente !== id);
          Swal.fire({
            title: "Eliminado!",
            text: "El cliente se eliminó correctamente.",
            icon: "success"
          });
          this.formClientes.reset(); // Limpiar formulario
          this.obtenerClientes(); // Refrescar la lista
        }, error => {
          console.log("Error al eliminar el cliente", error);
          Swal.fire({
            title: "Error",
            text: "No se pudo eliminar el cliente. Inténtelo de nuevo más tarde.",
            icon: "error"
          });
        });
      }
    });
  }
  

  editarClientes(client: any) {
    this.accion = 'Editar';
    this.idcliente = client.idcliente;

    this.formClientes.patchValue({
      idcliente: client.idcliente,
      nombre: client.nombre,
      direccion: client.direccion,
      telefono: client.telefono,
    });

    this.setActionState();
  }

  AddClientes() {
    const cliente: any = {
      idcliente: this.formClientes.get('idcliente')?.value,
      nombre: this.formClientes.get('nombre')?.value,
      direccion: this.formClientes.get('direccion')?.value,
      telefono: this.formClientes.get('telefono')?.value,
    }
  
    if (this.idcliente == undefined) {
      // Agregar cliente
      this._clienteService.saveCliente(cliente).subscribe(data => {
        console.log('Cliente agregado con éxito', data);
        Swal.fire({
          title: "Cliente Agregado",
          text: `El cliente ${cliente.nombre} ha sido agregado con éxito.\n\nID: ${cliente.idcliente}\nNombre: ${cliente.nombre}\nDirección: ${cliente.direccion}\nTeléfono: ${cliente.telefono}`,
          icon: "success"
        });
        this.formClientes.reset(); // Limpiar formulario
        this.obtenerClientes(); // Refrescar la lista
        this.idcliente = undefined;
        this.accion = 'Agregar';
        this.setActionState();
      }, error => {
        console.log("Error ->", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo agregar el cliente. Inténtelo de nuevo más tarde.",
          icon: "error"
        });
      });
    } else {
      // Editar cliente
      this._clienteService.updateCliente(this.idcliente, cliente).subscribe(data => {
        console.log('Cliente actualizado con éxito', data);
        Swal.fire({
          title: "Cliente editado",
          text: `El cliente ${cliente.nombre} ha sido editado con éxito.\n\nID: ${cliente.idcliente}\nNombre: ${cliente.nombre}\nDirección: ${cliente.direccion}\nTeléfono: ${cliente.telefono}`,
          icon: "success"
        });
        this.formClientes.reset();
        this.obtenerClientes();
        this.idcliente = undefined;
        this.accion = 'Agregar';
        this.setActionState();
      }, error => {
        console.log("Error ->", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo editar el cliente. Inténtelo de nuevo más tarde.",
          icon: "error"
        });
      });
    }
  }
  

  setActionState() {
    if (this.accion === 'Editar') {
      this.formClientes.get('idcliente')?.disable();
    } else {
      this.formClientes.get('idcliente')?.enable();
    }
  }
}
