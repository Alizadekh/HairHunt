import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import "../../styles/Admin/AdminProfile.css";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { db } from "../../firebase"; // Firebase config dosyanı import ediyoruz
import {
  getDocs,
  updateDoc,
  collection,
  QuerySnapshot,
} from "firebase/firestore"; // Firestore işlemleri için gerekli fonksiyonlar
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material"; // Material-UI bileşenleri
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

// Kullanıcı bilgileri için bir Type tanımlıyoruz
interface UserData {
  companyName: string;
  fullName: string;
  phoneNumber: string;
  city: string; // Şehir alanı ekleniyor
  country: string; // Ülke alanı ekleniyor
  services: string[];
  profilePhoto?: string; // Profil fotoğrafı için opsiyonel alan
  email: string;
}

const AdminProfile: React.FC = () => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [userData, setUserData] = useState<UserData>({
    companyName: "",
    fullName: "",
    phoneNumber: "",
    city: "", // Şehir alanı
    country: "", // Ülke alanı
    services: [],
    email: "",
  });

  const [updatedData, setUpdatedData] = useState<UserData>(userData);

  // Cookie'den userEmail alıyoruz
  const userEmail =
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("userEmail="))
      ?.split("=")[1] || "";

  // Firestore'dan kullanıcı bilgilerini alıyoruz
  useEffect(() => {
    const fetchUserData = async () => {
      const querySnapshot: QuerySnapshot = await getDocs(
        collection(db, "users")
      ); // Tüm user'ları alıyoruz
      querySnapshot.forEach((doc) => {
        if (doc.data().email === userEmail) {
          const userData = {
            companyName: doc.data().companyName,
            fullName: doc.data().fullName,
            phoneNumber: doc.data().phoneNumber,
            city: doc.data().city || "",
            country: doc.data().country || "",
            services: doc.data().services,
            profilePhoto: doc.data().profilePhoto || "",
            email: doc.data().email,
          };
          setUserData(userData);
          setUpdatedData(userData);
        }
      });
    };

    fetchUserData();
  }, [userEmail]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${file.name}`);

      // Resmi yükle
      await uploadBytes(storageRef, file);

      // Yükleme tamamlandıktan sonra URL'yi al
      const profilePhotoURL = await getDownloadURL(storageRef);

      setUpdatedData((prevData) => ({
        ...prevData,
        profilePhoto: profilePhotoURL,
      }));
    }
  };

  // Yeni melumatlari FireStore a elave edirik
  const handleSave = async () => {
    const querySnapshot: QuerySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach(async (docSnapshot) => {
      const userDoc = docSnapshot.ref;
      if (docSnapshot.data().email === userEmail) {
        const formattedData = {
          companyName: updatedData.companyName,
          fullName: updatedData.fullName,
          phoneNumber: updatedData.phoneNumber,
          city: updatedData.city, // Yeni alan
          country: updatedData.country, // Yeni alan
          services: updatedData.services,
          profilePhoto: updatedData.profilePhoto,
        };
        await updateDoc(userDoc, formattedData);
        setUserData(updatedData);
        setModalOpen(false);
      }
    });
  };

  return (
    <div className="adminprofilepage">
      <Sidebar />
      <div>
        <nav>
          <ul>
            <li>
              <Link to="">
                <span>My business </span>
                <MdOutlineArrowForwardIos />
              </Link>
            </li>
            <li>
              <Link to="">Profile</Link>
            </li>
          </ul>
        </nav>
        <div className="editprofile">
          <div>
            <div>
              <div className="mainbusinessprofile">
                <img src={userData.profilePhoto || ""} alt="profile photo" />
                <h4>{userData.email}</h4>
              </div>
              <div className="additionalInfo">
                <div>
                  <p>Company Name:</p>
                  <p>{userData.companyName}</p>
                </div>
                <div>
                  <p>FullName:</p>
                  <p>{userData.fullName}</p>
                </div>
                <div>
                  <p>Phone Number:</p>
                  <p>{userData.phoneNumber}</p>
                </div>
                <div>
                  <p>Country:</p>
                  <p>{userData.country}</p>
                </div>
                <div>
                  <p>City:</p>
                  <p>{userData.city}</p>
                </div>
                <div>
                  <p>Services:</p>
                  <ul>
                    {userData.services && userData.services.length > 0 ? (
                      userData.services.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))
                    ) : (
                      <li>No services available</li>
                    )}
                  </ul>
                </div>
              </div>
              <button onClick={() => setModalOpen(true)}>Edit Details</button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent className="editmodalofadminprofile">
          <label>
            <img src={userData.profilePhoto || ""} alt="" />
            <input type="file" placeholder="pp" onChange={handleFileChange} />
          </label>
          <label>
            Company Name:
            <input
              type="text"
              name="companyName"
              value={updatedData.companyName}
              onChange={handleChange}
            />
          </label>
          <label>
            FullName:
            <input
              type="text"
              name="fullName"
              value={updatedData.fullName}
              onChange={handleChange}
            />
          </label>
          <label>
            Phone Number:
            <input
              type="text"
              name="phoneNumber"
              value={updatedData.phoneNumber}
              onChange={handleChange}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={updatedData.city}
              onChange={handleChange}
            />
          </label>
          <label>
            Country:
            <input
              type="text"
              name="country"
              value={updatedData.country}
              onChange={handleChange}
            />
          </label>
          <label>
            <div>
              Services:
              <input
                type="text"
                name="services"
                value={updatedData.services.join(", ")}
                onChange={(e) =>
                  setUpdatedData({
                    ...updatedData,
                    services: e.target.value.split(", "),
                  })
                }
              />
            </div>
            <p>Please write with ","</p>
          </label>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleSave}>Save</Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminProfile;
