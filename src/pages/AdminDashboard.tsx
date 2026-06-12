import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/firebaseConfig";

type LiveItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  available: boolean;
};

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

function AdminDashboard() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<"live" | "catering">("live");

  const [liveItems, setLiveItems] = useState<LiveItem[]>([]);
  const [cateringPackages, setCateringPackages] = useState<CateringPackage[]>([]);

  const [editingLiveId, setEditingLiveId] = useState<string | null>(null);
  const [editingPackageId, setEditingPackageId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState(true);

  const [packageName, setPackageName] = useState("");
  const [pricePerPlate, setPricePerPlate] = useState("");
  const [minPeople, setMinPeople] = useState("");
  const [description, setDescription] = useState("");
  const [itemsIncluded, setItemsIncluded] = useState("");
  const [packageImageUrl, setPackageImageUrl] = useState("");
  const [packageAvailable, setPackageAvailable] = useState(true);

  const fetchLiveItems = async () => {
    const snapshot = await getDocs(collection(db, "liveItems"));

    const data: LiveItem[] = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<LiveItem, "id">),
    }));

    setLiveItems(data);
  };

  const fetchCateringPackages = async () => {
    const snapshot = await getDocs(collection(db, "cateringPackages"));

    const data: CateringPackage[] = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<CateringPackage, "id">),
    }));

    setCateringPackages(data);
  };

  useEffect(() => {
    fetchLiveItems();
    fetchCateringPackages();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login");
  };

  const resetLiveForm = () => {
    setEditingLiveId(null);
    setName("");
    setPrice("");
    setCategory("");
    setImageUrl("");
    setAvailable(true);
  };

  const resetPackageForm = () => {
    setEditingPackageId(null);
    setPackageName("");
    setPricePerPlate("");
    setMinPeople("");
    setDescription("");
    setItemsIncluded("");
    setPackageImageUrl("");
    setPackageAvailable(true);
  };

  const handleAddOrUpdateLiveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !price || !category) {
      alert("Please fill item name, price and category");
      return;
    }

    try {
      const payload = {
        name,
        price: Number(price),
        category,
        imageUrl,
        available,
        updatedAt: new Date(),
      };

      if (editingLiveId) {
        await updateDoc(doc(db, "liveItems", editingLiveId), payload);
        alert("Live item updated successfully");
      } else {
        await addDoc(collection(db, "liveItems"), {
          ...payload,
          createdAt: new Date(),
        });
        alert("Live item added successfully");
      }

      resetLiveForm();
      fetchLiveItems();
    } catch (error) {
      console.log(error);
      alert("Failed to save live item");
    }
  };

  const handleEditLiveItem = (item: LiveItem) => {
    setEditingLiveId(item.id);
    setName(item.name);
    setPrice(String(item.price));
    setCategory(item.category);
    setImageUrl(item.imageUrl || "");
    setAvailable(item.available);
    setActiveTab("live");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteLiveItem = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this live item?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "liveItems", id));
      fetchLiveItems();
    } catch (error) {
      console.log(error);
      alert("Failed to delete live item");
    }
  };

  const toggleLiveAvailability = async (item: LiveItem) => {
    try {
      await updateDoc(doc(db, "liveItems", item.id), {
        available: !item.available,
        updatedAt: new Date(),
      });

      fetchLiveItems();
    } catch (error) {
      console.log(error);
      alert("Failed to update availability");
    }
  };

  const handleAddOrUpdateCateringPackage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!packageName || !pricePerPlate || !minPeople || !itemsIncluded) {
      alert("Please fill package name, price, minimum people and items included");
      return;
    }

    try {
      const payload = {
        packageName,
        pricePerPlate: Number(pricePerPlate),
        minPeople: Number(minPeople),
        description,
        itemsIncluded,
        imageUrl: packageImageUrl,
        available: packageAvailable,
        updatedAt: new Date(),
      };

      if (editingPackageId) {
        await updateDoc(doc(db, "cateringPackages", editingPackageId), payload);
        alert("Catering package updated successfully");
      } else {
        await addDoc(collection(db, "cateringPackages"), {
          ...payload,
          createdAt: new Date(),
        });
        alert("Catering package added successfully");
      }

      resetPackageForm();
      fetchCateringPackages();
    } catch (error) {
      console.log(error);
      alert("Failed to save catering package");
    }
  };

  const handleEditPackage = (pkg: CateringPackage) => {
    setEditingPackageId(pkg.id);
    setPackageName(pkg.packageName);
    setPricePerPlate(String(pkg.pricePerPlate));
    setMinPeople(String(pkg.minPeople));
    setDescription(pkg.description || "");
    setItemsIncluded(pkg.itemsIncluded || "");
    setPackageImageUrl(pkg.imageUrl || "");
    setPackageAvailable(pkg.available);
    setActiveTab("catering");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeletePackage = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this catering package?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "cateringPackages", id));
      fetchCateringPackages();
    } catch (error) {
      console.log(error);
      alert("Failed to delete catering package");
    }
  };

  const togglePackageAvailability = async (pkg: CateringPackage) => {
    try {
      await updateDoc(doc(db, "cateringPackages", pkg.id), {
        available: !pkg.available,
        updatedAt: new Date(),
      });

      fetchCateringPackages();
    } catch (error) {
      console.log(error);
      alert("Failed to update availability");
    }
  };

  return (
    <div className="page admin-page">
      <section className="container admin-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Add and manage live items and catering packages</p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </section>

      <section className="container admin-panel">
        <div className="tab-row">
          <button
            className={activeTab === "live" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("live")}
          >
            Live Items
          </button>

          <button
            className={activeTab === "catering" ? "tab active-tab" : "tab"}
            onClick={() => setActiveTab("catering")}
          >
            Catering Packages
          </button>
        </div>

        {activeTab === "live" && (
          <>
            <div className="form-card">
              <h2>{editingLiveId ? "Edit Live Item" : "Add Live Item"}</h2>
              <p className="form-subtitle">
                These items will appear on the customer home page.
              </p>

              <form onSubmit={handleAddOrUpdateLiveItem} className="admin-form">
                <div className="form-grid">
                  <div>
                    <label>Item Name</label>
                    <input
                      type="text"
                      placeholder="Example: Chicken Biryani"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Price</label>
                    <input
                      type="number"
                      placeholder="Example: 250"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Category</label>
                    <input
                      type="text"
                      placeholder="Example: Non Veg"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Status</label>
                    <select
                      value={available ? "true" : "false"}
                      onChange={(e) => setAvailable(e.target.value === "true")}
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Image URL</label>
                  <input
                    type="text"
                    placeholder="Paste food image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                  />
                </div>

                <button type="submit" className="primary-btn">
                  {editingLiveId ? "Update Live Item" : "Add Live Item"}
                </button>

                {editingLiveId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetLiveForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="manage-section">
              <h2>Existing Live Items</h2>

              {liveItems.length === 0 ? (
                <p>No live items added yet.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {liveItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td>{item.category}</td>
                          <td>₹{item.price}</td>
                          <td>
                            <span
                              className={
                                item.available
                                  ? "status-badge available-badge"
                                  : "status-badge unavailable-badge"
                              }
                            >
                              {item.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td>
                            <div className="action-row">
                              <button
                                className="small-btn edit-btn"
                                onClick={() => handleEditLiveItem(item)}
                              >
                                Edit
                              </button>

                              <button
                                className="small-btn status-btn"
                                onClick={() => toggleLiveAvailability(item)}
                              >
                                {item.available ? "Disable" : "Enable"}
                              </button>

                              <button
                                className="small-btn delete-btn"
                                onClick={() => handleDeleteLiveItem(item.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "catering" && (
          <>
            <div className="form-card">
              <h2>
                {editingPackageId
                  ? "Edit Catering Package"
                  : "Add Catering Package"}
              </h2>
              <p className="form-subtitle">
                These packages will appear on the catering page.
              </p>

              <form
                onSubmit={handleAddOrUpdateCateringPackage}
                className="admin-form"
              >
                <div className="form-grid">
                  <div>
                    <label>Package Name</label>
                    <input
                      type="text"
                      placeholder="Example: Veg Premium Package"
                      value={packageName}
                      onChange={(e) => setPackageName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Price Per Plate</label>
                    <input
                      type="number"
                      placeholder="Example: 250"
                      value={pricePerPlate}
                      onChange={(e) => setPricePerPlate(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Minimum People</label>
                    <input
                      type="number"
                      placeholder="Example: 50"
                      value={minPeople}
                      onChange={(e) => setMinPeople(e.target.value)}
                    />
                  </div>

                  <div>
                    <label>Status</label>
                    <select
                      value={packageAvailable ? "true" : "false"}
                      onChange={(e) =>
                        setPackageAvailable(e.target.value === "true")
                      }
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label>Description</label>
                  <textarea
                    placeholder="Example: Best for weddings, office lunch and family functions"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label>Items Included</label>
                  <textarea
                    placeholder="Example: Rice, Dal, Paneer Curry, Sweet, Curd"
                    value={itemsIncluded}
                    onChange={(e) => setItemsIncluded(e.target.value)}
                    rows={3}
                  />
                </div>

                <div>
                  <label>Image URL</label>
                  <input
                    type="text"
                    placeholder="Paste catering image URL"
                    value={packageImageUrl}
                    onChange={(e) => setPackageImageUrl(e.target.value)}
                  />
                </div>

                <button type="submit" className="primary-btn">
                  {editingPackageId
                    ? "Update Catering Package"
                    : "Add Catering Package"}
                </button>

                {editingPackageId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={resetPackageForm}
                  >
                    Cancel Edit
                  </button>
                )}
              </form>
            </div>

            <div className="manage-section">
              <h2>Existing Catering Packages</h2>

              {cateringPackages.length === 0 ? (
                <p>No catering packages added yet.</p>
              ) : (
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Package</th>
                        <th>Min People</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {cateringPackages.map((pkg) => (
                        <tr key={pkg.id}>
                          <td>{pkg.packageName}</td>
                          <td>{pkg.minPeople}</td>
                          <td>₹{pkg.pricePerPlate}</td>
                          <td>
                            <span
                              className={
                                pkg.available
                                  ? "status-badge available-badge"
                                  : "status-badge unavailable-badge"
                              }
                            >
                              {pkg.available ? "Available" : "Unavailable"}
                            </span>
                          </td>
                          <td>
                            <div className="action-row">
                              <button
                                className="small-btn edit-btn"
                                onClick={() => handleEditPackage(pkg)}
                              >
                                Edit
                              </button>

                              <button
                                className="small-btn status-btn"
                                onClick={() => togglePackageAvailability(pkg)}
                              >
                                {pkg.available ? "Disable" : "Enable"}
                              </button>

                              <button
                                className="small-btn delete-btn"
                                onClick={() => handleDeletePackage(pkg.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;