import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { FaCamera } from "react-icons/fa";
import { IoMdPhotos, IoIosArrowRoundBack } from "react-icons/io";
import { BiSolidPhotoAlbum } from "react-icons/bi";
import { HiSave } from "react-icons/hi";


function AddMemoryInputFile() {
  const [photo, setPhoto] = useState(null);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState({ lat: null, lng: null });
  const [memories, setMemories] = useState(() => {
    const saved = localStorage.getItem('memories');
    return saved ? JSON.parse(saved) : [];
  });

  const navigate = useNavigate();

  // Referencje do ukrytych inputów
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);

  const goHome = () => {
    navigate('/');
  };

  const goAlbum = () => {
    navigate('../album');
  };

  useEffect(() => {
    fetchLocation();
  }, []);
// Pobieranie lokalizacji
  const fetchLocation = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCoords({ lat, lng });

          try {
            const res = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
            );
            const data = await res.json();
            setLocation(data.city || data.locality || `${lat},${lng}`);
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            setLocation(`(${lat}, ${lng})`);
          }
        },
        (err) => {
          console.error('Localization error:', err);
          setLocation('Failed to fetch localization');
        }
      );
    } else {
      setLocation('Localization unavailable');
    }
  };

  // Obsługa zmiany pliku
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPhoto(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveMemory = () => {
    if (!photo) {
      alert('Take or choose a pic first!');
      return;
    }
    const newMemory = {
      id: Date.now(),
      photo,
      description,
      location,
      lat: coords.lat,
      lng: coords.lng,
      createdAt: new moment().format('LLLL'),
    };
    const updatedMemories = [...memories, newMemory];
    setMemories(updatedMemories);
    localStorage.setItem('memories', JSON.stringify(updatedMemories));

    // Reset
    setPhoto(null);
    setDescription('');
    alert('Memory saved!');
  };

  // Funkcje wywołujące kliknięcie w ukryte inputy
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const openGallery = () => {
    if (galleryInputRef.current) {
      galleryInputRef.current.click();
    }
  };

  return (
    <div>
      <h1>Add Memory</h1>

{/* Ukryty input do robienia zdjęcia (otwiera aparat) */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Ukryty input do dodawania zdjęcia z galerii */}
      <input
        type="file"
        accept="image/*"
        ref={galleryInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Przyciski, które otwierają odpowiednie inputy */}
      <div style={{ marginBottom: '1rem' }}>
        <button onClick={openCamera} style={{ marginRight: '1rem' }}>
        <FaCamera /> <br/>Take photo</button>

        <button onClick={openGallery}><IoMdPhotos/> <br />Add from library</button>
      </div>

      <div style={{ marginBottom: '1rem', width: '300px', height: '225px', border: '0px solid #ccc' }}>
        {photo ? (
          <img
            src={photo}
            alt="Selected"
            style={{ maxWidth: '100%', maxHeight: '100%', display: 'block', margin: 'auto' }}
          />
        ) : (
          <p style={{ textAlign: 'center', justifyContent: 'center' }}>Take, or choose a pic</p>
        )}
      </div>

      <div style={{ marginBottom: '1rem', marginTop: '1rem' }}>
        <label>Description:</label>
        <br />
        <textarea
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ width: '300px' }}
        />
        <br />
        <p><strong>Location:</strong> {location || 'No location'}</p>
      </div>

      <button onClick={saveMemory}><HiSave/> <br/>Save Memory</button>
      <button onClick={goHome}><IoIosArrowRoundBack/> <br/>Back</button>
      <button onClick={goAlbum}><BiSolidPhotoAlbum/> <br/>Album</button>
    </div>
  );
}

export default AddMemoryInputFile;
