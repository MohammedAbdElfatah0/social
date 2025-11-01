import { GraphQLBoolean, GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../../user/graphql";

export const postType = new GraphQLObjectType({
    name: "Post",
    fields: {
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        userId: { type: userType },
        createdAt: { type: GraphQLString },
        updatedAt: { type: GraphQLString }
    }
})
export const postQueryTypeResponse = new GraphQLObjectType({
    name: "PostQuery",
    fields: {
        message: { type: GraphQLString },
        success: { type: GraphQLBoolean },
        post: { type: postType }
    }
})