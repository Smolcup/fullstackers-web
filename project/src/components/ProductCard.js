function ProductCard({ product }) {
  return (
    <div className="card">
      <img src={product.image} alt={product.name} />
      <div className="card-body">
        <h3 className="card-title">{product.name}</h3>
        <span className="muted">{product.category}</span>
        <span className="price">{product.price} TND</span>
      </div>
    </div>
  );
}

export default ProductCard;
