import z from "zod";
class UserValidation {
    paramasId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ID");

    updateInfoUser = {
        body: z.strictObject({
            fullName: z.string().min(3).max(50).optional(),
            phoneNumber: z.string().min(11).max(11).optional(),
            gender: z.enum(["male", "female"]).optional(),
        }).refine((data) => data.fullName || data.phoneNumber || data.gender, {
            message: "At least one field is required",
        })
    }

    resetPassword = {
        body: z.strictObject({
            oldPassword: z.string().min(6).max(50),
            newPassword: z.string().min(6).max(50),
            confirmPassword: z.string().min(6).max(50),
        }).refine((data) => data.newPassword === data.confirmPassword, {
            message: "Passwords do not match",
        }),
    }

    editEmail = {
        body: z.strictObject({
            email: z.email(),
        })
    };
    confirmEditEmail = {
        body: z.strictObject({
            otp: z.string().regex(/^[0-9]{5}$/),
        })
    };

    confirm2VerifyEmail = {
        body: z.strictObject({
            otp: z.string().regex(/^[0-9]{5}$/),
        })
    };
    sendTag = {
        body: z.strictObject({
            idSendTag: z.string(),
        })
    };
    addFriendRequest = {
        params: z.object({
            id: this.paramasId,
        }),
    };
    deleteFriendRequest = {
        params: z.object({
            id: this.paramasId,
        })
    };
    confirmAddFriend = {
        params: z.object({
            id: this.paramasId,
        })
    };
    removeFriend = {
        params: z.object({
            id: this.paramasId,
        })
    };
    blockFriend = {
        params: z.object({
            id: this.paramasId,
        })
    };
    unblockFriend = {
        params: z.object({
            id: this.paramasId,
        })

    };

}
export default new UserValidation();