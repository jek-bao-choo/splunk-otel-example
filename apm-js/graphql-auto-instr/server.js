import { ApolloServer, gql } from 'apollo-server';

// Defining a type is like defining a class
// MyQuery is like the class name
// greeting is like the field/attribute name
const typeDefs = gql`
    schema {
        query: JekExampleQuery
    }

    type JekExampleQuery {
        jekGreeting: String
    }
`
// Resolvers indicate how the server returns a value
// Resolvers need to match the type MyQuery
const resolvers = {
    JekExampleQuery: {
        jekGreeting: () => "Hello Jek",
    }
}

const server = new ApolloServer({ typeDefs, resolvers})
const myPort = 9000;
const { url } = await server.listen({ port: myPort })
console.log(`Graphql Apollo Server running on ${myPort}`)