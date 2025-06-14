// src/App.tsx
import { useEffect, useState } from "react";
import "./App.css";
import { LoginForm } from "./components/LoginForm";

type Product = {
  id: number;
  name: string;
  price: number;
};


export default function App() {
  //ログインされているかされていないか確認
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);


  useEffect(() => {
    if (!loggedIn) return;    //ログインされてなかったら弾く
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:8080/products");
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err) {
        console.error("データの取得に失敗しました！", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [loggedIn]);


  if (!loggedIn) {
    return <LoginForm onLoginSuccess={() => setLoggedIn(true)} />;
  }


  if (loading)
    return (
      <div className="container">
        <p className="loading">🔄 読み込み中です...</p>
      </div>
    );

  return (
    <div className="container">
      <h1 className="title">🛒 商品一覧</h1>
      <div className="card-container">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">
              ¥{product.price.toLocaleString()}
            </p>
            <button className="button">カートに追加</button>
          </div>
        ))}
      </div>
    </div>
  );
}
