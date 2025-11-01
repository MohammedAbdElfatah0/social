import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../../user/graphql";

export const commentType = new GraphQLObjectType({
    name: "Comment",
    fields: {
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        userId: { type: userType },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})