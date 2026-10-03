const products = [
  { id: 1, name: "ProBook Air 14", brand: "TechNova", category: "Laptops", price: 74999, oldPrice: 82999, rating: 4.7, stock: 18, badge: "Best Seller", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", desc: "Slim 14-inch laptop with a high-resolution display, fast SSD storage and all-day battery life." },
  { id: 2, name: "UltraView 55 4K TV", brand: "VisionX", category: "Televisions", price: 42999, oldPrice: 49999, rating: 4.5, stock: 11, badge: "Deal", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=900&q=80", desc: "Immersive 55-inch 4K smart TV with vivid colors, HDR and streaming apps." },
  { id: 3, name: "SoundPods Pro", brand: "AudioMax", category: "Audio", price: 6999, oldPrice: 8999, rating: 4.6, stock: 32, badge: "Hot", image: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?auto=format&fit=crop&w=900&q=80", desc: "True wireless earbuds with active noise cancellation and rich, balanced sound." },
  { id: 4, name: "SmartPhone X12", brand: "TechNova", category: "Mobiles", price: 38999, oldPrice: 44999, rating: 4.8, stock: 24, badge: "New", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", desc: "Powerful smartphone with an AMOLED display, advanced camera and fast charging." },
  { id: 5, name: "GameBox X", brand: "GameCore", category: "Gaming", price: 52999, oldPrice: 57999, rating: 4.7, stock: 7, badge: "Limited", image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=900&q=80", desc: "Next-generation gaming console designed for fast loading and immersive gameplay." },
  { id: 6, name: "FitWatch Active", brand: "Pulse", category: "Wearables", price: 4999, oldPrice: 6499, rating: 4.4, stock: 41, badge: "Deal", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", desc: "Fitness smartwatch with health tracking, notifications and multiple workout modes." },
  { id: 7, name: "HomeHub Mini", brand: "SmartHome", category: "Smart Home", price: 3499, oldPrice: 4299, rating: 4.3, stock: 29, badge: "New", image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=900&q=80", desc: "Compact smart home hub for controlling compatible devices with simple voice commands." },
  { id: 8, name: "PixelCam 4K", brand: "VisionX", category: "Cameras", price: 61999, oldPrice: 68999, rating: 4.9, stock: 5, badge: "Pro Pick", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80", desc: "Mirrorless 4K camera with excellent autofocus, sharp optics and creator-friendly controls." },
  { id: 9, name: "Mechanical RGB Keyboard", brand: "GameCore", category: "Accessories", price: 2999, oldPrice: 3999, rating: 4.5, stock: 56, badge: "Deal", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=80", desc: "Responsive mechanical keyboard with RGB lighting and durable switches." },
  { id: 10, name: "PowerCharge 65W", brand: "VoltEdge", category: "Accessories", price: 1799, oldPrice: 2299, rating: 4.2, stock: 73, badge: "Value", image: "https://images.unsplash.com/photo-1609592424879-4a6e4f7e2f2f?auto=format&fit=crop&w=900&q=80", desc: "Compact 65W fast charger compatible with phones, tablets and laptops." },
  { id: 11, name: "NoiseCancel Headphones", brand: "AudioMax", category: "Audio", price: 8999, oldPrice: 10999, rating: 4.6, stock: 16, badge: "New", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", desc: "Over-ear wireless headphones with adaptive noise cancellation and long battery life." },
  { id: 12, name: "SmartClean Robot", brand: "SmartHome", category: "Smart Home", price: 18999, oldPrice: 21999, rating: 4.4, stock: 9, badge: "Deal", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=900&q=80", desc: "Smart robotic cleaner with scheduled cleaning and app-based controls." }
];

const categories = [
  { name: "Mobiles", icon: "bi-phone", image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80" },
  { name: "Laptops", icon: "bi-laptop", image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=600&q=80" },
  { name: "Audio", icon: "bi-headphones", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80" },
  { name: "Televisions", icon: "bi-tv", image: "https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80" },
  { name: "Gaming", icon: "bi-controller", image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=600&q=80" },
  { name: "Wearables", icon: "bi-smartwatch", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80" },
  { name: "Cameras", icon: "bi-camera", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80" },
  { name: "Smart Home", icon: "bi-house-gear", image: "https://images.unsplash.com/photo-1589492477829-5e65395b66cc?auto=format&fit=crop&w=600&q=80" },
  { name: "Accessories", icon: "bi-keyboard", image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80" }
];

const brands = ["TechNova", "VisionX", "AudioMax", "GameCore", "Pulse", "SmartHome", "VoltEdge"];
