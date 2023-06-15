import { Schema } from 'mongoose';



const LikeSchema: Schema = new Schema(
  {
    like_user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    like_product: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default LikeSchema;
