const Usuario = require("../models/Usuario");
const Producto = require("../models/Productos");
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
      const usuarioId = await jwt.verify(token, process.env.secreta);
      return usuarioId;
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
  },
};

module.exports = resolvers;
