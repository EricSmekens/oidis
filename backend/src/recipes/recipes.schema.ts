import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Recipe extends Document {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  amountOfPersons: number;

  @Prop()
  preparationDurationInMinutes: number;

  @Prop({ type: [{ count: Number, unit: String, name: String }] })
  products: { count: number; unit: string; name: string }[];

  @Prop([String])
  steps: string[];

  @Prop()
  picture: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
