import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { userType } from "../../user/graphql";
import { commentType } from "../../comment/graphql";

export const postType = new GraphQLObjectType({
    name: "Post",
    fields: {
        id: { type: GraphQLID },
        content: { type: GraphQLString },
        userId: { type: userType },
        createdAt: { type: GraphQLString ,resolve: (parent) => parent.createdAt.toISOString() },
        updatedAt: { type: GraphQLString ,resolve: (parent) => parent.updatedAt.toISOString() },
    }
})
export const postQueryTypeResponse = new GraphQLObjectType({
    name: "PostQuery",
    fields: {
        message: { type: GraphQLString },
        success: { type: GraphQLBoolean },
        post: { type: postType }
    }
});
export const postsQueryTypeResponse =
    new GraphQLObjectType({
        name: "PostssQuery",
        fields: {
            message: { type: GraphQLString },
            success: { type: GraphQLBoolean },
            post: { type: new GraphQLList(postType) }
        }
    });

