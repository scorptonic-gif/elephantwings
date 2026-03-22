export const SITE_CONFIG = {
  name: 'Elephant Wings KC',
  domain: 'https://elephantwingskc.com',
  email: 'ameet.elephantwings@gmail.com',
  phone: '8165885973',
  phoneDisplay: '816.588.5973',
  address: {
    street: '1707 Locust St, Space 2',
    city: 'Kansas City',
    state: 'MO',
    zip: '64108',
    full: '1707 Locust St, Space 2, Kansas City, MO 64108',
  },
  hours: [
    { days: 'Monday',    open: null,    close: null    },
    { days: 'Tuesday',   open: '11:00', close: '22:00' },
    { days: 'Wednesday', open: '11:00', close: '22:00' },
    { days: 'Thursday',  open: '11:00', close: '22:00' },
    { days: 'Friday',    open: '11:00', close: '22:00' },
    { days: 'Saturday',  open: '11:00', close: '23:00' },
    { days: 'Sunday',    open: '11:00', close: '21:00' },
  ],
  serviceArea: ['Kansas City', 'Overland Park', 'Leawood', 'Mission'],
  chef: {
    name: 'Chef Ameet Malhotra',
    firstName: 'Ameet',
  },
  parlor: {
    name: 'Parlor KC',
    url: 'https://www.parlorkcmo.com',
    address: '1707 Locust St, Kansas City, MO 64108',
  },
  social: {
    instagram: 'https://www.instagram.com/elephantwingskc',
    facebook:  'https://www.facebook.com/elephantwingskc/',
  },
  ordering: {
    toast: 'https://order.toasttab.com/online/elephant-wings-parlor',
    doordash: 'https://www.doordash.com/store/elephant-wings-kansas-city-27847660/',
    ubereats: 'https://www.ubereats.com/store/elephant-wings',
    grubhub: 'https://www.grubhub.com/restaurant/elephant-wings-kansas-city',
  },
  og: {
    defaultImage: '/og/default.jpg',
    width: 1200,
    height: 630,
  },
} as const

export type SiteConfig = typeof SITE_CONFIG
