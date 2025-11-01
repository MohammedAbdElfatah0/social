import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { PostQuery } from "./modules";
console.log("grap")
const query = new GraphQLObjectType({
    name: "RootQuery",//main query
    fields: {
        ...PostQuery
    }
});
export const appSchema = new GraphQLSchema({
    query,
});