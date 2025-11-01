export function totalCostFor(recipe: any): number {
  const products = recipe?.products || [];
  return products.reduce((sum: number, item: any) => {
    const p = item.product || {};
    const packageSize = Number(p.packageSize) || 0;
    const packagePrize = Number(p.packagePrize) || 0;
    const count = Number(item.count) || 0;

    if (packageSize <= 0 || packagePrize <= 0) return sum;
    return sum + (count / packageSize) * packagePrize;
  }, 0);
}

export default totalCostFor;
