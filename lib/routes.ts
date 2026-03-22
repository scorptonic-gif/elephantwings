export type Silo = 'restaurant' | 'chef-on-demand' | 'catering' | 'journal' | 'general'

export interface RouteConfig {
  path: string
  silo: Silo
  primaryKeyword: string
  meta: {
    title: string
    description: string
  }
}

export type SiloRoute =
  | '/'
  | '/parlor-kc/'
  | '/order-online/'
  | '/services/chef-on-demand/'
  | '/services/chef-on-demand/menus/'
  | '/services/catering/'
  | '/services/catering/weddings/'
  | '/services/catering/corporate/'
  | '/journal/'
  | '/links/'

export const ROUTE_MAP: Record<SiloRoute, RouteConfig> = {
  '/': {
    path: '/',
    silo: 'general',
    primaryKeyword: 'Indian Fusion Kansas City',
    meta: {
      title: 'Elephant Wings KC | Bold Indian Fusion in Kansas City',
      description:
        'Experience the boldest Indian Fusion in Kansas City. From our home in Parlor to your private events, Elephant Wings brings modern spice to every plate. Order now!',
    },
  },
  '/parlor-kc/': {
    path: '/parlor-kc/',
    silo: 'restaurant',
    primaryKeyword: 'Indian Fusion Restaurant Kansas City Parlor',
    meta: {
      title: 'Parlor KC Menu | Elephant Wings KC',
      description:
        'Explore the Elephant Wings menu at Parlor KC in the East Crossroads. Bold Indian Fusion dishes — from Tikka Masala Poutine to Bombay-Mi. Order online or visit us.',
    },
  },
  '/order-online/': {
    path: '/order-online/',
    silo: 'restaurant',
    primaryKeyword: 'Indian Food Delivery Kansas City',
    meta: {
      title: 'Order Online | Elephant Wings KC',
      description:
        'Hungry now? Order Elephant Wings direct via Toast or find us on DoorDash, UberEats, and GrubHub. Fresh Indian Fusion delivered straight to your door in KC.',
    },
  },
  '/services/chef-on-demand/': {
    path: '/services/chef-on-demand/',
    silo: 'chef-on-demand',
    primaryKeyword: 'Chef-On-Demand Kansas City Private Dining',
    meta: {
      title: 'Chef-On-Demand | Private Indian Fusion Dining KC | Elephant Wings',
      description:
        'Elevate your next dinner party with Chef-On-Demand. Curated Indian Fusion menus prepared in your home by Chef Ameet. Book your custom KC dining experience today.',
    },
  },
  '/services/chef-on-demand/menus/': {
    path: '/services/chef-on-demand/menus/',
    silo: 'chef-on-demand',
    primaryKeyword: 'Chef-On-Demand Menu Indian Fusion Kansas City',
    meta: {
      title: 'Chef-On-Demand Menus | Spice Route Journey | Elephant Wings KC',
      description:
        'Browse our curated Chef-On-Demand menus. The Spice Route Journey 5-course experience and more — all crafted by Chef Ameet for your private dining event in KC.',
    },
  },
  '/services/catering/': {
    path: '/services/catering/',
    silo: 'catering',
    primaryKeyword: 'Indian Fusion Catering Kansas City',
    meta: {
      title: 'Event Catering Kansas City | Indian Fusion | Elephant Wings KC',
      description:
        'Award-winning Indian Fusion catering for KC weddings, corporate events, and parties. From office lunches to grand celebrations, we bring the flavor to you.',
    },
  },
  '/services/catering/weddings/': {
    path: '/services/catering/weddings/',
    silo: 'catering',
    primaryKeyword: 'Indian Wedding Catering Kansas City',
    meta: {
      title: 'Wedding Catering Kansas City | Indian Fusion | Elephant Wings KC',
      description:
        'Make your KC wedding unforgettable with Elephant Wings Indian Fusion catering. Custom menus, professional service, and bold flavors for your most important day.',
    },
  },
  '/services/catering/corporate/': {
    path: '/services/catering/corporate/',
    silo: 'catering',
    primaryKeyword: 'Corporate Catering Kansas City',
    meta: {
      title: 'Corporate Catering Kansas City | Indian Fusion | Elephant Wings KC',
      description:
        'Upgrade your next KC office lunch or corporate event with Elephant Wings Indian Fusion catering. Drop-off, buffet, and plated options for teams of any size.',
    },
  },
  '/journal/': {
    path: '/journal/',
    silo: 'journal',
    primaryKeyword: 'Indian Fusion Kansas City Blog',
    meta: {
      title: 'Journal | Elephant Wings KC',
      description:
        'Behind the scenes with Chef Ameet, event spotlights, and Indian Fusion inspiration from the Elephant Wings KC kitchen. Stories from the Crossroads.',
    },
  },
  '/links/': {
    path: '/links/',
    silo: 'general',
    primaryKeyword: 'Elephant Wings KC Links',
    meta: {
      title: 'Links | Elephant Wings KC',
      description:
        'Order online, book Chef-On-Demand, inquire about catering, browse our menu, or read the journal. All Elephant Wings KC links in one place.',
    },
  },
}
