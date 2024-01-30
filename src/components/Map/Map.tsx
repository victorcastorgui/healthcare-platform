import React, { Dispatch, useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import { LatLng, LatLngExpression, icon } from "leaflet";
import { useMap } from "react-leaflet/hooks";
import { TAddress, TPharmaciesDetailForm } from "@/types";

type TMap = {
  position: LatLngExpression | null;
  setPosition: Dispatch<React.SetStateAction<null | LatLngExpression>>;
  formData: TAddress | TPharmaciesDetailForm;
  setFormData:
    | Dispatch<React.SetStateAction<TAddress>>
    | Dispatch<React.SetStateAction<TPharmaciesDetailForm>>;
};

const RecenterAutomatically = ({
  lat,
  lng,
  setFormData,
}: {
  lat: string;
  lng: string;
  setFormData:
    | Dispatch<React.SetStateAction<TAddress>>
    | Dispatch<React.SetStateAction<TPharmaciesDetailForm>>;
}) => {
  const map = useMap();
  useEffect(() => {
    setFormData((prevData: any) => ({
      ...prevData,
      latitude: lat,
      longitude: lng,
    }));

    map.setView([parseFloat(lat), parseFloat(lng)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lng]);
  return null;
};

const markerIcon = icon({
  iconUrl: "https://everhealth-asset.irfancen.com/assets/pin.png",
  iconSize: [24, 38],
});
function LocationMarker({
  position,
  setPosition,
  formData,
  setFormData,
}: TMap) {
  const [strLatLong, setStrLatLong] = useState<string>("");
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      const tempPosition = e.latlng as LatLng;
      setFormData((prevData: any) => ({
        ...prevData,
        latitude: tempPosition.lat.toString(),
        longitude: tempPosition.lng.toString(),
      }));
    },
  });

  useEffect(() => {
    setPosition({
      lat: parseFloat(formData.latitude),
      lng: parseFloat(formData.longitude),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.latitude, formData.longitude]);

  useEffect(() => {
    if (formData.latitude !== "" && formData.longitude !== "") {
      setStrLatLong(
        formData.latitude.slice(0, 9) + ", " + formData.longitude.slice(0, 9)
      );
    }
  }, [formData.latitude, formData.longitude]);

  return position === null ? null : (
    <Marker position={position} icon={markerIcon}>
      <Popup>{strLatLong}</Popup>
    </Marker>
  );
}

export type TTMap = {
  formData: TAddress | TPharmaciesDetailForm;
  setFormData:
    | Dispatch<React.SetStateAction<TAddress>>
    | Dispatch<React.SetStateAction<TPharmaciesDetailForm>>;
};

const Map = ({ formData, setFormData }: TTMap) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);
  const center: LatLngExpression = {
    lat: parseFloat(formData.latitude),
    lng: parseFloat(formData.longitude),
  };

  return (
    <MapContainer
      center={center}
      zoom={20}
      scrollWheelZoom={true}
      className="w-full h-[500px] !z-0"
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker
        position={position !== null ? position : center}
        setPosition={setPosition}
        setFormData={setFormData}
        formData={formData}
      />
      <RecenterAutomatically
        lat={formData.latitude}
        lng={formData.longitude}
        setFormData={setFormData}
      />
    </MapContainer>
  );
};

export default Map;
