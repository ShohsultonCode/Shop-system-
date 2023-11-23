import { Schema } from 'mongoose';


const CategorySchema: Schema = new Schema(
  {
    category_name: {
      type: String,
      required: true,
    },
    category_image: {
      type: String,
      required: true,
    },
    category_status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default CategorySchema;
