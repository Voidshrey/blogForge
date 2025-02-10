import { model, Schema } from "mongoose";

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [10, "title should have atleast 10 charecters"],
    },

    slug: {
      type: String,
      unique: true,
    },

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    categories: {
      type: String,
      enum: [
        "Technology",
        "Health & Fitness",
        "Lifestyle",
        "Travel",
        "Food & Drink",
        "Business & Finance",
        "Education",
        "Entertainment",
        "Fashion",
        "Sports",
        "Science",
        "Art & Culture",
        "Personal Development",
        "Parenting",
        "News & Politics",
        "Music",
        "Gaming",
        "Environment",
        "Self-Improvement",
        "Books & Literature",
        "Relationships",
        "History",
        "Photography",
        "Tech Reviews",
        "Productivity",
        "DIY (Do It Yourself)",
        "Social Media",
        "Mental Health",
        "Philosophy",
        "Pets",
      ],
      required : true
    },

    content: {
      type: String,
      required: true,
    },

    comments: {
      type: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    },

    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "User" }],
    },
    featuredImage: {
      type: String,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

blogSchema.pre("save", function (next) {
  this.slug = this.title
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing spaces
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, ""); // Remove non-alphanumeric characters except hyphens
  next();
});

export default model("Blog", blogSchema);
