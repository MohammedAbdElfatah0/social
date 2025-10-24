import { Schema } from "mongoose";
import { IUser, SYS_ROLE, GENDER, USER_AGENT, sendEmail, decryptData, statusFriend } from "../../../utils";


export const userSchema = new Schema<IUser>({
    fristName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 20,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: function () {
            if (this.userAgent === USER_AGENT.google) {
                return false;
            }
            return true;
        }
    },

    phoneNumber: {
        type: String
    },

    gender: {
        type: Number,
        enum: GENDER,
        default: GENDER.male
    },
    friends: {
        type: [Schema.Types.ObjectId],
        ref: "User",
    },
    //*blocks
    blocks: {
        type: [Schema.Types.ObjectId],
        ref: "User",
    },
    //*sent requests
    sentRequests: {
        type: [Schema.Types.ObjectId],
        ref: "RequestFriend",
        default: statusFriend.pending
    },
    //*received requests
    receivedRequests: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: statusFriend.pending
    },
    //*auth
    credentialUpdataAt: {
        type: Date,
    },
    role: {
        type: Number,
        enum: SYS_ROLE,
        default: SYS_ROLE.user
    },
    userAgent: {
        type: Number,
        enum: USER_AGENT,
        default: USER_AGENT.local
    },
    otp: {
        type: String
    },
    otpExpiryAt: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    pendingEmail: {
        type: String,
        default: null
    },
    is2Verified: {
        type: Boolean,
        default: false
    },
    sentTags: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    },
    receivedTags: {
        type: [Schema.Types.ObjectId],
        ref: "User",
        default: []
    }
},
    {
        timestamps: true,
        toJSON: {
            virtuals: true
        },
        toObject: {
            virtuals: true
        }
    }
);

userSchema.virtual("fullName")
    .get(function () {
        return `${this.fristName} ${this.lastName}`;
    })
    .set(function (fullName: String) {
        this.fristName = fullName.split(" ")[0] as string;
        this.lastName = fullName.split(" ")[1] as string;
    });

userSchema.pre("save", async function (next) {
    if (this.isVerified) {
        return next();
    }
    if (this.isNew && this.userAgent !== USER_AGENT.google) {
        console.log(this);
        await sendEmail({
            to: this.email,
            subject: "Confirm your email",
            html: `
                            <h2>Confirm Your Account</h2>
                            <p>Hello,</p>
                            <p>Thanks for signing up! Please use the code below to confirm your email:</p>
                            <h3 style="color:blue;">${decryptData(this.otp!)}</h3>
                            <p>If you didn’t request this, ignore this email.</p>
                            `,

        });
        next();
    }

});