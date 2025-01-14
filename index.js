require('dotenv').config()
const { ApolloServer, gql } = require('apollo-server')
const { CosmosClient } = require('@azure/cosmos')

const client = new CosmosClient({
  endpoint: process.env.ENDPOINT,
  key: process.env.KEY
})

const container = client
  .database(process.env.DATABASE)
  .container(process.env.CONTAINER)



const typeDefs = gql`
  enum State {
    COMPLETE
    INCOMPLETE
    IN_PROGRESS
  }

  type Todo {
    id: ID!
    title: String
    state: State
    desc: String
  }

  type TodoStatus {
    status: Boolean
  }
  type Query {
    todos: [Todo]
    todo(id: ID!): Todo
  }
  type Mutation {
    createTodo(title: String!, state: State!, desc: String): Todo
    updateTodo(id: ID!, title: String!, state: State!, desc: String): Todo
    deleteTodo(id: ID!): Boolean
  }
`

const resolvers = {
  Query: {
    todos: async () => {
      const response = await container.items.query('SELECT * from c').fetchAll()
      return response.resources
    },
    todo: async (root, { id }) => {
      const response = await container.item(id, undefined).read()
      return response.resource
    }
  },
  
  Mutation: {
    createTodo: async (root, args) => {
      const response = await container.items.create(args)
      return response.resource
    },
    updateTodo: async(root, args) => {
      try {
        const response = await container.item(args.id).replace(args);
        return response.resource        
      } catch (error) {
        console.log('error: ', error)
        throw error;
      }

    },
    deleteTodo: async(root, {id}) => {
      const response = await container.item(id).delete()
    }
  }
}


const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url} 🚀`)
  console.log(`Visit ${url}graphiql to load the playground`)
})
