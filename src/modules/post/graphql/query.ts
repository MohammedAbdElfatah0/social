import { GraphQLID } from "graphql";
import { getAllPost, getSpecificPost } from "./post-service.graphql";
import { postQueryTypeResponse, postsQueryTypeResponse } from "./post-typegraphql";
export const PostQuery = {
    // getPost
    getPost: {
        //type response
        type: postQueryTypeResponse,
        args: {
            id: { type: GraphQLID }
        },
        resolve: getSpecificPost
    },
    getAllPost: {
        type:postsQueryTypeResponse,
        resolve: getAllPost
    }
};
