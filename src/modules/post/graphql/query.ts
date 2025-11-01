import { GraphQLID } from "graphql";
import { getSpecificPost } from "./post-service.graphql";
import { postQueryTypeResponse } from "./post-typegraphql";
console.log("QQQQQQ")
export const PostQuery = {
    // getPost
    getPost: {
        //type response
        type: postQueryTypeResponse,
        args: {
            id: { type: GraphQLID }
        },
        resolve: getSpecificPost
    }
};
