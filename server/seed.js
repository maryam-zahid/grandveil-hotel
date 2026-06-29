require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Room = require('./models/Room');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB...');

  await User.deleteMany({});
  await Room.deleteMany({});

  // Create admin
  await User.create({
    name: 'Admin GrandVeil',
    email: 'admin@grandveil.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1 800 000 0001'
  });

  // Create guest
  await User.create({
    name: 'Jane Smith',
    email: 'guest@grandveil.com',
    password: 'guest123',
    role: 'user',
    phone: '+1 800 000 0002'
  });

  // Create rooms
  const rooms = [
    { name: 'Classic King Room', type: 'Standard', description: 'An elegantly appointed room with king bed, marble bathroom and city views.', price: 250, capacity: 2, size: 450, floor: 3, roomNumber: '301', bedType: 'King', view: 'City', amenities: ['WiFi', 'Air Conditioning', 'Mini Bar', 'Room Service', 'Smart TV'], isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&q=85'] },
    { name: 'Deluxe Ocean Suite', type: 'Deluxe', description: 'Breathtaking ocean views from a beautifully designed suite with separate living area.', price: 550, capacity: 2, size: 750, floor: 8, roomNumber: '801', bedType: 'King', view: 'Ocean', amenities: ['WiFi', 'Ocean View', 'Jacuzzi', 'Butler Service', 'Balcony', 'Mini Bar', 'Espresso Machine'], isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=85'] },
    { name: 'Garden View Twin', type: 'Standard', description: 'A serene twin room overlooking our private landscaped gardens.', price: 200, capacity: 2, size: 400, floor: 2, roomNumber: '204', bedType: 'Twin', view: 'Garden', amenities: ['WiFi', 'Garden View', 'Room Service', 'Smart TV', 'Air Conditioning'], isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=85'] },
    { name: 'Grand Pool Suite', type: 'Suite', description: 'Direct pool access suite with private terrace, plunge pool and full butler service.', price: 950, capacity: 4, size: 1200, floor: 1, roomNumber: '101', bedType: 'King', view: 'Pool', amenities: ['WiFi', 'Private Pool', 'Terrace', 'Butler Service', 'Kitchen', 'Dining Area', 'Jacuzzi', 'Mini Bar'], isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=85'] },
    { name: 'Presidential Penthouse', type: 'Presidential', description: 'The crown jewel of GrandVeil — a full-floor private residence with panoramic 360° views, a private chef, and every conceivable luxury.', price: 3500, capacity: 6, size: 4000, floor: 20, roomNumber: '2001', bedType: 'King', view: 'Ocean', amenities: ['WiFi', '360° Views', 'Private Chef', 'Private Pool', 'Cinema Room', 'Wine Cellar', 'Personal Stylist', 'Helicopter Pad Access', 'Butler Service'], isFeatured: true, isAvailable: true, images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&q=85'] },
    { name: 'Mountain Retreat Room', type: 'Deluxe', description: 'Dramatic mountain panoramas from a sumptuously appointed deluxe room with stone fireplace.', price: 420, capacity: 2, size: 600, floor: 5, roomNumber: '512', bedType: 'Queen', view: 'Mountain', amenities: ['WiFi', 'Mountain View', 'Fireplace', 'Balcony', 'Room Service', 'Mini Bar'], isFeatured: false, isAvailable: true, images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=85'] },
  ];

  await Room.insertMany(rooms);

  console.log('✅ Database seeded successfully!');
  console.log('👤 Admin: admin@grandveil.com / admin123');
  console.log('👤 Guest: guest@grandveil.com / guest123');
  console.log(`🏨 ${rooms.length} rooms created`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });