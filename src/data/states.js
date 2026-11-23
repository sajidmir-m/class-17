export const stateCoordinates = {
  'Andaman & Nicobar Islands': [11.7401, 92.6586],
  'Andhra Pradesh': [16.5062, 80.648],
  'Arunachal Pradesh': [27.1024, 93.692],
  Assam: [26.1445, 91.7362],
  Bihar: [25.5941, 85.1376],
  Chandigarh: [30.7333, 76.7794],
  Chhattisgarh: [21.2787, 81.8661],
  'Dadra & Nagar Haveli and Daman & Diu': [20.3974, 72.8328],
  Delhi: [28.6139, 77.209],
  Goa: [15.2993, 74.124],
  Gujarat: [23.0225, 72.5714],
  Haryana: [29.0588, 76.0856],
  'Himachal Pradesh': [31.1048, 77.1734],
  'Jammu & Kashmir': [34.0837, 74.7973],
  Jharkhand: [23.6102, 85.2799],
  Karnataka: [12.9716, 77.5946],
  Kerala: [8.5241, 76.9366],
  Ladakh: [34.1526, 77.577],
  Lakshadweep: [10.5667, 72.6417],
  'Madhya Pradesh': [23.2599, 77.4126],
  Maharashtra: [19.076, 72.8777],
  Manipur: [24.817, 93.9368],
  Meghalaya: [25.467, 91.3662],
  Mizoram: [23.7271, 92.7176],
  Nagaland: [25.6751, 94.1086],
  Odisha: [20.2961, 85.8245],
  Puducherry: [11.9416, 79.8083],
  Punjab: [30.7333, 76.7794],
  Rajasthan: [26.9124, 75.7873],
  Sikkim: [27.3389, 88.6065],
  'Tamil Nadu': [13.0827, 80.2707],
  Telangana: [17.385, 78.4867],
  Tripura: [23.8315, 91.2868],
  'Uttar Pradesh': [26.8467, 80.9462],
  Uttarakhand: [30.3165, 78.0322],
  'West Bengal': [22.5726, 88.3639],
}

export const mapLocations = Object.entries(stateCoordinates).map(([name, latlng]) => ({ name, latlng }))

export const slugifyState = (str) =>
  str
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
