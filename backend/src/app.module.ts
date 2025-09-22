import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RecipesModule } from './recipes/recipes.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(`mongodb+srv://ericsmekens:${process.env.MONGODB_PASSWORD}@atlascluster.knj2z.mongodb.net/oidis`),
    RecipesModule,
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
