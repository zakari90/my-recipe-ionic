import { IonItem, IonLabel, IonInput } from "@ionic/react";
import { Geolocation } from "@capacitor/geolocation";
import { useEffect, useState } from "react";
import axios from "axios";

// Define the expected props
interface GetLocationProps {
  country: (country: string) => void;
  region: (region: string) => void;
}

const GetLocation: React.FC<GetLocationProps> = ({ country: setParentCountry, region: setParentRegion }) => {
  const [region, setRegion] = useState<string>("جاري جلب المنطقة ...");
  const [country, setCountry] = useState<string>("جاري جلب الدولة ...");

  useEffect(() => {
    printCurrentPosition();
  }, []);

  useEffect(() => {
    handleLocation();
  }, [country, region]);

  const printCurrentPosition = async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.coords.latitude}&lon=${coordinates.coords.longitude}&format=json&accept-language=ar`
      );

      setRegion(res.data.address.state || res.data.address.region || "");
      setCountry(res.data.address.country || "");
    } catch (e) {
      console.error(e);
      setCountry("");
      setRegion("");
    }
  };

  const handleLocation = () => {
    setParentCountry(country);
    setParentRegion(region);
  };

  return (
    <IonItem>
      <IonLabel color="warning">الدولة</IonLabel>
      <IonInput disabled value={country} />
      <IonLabel color="warning">المنطقة</IonLabel>
      <IonInput disabled value={region} />
    </IonItem>
  );
};

export default GetLocation;
