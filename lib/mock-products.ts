export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  image: string
  rating: number
}

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Jarrón Decorativo Ébano Imperial Bajo',
    price: 649000,
    category: 'Línea Suprema',
    image: '/ls-1.webp',
    rating: 0,
  },
  {
    id: '2',
    name: 'Jarrón Boreal Ahumado Redondo',
    price: 599000,
    category: 'Línea Suprema',
    image: '/ls-2.webp',
    rating: 0,
  },
  {
    id: '3',
    name: 'Jarrón Boreal Ahumado Alto',
    price: 999000,
    category: 'Línea Suprema',
    image: '/ls-3.webp',
    rating: 0,
  },
  {
    id: '4',
    name: 'Escultura en piedra color nude',
    price: 399900,
    category: 'Esculturas',
    image: '/esc-1.jpeg',
    rating: 0,
  },
  {
    id: '5',
    name: 'Escultura decorativa en piedra',
    price: 1100000,
    category: 'Esculturas',
    image: '/esc-2.jpeg',
    rating: 0,
  },
  {
    id: '6',
    name: 'Escultura decorativa en piedra',
    price: 379900,
    category: 'Esculturas',
    image: '/esc-3.jpeg',
    rating: 0,
  },
  {
    id: '7',
    name: 'Jarrón Esferico Tallado Negro en Metal Grande',
    price: 329900,
    originalPrice: 429900,
    category: 'Summer Sale',
    image: '/sum-1.webp',
    rating: 0,
  },
  {
    id: '8',
    name: 'Jarrón Cilindrico Dorado Acanalado Pequeño',
    price: 299900,
    originalPrice: 589900,
    category: 'Summer Sale',
    image: '/sum-2.webp',
    rating: 0,
  },
  {
    id: '9',
    name: 'Jarrón Escultórico Ovalado Negro Pequeño',
    price: 249900,
    originalPrice: 319900,
    category: 'Summer Sale',
    image: '/sum-3.webp',
    rating: 0,
  },
  {
    id: '10',
    name: 'Juego de mesa en cristal',
    price: 299900,
    category: 'Accesorios Hogar',
    image: '/acc-1.jpeg',
    rating: 0,
  },
  {
    id: '11',
    name: 'Caballo de resina blanco poroso',
    price: 299900,
    category: 'Accesorios Hogar',
    image: '/acc-2.jpeg',
    rating: 0,
  },
  {
    id: '12',
    name: 'Libro decorativo tipo caja por unidad',
    price: 49900,
    category: 'Accesorios Hogar',
    image: '/acc-3.jpeg',
    rating: 0,
  },
  {
    id: '13',
    name: 'Jarron negro y dorado grande en acero',
    price: 199900,
    category: 'Jarrones Escultóricos',
    image: '/jarr-1.jpeg',
    rating: 0,
  },
  {
    id: '14',
    name: 'Jarrón blanco en resina',
    price: 289900,
    category: 'Jarrones Escultóricos',
    image: '/jarr-2.jpeg',
    rating: 0,
  },
  {
    id: '15',
    name: 'Jarrón pequeño negro en acrílico tallado',
    price: 299900,
    category: 'Jarrones Escultóricos',
    image: '/jarr-3.jpeg',
    rating: 0,
  },
]
