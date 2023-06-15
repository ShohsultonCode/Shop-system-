import { Schema } from 'mongoose';


const BenefitSchema: Schema = new Schema({
  benefit: {
    type: Number,
    required: true,
  },
});

export default BenefitSchema
