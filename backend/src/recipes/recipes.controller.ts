import { Controller, Get, Param } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { Recipe } from './recipes.schema';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @Get()
  async getAll(): Promise<Recipe[]> {
    return this.recipesService.findAll();
  }

  @Get(':id')
  async getById(@Param('id') id: string): Promise<Recipe | null> {
    return this.recipesService.findOne(id);
  }
}
