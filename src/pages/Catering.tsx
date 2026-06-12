import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

type CateringPackage = {
  id: string;
  packageName: string;
  pricePerPlate: number;
  minPeople: number;
  description: string;
  itemsIncluded: string;
  imageUrl: string;
  available: boolean;
};

function Catering() {
  const [packages, setPackages] = useState<CateringPackage[]>([]);
  const [loading, setLoading] = useState(true);


  const WHATSAPP_NUMBER = "917995677884";

  const handleCateringContact = (pkg: CateringPackage) => {
    const message = `Hi Triambika Foods, I am interested in catering:

Package: ${pkg.packageName}
Price Per Plate: ₹${pkg.pricePerPlate}
Minimum People: ${pkg.minPeople}

Items Included:
${pkg.itemsIncluded}

Description:
${pkg.description}

Please share more details.`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const q = query(
          collection(db, "cateringPackages"),
          where("available", "==", true)
        );

        const querySnapshot = await getDocs(q);

        const data: CateringPackage[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<CateringPackage, "id">),
        }));

        setPackages(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <h2>Loading catering packages...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="hero catering-hero">
        <div className="container hero-content">
          <h1>Catering for every occasion</h1>
          <p>
            Choose catering packages for events, parties, office lunch,
            functions, and family gatherings.
          </p>
        </div>
      </section>

      <section className="container section">
        <div className="section-heading">
          <h2>Catering Packages</h2>
          <p>Bulk food options with per-plate pricing</p>
        </div>

        {packages.length === 0 ? (
          <p>No catering packages available right now.</p>
        ) : (
          <div className="food-grid">
            {packages.map((pkg) => (
              <div className="food-card" key={pkg.id}>
                <img
                  src={
                    pkg.imageUrl ||
                    "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=1200&auto=format&fit=crop"
                  }
                  alt={pkg.packageName}
                  className="food-image"
                />

                <div className="food-card-body">
                  <div className="food-top-row">
                    <h3>{pkg.packageName}</h3>
                    <span className="food-price">₹{pkg.pricePerPlate}</span>
                  </div>

                  <p className="food-category">Min {pkg.minPeople} people</p>

                  <p className="package-desc">{pkg.description}</p>

                  <div className="included-box">
                    <strong>Included:</strong>
                    <p>{pkg.itemsIncluded}</p>
                  </div>
                  <button className="primary-btn" onClick={() => handleCateringContact(pkg)}>
                    Contact for Catering
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

export default Catering;