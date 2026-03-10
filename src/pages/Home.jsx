import { useState, useEffect } from 'react'

export default function Home() {
  const [image, setImage] = useState("https://via.placeholder.com");
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [cropData, setCropData] = useState({ x: 0, y: 0, width: 200, height: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Carregar imagem do localStorage ao montar o componente
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setImage(savedImage);
    }
  }, []);

  // Salvar imagem no localStorage quando mudar
  useEffect(() => {
    if (image !== "https://via.placeholder.com") {
      localStorage.setItem('profileImage', image);
    }
  }, [image]);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setImageToCrop(event.target.result);
          setCropData({
            x: Math.max(0, (img.width - 500) / 2),
            y: Math.max(0, (img.height - 600) / 2),
            width: 500,
            height: 600
          });
          setZoom(1);
          setShowCropModal(true);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    }
  };

  const handleMouseDown = (e) => {
    if (e.button === 0) {
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setCropData({
      ...cropData,
      x: Math.max(0, cropData.x + deltaX),
      y: Math.max(0, cropData.y + deltaY)
    });
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      canvas.width = cropData.width;
      canvas.height = cropData.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, -cropData.x, -cropData.y);
      setImage(canvas.toDataURL());
      setShowCropModal(false);
      setImageToCrop(null);
    };
    img.src = imageToCrop;
  };

  const handleCancel = () => {
    setShowCropModal(false);
    setImageToCrop(null);
  };

  return (
    <main className="hero">
      <div className="hero-content">
        <span className="greeting">Olá, sou</span>
        <h1>Eduardo <br /> Dani silva</h1>
        <p className="subtitle">Desenvolvedor Web</p>
        
        <div className="actions">
          <label htmlFor="file-upload" className="btn-primary">
            MUDAR FOTO
          </label>
          <input id="file-upload" type="file" onChange={handleImageChange} accept="image/*" />
        </div>
      </div>

      <div className="hero-image">
        <div className="image-border">
          <img src={image} alt="Profile" />
        </div>
      </div>

      {showCropModal && (
        <div className="crop-modal-overlay">
          <div className="crop-modal">
            <h3>Recortar Imagem</h3>
            <div className="crop-container">
              <div 
                className="crop-preview"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                <img 
                  src={imageToCrop} 
                  alt="Crop preview"
                  style={{
                    transform: `translate(-${cropData.x}px, -${cropData.y}px) scale(${zoom})`
                  }}
                />
                <div 
                  className="crop-frame"
                  style={{
                    width: `${cropData.width}px`,
                    height: `${cropData.height}px`
                  }}
                />
              </div>
            </div>
            <div className="zoom-control">
              <span className="zoom-label">Zoom:</span>
              <input 
                type="range" 
                min="0.8" 
                max="1.5" 
                step="0.1" 
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="zoom-slider"
              />
              <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="crop-controls">
              <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
              <button className="btn-apply" onClick={handleApplyCrop}>Aplicar</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
