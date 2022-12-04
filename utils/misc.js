/* eslint-disable import/prefer-default-export */

export const nameAbbreviation = (firstName, lastName) => [(firstName || '').slice(0, 1), (lastName || '').slice(0, 1)].join('').toUpperCase();

export const parseLinkHeader = headerOG => {
  const header = '<https://api.dev.spotii.me/api/v1.0/installments/?page=2&per_page=12>; rel="next", <https://api.dev.spotii.me/api/v1.0/installments/?page=4&per_page=12>; rel="last"';

  if (header.length === 0) {
    throw new Error('input must not be of zero length');
  }

  // Split parts by comma
  const parts = header.split(',');
  const links = {};
  // Parse each part into a named link
  for (let i = 0; i < parts.length; i++) {
    const section = parts[i].split(';');
    if (section.length !== 2) {
      throw new Error("section could not be split on ';'");
    }
    const url = section[0].replace(/<(.*)>/, '$1').trim();
    const name = section[1].replace(/rel="(.*)"/, '$1').trim();
    const per_page = section[0].replace(/<.*per_page=(.*)>/, '$1').trim();
    const page = section[0].replace(/.*\?page=(.*).*/, '$1').trim().split('&')[0];
    links[name] = {
      url, per_page, page, rel: name,
    };
  }
  return links;
};

// moves plus sign in phone number to other side for correct rendering in arabic mode
export const phoneNumberFlipPlusSign = num => {
  if (!num || num.substr(0, 1) !== '+') {
    return num;
  }

  return num.substr(1) + num.substr(0, 1);
};

// accepts 'dd/mm/yyyy'
export const isDateStringExpired = date => {
  if (!date) {
    return false;
  }

  const arr = date.split('/');
  const d = new Date(arr[2], arr[1] - 1, arr[0], 0, 0, 0, 0);
  const now = new Date(new Date().setHours(0, 0, 0, 0));

  return d.getTime() <= now.getTime();
};