const Usuario = require("../models/Usuario");
const Producto = require("../models/Productos");
const Cliente = require("../models/Cliente");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: "variables.env" });

const crearToken = (usuario, secreta, expiresIn) => {
  console.log("++++");
  console.log({ usuario });
  const { id, email, nombre, apellido } = usuario;
  return jwt.sign({ id, email, nombre, apellido }, secreta, { expiresIn });
};

//Resolvers.

const resolvers = {
  Query: {
    obtenerUsuario: async (_, { token }) => {
      const usuarioId = await jwt.verify(token, process.env.SECRETA);
      console.log("===========");
      console.log(usuarioId);
      console.log("===========");
      return usuarioId;
    },
    obtenerProductos: async () => {
      try {
        const productos = await Producto.find({});
        return productos;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerProducto: async (_, { id }) => {
      // revisar si el producto existe
      const producto = await Producto.findById(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      return producto;
    },
    obtenerClientes: async () => {
      try {
        const clientes = await Cliente.find({});
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerClientesVendedor: async (_, {}, ctx) => {
      try {
        console.log(ctx);
        const clientes = await Cliente.find({
          vendedor: ctx.usuario.id.toString(),
        });
        return clientes;
      } catch (error) {
        console.log(error);
      }
    },
    obtenerCliente: async (_, { id }, ctx) => {
      //Revisar si el cliente existe o no
      const cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error("Cliente no encontrado");
      }

      //Quien lo creo puede verlo
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales");
      }

      return cliente;
    },
  },
  Mutation: {
    // se aplica async await
    nuevoUsuario: async (_, { input }) => {
      // aplico destructuration
      const { email, password } = input;

      //Revisar si el usuario ya esta registrado
      const existeUsuario = await Usuario.findOne({ email }); // se busca el primero que pueda contener el email
      if (existeUsuario) {
        throw new Error("El usuario ya está registrado");
      }

      //Hassear su password
      const salt = await bcryptjs.genSalt(10);
      input.password = await bcryptjs.hash(password, salt); // se toma el password (el desctructurado) y lo hassea con el salt

      try {
        //Guardarlo en la base de Datos
        const usuario = new Usuario(input);
        usuario.save(); //guardarlo
        return usuario; // se retorna el type Usuario del Schema
      } catch (error) {
        console.log(error);
      }
    },
    autenticarUsuario: async (_, { input }) => {
      const { email, password } = input;
      // si el Usuario existe
      const existeUsuario = await Usuario.findOne({ email });
      if (!existeUsuario) {
        throw new Error("El usuario no existe");
      }

      //revisar is el  password es correcto
      const passwordCorrecto = await bcryptjs.compare(
        password,
        existeUsuario.password
      );
      if (!passwordCorrecto) {
        throw new Error("Password Incorrecto");
      }

      //crear el token
      return {
        // se pasan tres parametros(funcion,process.env,expiracion)
        token: crearToken(existeUsuario, process.env.SECRETA, "24h"),
      };
    },
    nuevoProducto: async (_, { input }) => {
      try {
        const producto = new Producto(input);

        // almacenar en bd
        const resultado = await producto.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarProducto: async (_, { id, input }) => {
      // revisar si el producto existe
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }

      //guardarlo en la db
      producto = await Producto.findByIdAndUpdate({ _id: id }, input, {
        new: true,
      });
      return producto;
    },
    eliminarProducto: async (_, { id }) => {
      // revisar si el producto existe
      let producto = await Producto.findById(id);

      if (!producto) {
        throw new Error("Producto no encontrado");
      }
      //Eliminar
      await Producto.findOneAndDelete({ _id: id });
      return "Producto Eliminado";
    },
    nuevoCliente: async (_, { input }, ctx) => {
      const { email } = input;
      //Verificar si el cliente ya esta registrado
      //console.log(input);

      const cliente = await Cliente.findOne({ email });

      if (cliente) {
        throw new Error("El cliente ya existe");
      }

      const nuevoCliente = new Cliente(input);
      //asignar el vendedor
      nuevoCliente.vendedor = ctx.usuario.id;
      //guardarlo en la db
      try {
        const resultado = await nuevoCliente.save();
        return resultado;
      } catch (error) {
        console.log(error);
      }
    },
    actualizarCliente: async (_, { id, input }, ctx) => {
      //Verificar si existe o no
      let cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error("El cliente no existe");
      }

      //Vericificar si el vendedor es quien edita
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales");
      }

      //Guardar el cliente
      cliente = await Cliente.findOneAndUpdate({ _id: id }, input, {
        new: true,
      });
      return cliente;
    },
    eliminarCliente: async (_, { id }, ctx) => {
      //Verificar si existe o no
      let cliente = await Cliente.findById(id);

      if (!cliente) {
        throw new Error("El cliente no existe");
      }

      //Verificar si el vendedor es quien edita
      if (cliente.vendedor.toString() !== ctx.usuario.id) {
        throw new Error("No tienes las credenciales");
      }

      //Elimar el cliente
      await Cliente.findOneAndDelete({ _id: id });
      return "Cliente Eliminado";
    },
  },
};

module.exports = resolvers;
