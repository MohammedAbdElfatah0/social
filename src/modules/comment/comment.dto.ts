export interface CreateOrEditCommentDTO {
    content: string,
    attachment: any,//TODO
}
export interface ReactionDTO{
    id:string,
    userId:string,
    reaction:number | undefined,
}