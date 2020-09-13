const { gql } = require("apollo-server");

//Schema.
const typeDefs = gql`
  type Usuario {
    id: ID
    nombre: String
    apellido: String
    email: String
    creado: String
  }
  input usuarioInput {
    nombre: String!
    apellido: String!
    email: String!
    password: String!
  }

  type Query {
    obtenerCurso: String
  }
  type Mutation {
    nuevoUsuario(input: usuarioInput): Usuario
  }
`;
module.exports = typeDefs;
