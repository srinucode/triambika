import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

type LiveItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
};

function Home() {
  const [items, setItems] = useState<LiveItem[]>([]);
  const [loading, setLoading] = useState(true);

  const WHATSAPP_NUMBER = "917995677884";

  const handleOrderNow = (item: LiveItem) => {
    const message = `Hi Triambika Foods, I want to order:

Item: ${item.name}
Category: ${item.category}
Price: ₹${item.price}

Please confirm availability.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    const fetchLiveItems = async () => {
      try {
        const q = query(
          collection(db, "liveItems"),
          where("available", "==", true)
        );

        const querySnapshot = await getDocs(q);

        const liveItems: LiveItem[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<LiveItem, "id">),
        }));

        setItems(liveItems);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveItems();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <h2>Loading live items...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="container hero-content">
          <h1>Delicious food, delivered fresh</h1>
          <p>
            Explore today&apos;s live menu and enjoy restaurant-style food at
            your doorstep.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <h2>Live Available Items</h2>
          <p>Fresh food available today</p>
        </div>

        {items.length === 0 ? (
          <p>No live items available right now.</p>
        ) : (
          <div className="food-grid">
            {items.map((item) => (
              <div className="food-card" key={item.id}>
                <img
                  src={
                    item.imageUrl ||
                    "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={item.name}
                  className="food-image"
                />

                <div className="food-card-body">
                  <div className="food-top-row">
                    <h3>{item.name}</h3>
                    <span className="food-price">₹{item.price}</span>
                  </div>

                  <p className="food-category">{item.category}</p>
                  <button className="primary-btn" onClick={() => handleOrderNow(item)}>
                    Order Now
                  </button>

                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Home;