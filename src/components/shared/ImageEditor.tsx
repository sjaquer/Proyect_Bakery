import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import Button from './Button';
import getCroppedImg from '../../utils/cropImage';

interface ImageEditorProps {
  imageUrl?: string;
  onChange: (url: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onChange }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((_area: any, pixels: any) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!imageUrl || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imageUrl, croppedAreaPixels);
    onChange(cropped);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <div>
      <div className="relative w-full h-64 bg-gray-200 mb-4">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
        />
        <Button type="button" onClick={handleSave} size="sm">
          Guardar recorte
        </Button>
      </div>
    </div>
  );
};

export default ImageEditor;
