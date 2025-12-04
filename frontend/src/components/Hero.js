import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <img
        alt="Beautiful Tunisia landscape"
        src="https://images.unsplash.com/photo-1563049266-8b3b2d01aa45?q=80&w=1600&auto=format&fit=crop"
      />
      <div className="hero-content">
        <h1 className="hero-title">Discover Tunisia</h1>
        <p className="hero-sub">Beaches, deserts, culture — plan your perfect trip.</p>
        <div className="btns">
          <Link className="btn" to="/destinations">View Trips</Link>
          <Link className="btn secondary" to="/marketplace">Explore Marketplace</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;
