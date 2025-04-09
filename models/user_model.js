import { Schema, model } from "mongoose";
import normalize from "normalize-mongoose";

const userSchema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password : {type: String, required: true, select: false},
    mailCode: {type: String},
    mailCodeExpires: {type: Number},
    verified: {type: Boolean, default: false}
}, {
    timestamps: true
})

 userSchema.set("toJSON", {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
    },
});
userSchema.plugin(normalize);
export const UserModel = model("User", userSchema)