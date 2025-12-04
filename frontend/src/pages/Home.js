import Hero from '../components/Hero';
import TripCard from '../components/TripCard';
import ProductCard from '../components/ProductCard';
import { trips } from '../data/trips';
import { products } from '../data/products';

function Home() {
  const featuredTrips = trips.slice(0, 3);
  const featuredProducts = products.slice(0, 3);

  return (
    <div>
      <Hero />

      <h2 className="section-title">Featured Trips</h2>
      <div className="grid">
        {featuredTrips.map(t => (
          <TripCard key={t.id} trip={t} />
        ))}
      </div>

      <h2 className="section-title">Popular Marketplace Items</h2>
      <div className="grid">
        {featuredProducts.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Home;
