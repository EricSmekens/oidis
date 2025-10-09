import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Product extends Document {
  @Prop({ required: true })
  count: number;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  packageSize: number;

  @Prop({ required: true })
  packagePrice: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
