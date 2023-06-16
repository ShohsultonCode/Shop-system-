import { Schema } from 'mongoose';


const ProductSchema: Schema = new Schema(
  {
    product_name: {
      type: String,
      required: true,
    },
    product_description: {
      type: String,
      required: true,
    },
    product_image: {
      type: String,
      required: true,
    },
    product_count: {
      type: Number,
      required: true,
    },
    product_category: {
      type: Schema.Types.ObjectId,
      ref: 'Categories',
      required: true,
    },
    product_price: {
      type: Number,
      required: true,
    },
    product_status: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default ProductSchema;
