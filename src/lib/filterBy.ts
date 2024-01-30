export const arrSpecialization = [
  "Spesialis Anak",
  "Spesialis Saraf",
  "Dokter Umum",
  "Spesialis Kulit",
  "Spesialis THT",
  "Dokter Gigi",
  "Psikiater",
  "Spesialis Mata",
  "Spesialis Bedah",
  "Spesialis Penyakit Dalam",
];

export const objSpecialization: Record<string, string> = {
  "Spesialis Anak": "1",
  "Spesialis Saraf": "2",
  "Dokter Umum": "3",
  "Spesialis Kulit": "4",
  "Spesialis THT": "5",
  "Dokter Gigi": "6",
  Psikiater: "7",
  "Spesialis Mata": "8",
  "Spesialis Bedah": "9",
  "Spesialis Penyakit Dalam": "10",
};

export const isDrug = {
  Drugs: "true",
  "Non-Drugs": "false",
};

export const arrStatus = [
  "Waiting for payment",
  "Waiting for payment confirmation",
  "Processed",
  "Sent",
  "Order confirmed",
  "Canceled",
];

export const objStatus = {
  "Waiting for payment": 1,
  "Waiting for payment confirmation": 2,
  Processed: 3,
  Sent: 4,
  "Order confirmed": 5,
  Canceled: 6,
};

export const arrRole = ["User", "Doctor", "Admin Pharmacy"];
export const objRole = {
  User: 1,
  Doctor: 2,
  "Admin Pharmacy": 3,
};

export const arrStockRecord = [
  "Reduction",
  "Addition"
]

export const objStockRecord = {
  "Reduction": "true",
  "Addition": "false",
}