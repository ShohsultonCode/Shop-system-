import { Schema } from 'mongoose';



const SellSchema: Schema = new Schema(
    {
        sell_user: {
            type: Schema.Types.ObjectId,
            ref: 'Users',
            required: true,
        },
        sell_product: {
            type: Schema.Types.ObjectId,
            ref: 'Products',
            required: true,
        },

        sell_price: {
            type: Number,
            required: true,
        },

        sell_product_count: {
            type: Number,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export default SellSchema
