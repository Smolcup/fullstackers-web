import { useState } from 'react';
import { trips } from '../data/trips';
import TripCard from '../components/TripCard';

function Destinations() {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('All');
  const [type, setType] = useState('All');

  const regions = ['All', 'North', 'South', 'Coast'];
  const types = ['All', 'Adventure', 'Culture', 'Relaxation'];

  const filtered = trips.filter(t => {
    const matchText = t.title.toLowerCase().includes(search.toLowerCase());
    const matchRegion = region === 'All' || t.region === region;
    const matchType = type === 'All' || t.type === type;
    return matchText && matchRegion && matchType;
  });

  return (
    <div>
      <h1 className="section-title">Destinations & Trips</h1>

      <div className="filters">
        <input
          placeholder="Search trips..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={region} onChange={(e) => setRegion(e.target.value)}>
          {regions.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="grid">
        {filtered.map(t => (
          <TripCard key={t.id} trip={t} />
        ))}
      </div>
    </div>
  );
}

export default Destinations;
