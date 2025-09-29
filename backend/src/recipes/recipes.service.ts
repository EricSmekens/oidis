import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Recipe } from './recipes.schema';

@Injectable()
export class RecipesService {
  constructor(@InjectModel(Recipe.name) private recipeModel: Model<Recipe>) {}

  async findAll(): Promise<Recipe[]> {
    return this.recipeModel.find().populate('products.product').exec();
  }

  async findOne(id: string): Promise<Recipe | null> {
    return this.recipeModel.findById(id).populate('products.product').exec();
  }
}
