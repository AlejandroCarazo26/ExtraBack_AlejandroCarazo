import { connectToMongo } from "./db/mongo"
import { typeDefs } from "./graphql/schema"
import { resolvers } from "./graphql/resolvers"
import { ApolloServer } from "apollo-server"
import { getUserFromToken } from "./auth"


const start = async () => {
    await connectToMongo();

    const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async ({ req }) => {
            const token = req.headers.authorization || "";
            const user = token ? await getUserFromToken(token) : null;
            return { user };
        }
    });

    await server.listen({ port: 4000});
    console.log("Graphql funcionando olé y olé!")
}

start().catch((err) => {
    console.error("Apollo server error: ", err)
})