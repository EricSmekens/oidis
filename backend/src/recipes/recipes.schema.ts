import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Types } from 'mongoose';

@Schema()
export class RecipeProduct {
  @Prop({ type: Types.ObjectId, required: true, ref: 'Product' })
  product: Types.ObjectId;

  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  unit: string;
}

export const RecipeProductSchema = SchemaFactory.createForClass(RecipeProduct);

@Schema()
export class Recipe extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  amountOfPersons: number;

  @Prop({ required: true })
  preparationDurationInMinutes: number;

  @Prop({ type: [RecipeProductSchema], default: [], required: true })
  products: RecipeProduct[];

  @Prop({ type: [String], default: [], required: true })
  steps: string[];

  @Prop()
  picture: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
