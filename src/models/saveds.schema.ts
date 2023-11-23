import { Schema } from 'mongoose';



const SaveSchema: Schema = new Schema(
  {
    save_user: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    save_product: {
      type: Schema.Types.ObjectId,
      ref: 'Products',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default SaveSchema
