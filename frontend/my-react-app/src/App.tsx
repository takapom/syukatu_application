// src/App.tsx
import { useEffect, useState } from "react";
import "./App.css";
import { LoginForm } from "./components/LoginForm";
import Logout from "./components/Logout";
import Header from "./components/Header"

type Product = {
  id: number;
  company: string;
  occupation: string;
};


export default function App() {
  //ログインされているかされていないか確認
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
  if (token) {
    setLoggedIn(true);
  }
  },[])


  useEffect(() => {
    if (!loggedIn) return; 
       //ログインされてなかったら弾く
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
    <>
      <Header />
    <div className="container">
      <Logout auth={() => {
        localStorage.removeItem("token");
        setLoggedIn(false);
      }}/>
      <h1 className="title">🏢 インターンシップ先</h1>
      <div className="card-container">
        {products.map((product) => (
          <div key={product.id} className="card">
            <h2 className="product-name">{product.company}</h2>
            <p className="product-price">
              {product.occupation}
            </p>
            <button className="button">詳細</button>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
