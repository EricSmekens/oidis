import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Product, ProductSchema } from 'src/products/products.schema';

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

  @Prop({ type: [ProductSchema], default: [] })
  products: Product[];

  @Prop([String])
  steps: string[];

  @Prop()
  picture: string;
}

export const RecipeSchema = SchemaFactory.createForClass(Recipe);
