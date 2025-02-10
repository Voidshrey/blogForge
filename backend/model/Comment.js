import { Model, Schema } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: "String",
      required: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    blog: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
  },
  {
    timestamps: true,
  }
);
