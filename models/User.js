import mongoose from "mongoose";

const emailPattern = /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/;

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 20,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 50,
      match: emailPattern,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    avatar: {
      type: String,
    },
    friendRequest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    isOnline: {
      type: Boolean,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    conversations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
      },
    ],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

userSchema.virtual("friendRequestsSent", {
  ref: "FriendRequest",
  localField: "_id",
  foreignField: "requesterId",
  match: { status: "pending" },
});

userSchema.virtual("friendRequestsReceived", {
  ref: "FriendRequest",
  localField: "_id",
  foreignField: "recipientId",
  match: { status: "pending" },
});

userSchema.virtual("detailedFriends", {
  ref: "User",
  localField: "friends",
  foreignField: "_id",
});

const User = mongoose.model("User", userSchema);

export default User;
