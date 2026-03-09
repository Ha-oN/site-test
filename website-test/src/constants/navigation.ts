export interface NavItem {
  id: string;
  href?: string; // Optionnel si c'est un parent de menu déroulant
  children?: { id: string; href: string }[]; // Les sous-menus
}

export const NAV_LINKS: NavItem[] = [
  { id: 'home', href: '/' },
  { 
    id: 'collections', 
    children: [
      { id: 'allCollections', href: '/collections' },
      { id: 'accessories', href: '/collections/accessoires' },
      { id: 'clothing', href: '/collections/vetements' },
    ]
  },
  { id: 'newArrivals', href: '/new' },
  { id: 'aboutUs', href: '/about' },
  { id: 'customMade', href: '/custom' },
];