import { Controller, Post } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('update-ah-prices')
  async updateAhPrices() {
    const result = await this.productsService.updateAllPricesFromAh();
    return { ok: true, result };
  }
}

export default ProductsController;
