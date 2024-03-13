export const HEURES = [
  { label: '1 heure', value: 1 },
  { label: '2 heures', value: 2 },
  { label: '3 heures', value: 3 },
  { label: '4 heures', value: 4 },
  { label: '5 heures', value: 5 },
];


export const formatDateToYYYYMMDDHHMM = (date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

export const pourcentage = [
  { label: "Disponible", value: 60 },
  { label: "Pas beaucoup de place", value: 99 },
  { label: "Indisponible", value: 100 },
]

export const getBadgeStyles = (status) => {
  let backgroundColor

  switch (status) {
    case 'success':
      backgroundColor = '#28a745';
      break;
    case 'warning':
      backgroundColor = '#ffc107';
      break;
    case 'danger':
      backgroundColor = '#dc3545';
      break;
    default:
      backgroundColor = '#e7e7e7';
  }

  return {
    backgroundColor
  };
};

const countriesUrl = 'https://restcountries.com/v3.1/all';

export function fetchCountriesData() {
  return new Promise((resolve, reject) => {
    fetch(countriesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Verifier votre connexion internet');
        }
        return response.json();
      })
      .then(data => {
        const commonNames = data.map(country => ({ label: country.translations.fra.common, value: country.translations.fra.common }));
        commonNames.sort((a, b) => a.label.localeCompare(b.label));

        resolve(commonNames);
      })
      .catch(error => reject(error));
  });
}

const regionData = '../data/region.json';

export const sortNotifications = (notifications) => {
  return notifications.sort((a, b) => {
    const dateA = new Date(a.at).getTime();
    const dateB = new Date(b.at).getTime();
    return dateB - dateA;
  });
}


export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validerTelephone = (telephone) => {
  const telephoneRegex = /^7[0,5,6,7,8][0-9]{7}/
  return telephoneRegex.test(telephone);
}