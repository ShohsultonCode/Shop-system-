import { Schema } from 'mongoose';

const UserCategoriesSchema: Schema = new Schema(
    {
        category: {
            type: Schema.Types.ObjectId,
            ref: 'Categories',
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

export default UserCategoriesSchema;
