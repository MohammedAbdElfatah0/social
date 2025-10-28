import { z } from "zod";

class PostValidation {
  // ✅ 1. validate ObjectId
  paramId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

  // ✅ 2. validate user info from auth middleware
  authMiddleware = z.object({
    id: this.paramId,
  });

  // ✅ 3. create post (body)
 public createPostBody = z.object({
    userId: this.paramId,
    reaction: z.number().optional(),
  });

  // ✅ 4. reaction (params + body)
 public addReaction = {
    params: z.object({ id: this.paramId }),
    body: z.object({
      userId: this.paramId,
      reaction: z.number().optional(),
    }),
  };

  // ✅ 5. get specific post (params)
 public getSpecific = {
    params: z.object({ id: this.paramId }),
    query: z.object({
      userId: this.paramId.optional(),
    }),
  };        

  // ✅ 6. delete / update / freeze / etc.
 public modifyPost = {
    params: z.object({ id: this.paramId }),
    body: z.object({ userId: this.paramId }),
  };

public deletePost = {
    params: z.object({ id: this.paramId }),
    body: z.object({ userId: this.paramId }),
  };

public updatePost = {
    params: z.object({ id: this.paramId }),
    body: z.object({ userId: this.paramId }),
  };

public freezePost = {
    params: z.object({ id: this.paramId }),
    body: z.object({ userId: this.paramId }),
  };

public unfreezePost = {
    params: z.object({ id: this.paramId }),
    body: z.object({ userId: this.paramId }),
  };

public hardDeletePost = {
    params: z.object({ id: this.paramId }),
    body: z.object({ userId: this.paramId }),
  };

}

export default new PostValidation();
