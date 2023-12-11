import { Schema, model } from 'mongoose';

const demoSchema = new Schema({
  clientId: { type: String },
  isDeleted: Boolean,
  createdAt: { type: Date, required: true },
  updatedAt: Date
});

const DemoModel = model('demo', demoSchema);

export default DemoModel;
