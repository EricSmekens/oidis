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

  // optional Albert Heijn URL for this product (e.g. https://www.ah.nl/producten/product/wi33693/..)
  @Prop()
  ahUrl?: string;

  // timestamp when package price was last updated
  @Prop()
  packagePriceUpdatedAt?: Date;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
