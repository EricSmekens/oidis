import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './products.schema';
import { fetchPriceFromAhUrl } from './ah.helper';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async updateAllPricesFromAh(): Promise<{ total: number; updated: number; skipped: number; failed: number }> {
    const products = await this.productModel.find().exec();
    let updated = 0;
    let skipped = 0;
    let failed = 0;

    for (const p of products) {
      const ahUrl = (p as any).ahUrl as string | undefined;
      if (!ahUrl) {
        skipped++;
        continue;
      }

      try {
        const price = await fetchPriceFromAhUrl(ahUrl);
        if (price === null) {
          failed++;
          this.logger.warn(`Could not parse price for product ${p._id} from ${ahUrl}`);
          continue;
        }

        // update packagePrice
        (p as any).packagePrice = price;
        (p as any).packagePriceUpdatedAt = new Date();
        await p.save();
        updated++;
      } catch (e) {
        failed++;
        this.logger.error(`Failed to update price for product ${p._id}: ${String(e)}`);
      }
    }

    return { total: products.length, updated, skipped, failed };
  }
}

export default ProductsService;
