import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const userType = new GraphQLObjectType({
    name: "User",
    
    fields: {
        _id: { type: GraphQLID },
        fullName: { type: GraphQLString },
        email: { type: GraphQLString },
        phoneNumber: { type: GraphQLString },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})