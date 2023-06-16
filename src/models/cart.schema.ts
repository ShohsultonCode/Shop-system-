import { Schema } from 'mongoose';



const CartSchema: Schema = new Schema(
    {
        cart_user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        cart_product: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
        },
        cart_product_count: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
    }
);

export default CartSchema
