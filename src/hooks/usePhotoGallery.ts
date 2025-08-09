import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { useState } from 'react';

export function usePhotoGallery() {
  const [blobUrl, setBlobUrl] = useState<string | undefined>(undefined);

  const takePhoto = async (): Promise<void> => {
    try {
      const cameraPhoto: Photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,//this allows us to get the photo as a URI
        source: CameraSource.Prompt,//this allows the user to choose between taking a new photo or selecting one from the gallery
        quality: 70,
        promptLabelHeader: "صورة",
        promptLabelPhoto: "من ملفات الصور",
        promptLabelPicture: "التقط صورة",
      });

      setBlobUrl(cameraPhoto.webPath);
    } catch (e) {
      console.log("تم إغلاق الكاميرا");
    }
  };

  return {
    takePhoto,
    blobUrl,
  };
}
