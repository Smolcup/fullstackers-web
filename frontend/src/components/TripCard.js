function TripCard({ trip }) {
  return (
    <div className="card">
      <img src={trip.image} alt={trip.title} />
      <div className="card-body">
        <h3 className="card-title">{trip.title}</h3>
        <span className="muted">{trip.duration} • {trip.region}</span>
        <span className="muted">{trip.type} • ⭐ {trip.rating}</span>
        <span className="price">{trip.price} TND</span>
      </div>
    </div>
  );
}

export default TripCard;
