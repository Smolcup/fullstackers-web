import { products } from '../data/products';
import ProductCard from '../components/ProductCard';

function Marketplace() {
  return (
    <div>
      <h1 className="section-title">Marketplace</h1>
      <div className="grid">
        {products.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Marketplace;
