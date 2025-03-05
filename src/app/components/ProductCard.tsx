// filepath: src/components/ProductCard.tsx
import Link from 'next/link';

interface Product {
  id: string;
  image: string;
  title: string;
  price: number;
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div>
      <Link href={`/products/${product.id}`}>
        <img src={product.image} alt={product.title} />
      </Link>
      <h2>{product.title}</h2>
      <p>{product.price}</p>
    </div>
  );
}