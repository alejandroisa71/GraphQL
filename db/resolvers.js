const Usuario = require("../models/Usuario");
const bcryptjs = require("bcryptjs");
//Resolvers.

const resolvers = {
  Query: {
    obtenerCurso: () => "Algo",
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
  },
};

module.exports = resolvers;
