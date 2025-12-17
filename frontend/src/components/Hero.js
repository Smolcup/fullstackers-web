import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <img
        alt="Beautiful Tunisia landscape"
        src="https://carthagemagazine.com/wp-content/uploads/2020/12/Chebika-Tozeur-1170x690.jpg"
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
