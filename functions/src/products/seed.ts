import { db, COLLECTIONS, serverTimestamp } from '../utils';

/**
 * Seed initial products for development
 * Run this function once to populate the Firestore with sample products
 */
export async function seedProducts() {
  const products = [
    {
      name: 'Lightsaber - Blue',
      description:
        'An elegant weapon for a more civilized age. This blue-bladed lightsaber is perfect for Jedi Knights.',
      price: 299.99,
      seller: 'Jedi Temple Store',
      imageUrl: 'https://picsum.photos/seed/lightsaber-blue/400/400',
      category: 'weapons',
      stock: 50,
      createdAt: serverTimestamp(),
    },
    {
      name: 'Lightsaber - Red',
      description:
        'Channel the power of the dark side with this crimson-bladed lightsaber. Kyber crystal included.',
      price: 349.99,
      seller: 'Sith Artifacts',
      imageUrl: 'https://picsum.photos/seed/lightsaber-red/400/400',
      category: 'weapons',
      stock: 30,
      createdAt: serverTimestamp(),
    },
    {
      name: 'Mandalorian Helmet',
      description:
        'This is the way. Authentic Beskar steel helmet worn by the legendary Mandalorian warriors.',
      price: 499.99,
      seller: 'Mandalore Armory',
      imageUrl: 'https://picsum.photos/seed/mando-helmet/400/400',
      category: 'armor',
      stock: 15,
      createdAt: serverTimestamp(),
    },
    {
      name: 'Baby Yoda Plush',
      description:
        'The cutest creature in the galaxy. This adorable Grogu plush is perfect for any Star Wars fan.',
      price: 29.99,
      seller: 'Galaxy Toys',
      imageUrl: 'https://picsum.photos/seed/baby-yoda/400/400',
      category: 'toys',
      stock: 200,
      createdAt: serverTimestamp(),
    },
    {
      name: 'Millennium Falcon Model',
      description:
        'Detailed replica of the fastest hunk of junk in the galaxy. Perfect for collectors.',
      price: 149.99,
      seller: 'Corellian Shipyards',
      imageUrl: 'https://picsum.photos/seed/falcon-model/400/400',
      category: 'collectibles',
      stock: 25,
      createdAt: serverTimestamp(),
    },
    {
      name: 'Stormtrooper Armor Set',
      description:
        'Full set of Imperial Stormtrooper armor. Note: Accuracy not guaranteed.',
      price: 799.99,
      seller: 'Imperial Surplus',
      imageUrl: 'https://picsum.photos/seed/stormtrooper/400/400',
      category: 'armor',
      stock: 10,
      createdAt: serverTimestamp(),
    },
    {
      name: 'Jedi Robe',
      description:
        'Traditional Jedi robes made from the finest fabrics. Perfect for meditation and combat.',
      price: 89.99,
      seller: 'Jedi Temple Store',
      imageUrl: 'https://picsum.photos/seed/jedi-robe/400/400',
      category: 'clothing',
      stock: 75,
      createdAt: serverTimestamp(),
    },
    {
      name: 'Death Star Blueprint',
      description:
        'Original technical readouts of the Death Star. For educational purposes only.',
      price: 1999.99,
      seller: 'Rebel Archives',
      imageUrl: 'https://picsum.photos/seed/death-star/400/400',
      category: 'collectibles',
      stock: 5,
      createdAt: serverTimestamp(),
    },
  ];

  const batch = db.batch();

  products.forEach((product) => {
    const docRef = db.collection(COLLECTIONS.PRODUCTS).doc();
    batch.set(docRef, product);
  });

  await batch.commit();
  console.log(`Seeded ${products.length} products`);
}
