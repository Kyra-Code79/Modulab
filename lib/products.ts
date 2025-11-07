import type { Product } from "./types"

export const products: Product[] = [
  {
    id: "1",
    name: "Arduino Series | Nano, Uno, Mega",
    price: 250000,
    category: "Board Pengembangan",
    image: "/arduino-nano-uno-mega-boards.jpg",
    description:
      "Paket lengkap Arduino dengan berbagai varian termasuk Nano, Uno, dan Mega untuk berbagai kebutuhan proyek.",
    stock: 15,
  },
  {
    id: "2",
    name: "ESP 32 Development Board",
    price: 60000,
    category: "Board Pengembangan",
    image: "/esp32-development-board.jpg",
    description: "Board ESP32 dengan WiFi dan Bluetooth terintegrasi untuk IoT dan proyek wireless.",
    stock: 20,
  },
  {
    id: "3",
    name: "Sensor Standar Kit",
    price: 150000,
    category: "Kit Sensor",
    image: "/sensor-kit-electronics.jpg",
    description: "Kit lengkap sensor untuk berbagai aplikasi termasuk suhu, kelembaban, jarak, dan lebih banyak lagi.",
    stock: 12,
  },
  {
    id: "4",
    name: "Arduino Series | Nano, Uno, Mega",
    price: 250000,
    category: "Board Pengembangan",
    image: "/arduino-boards-collection.jpg",
    description: "Koleksi Arduino lengkap dengan dokumentasi dan contoh code untuk pemula hingga advanced.",
    stock: 8,
  },
  {
    id: "5",
    name: "ESP 32 Development Board",
    price: 60000,
    category: "Board Pengembangan",
    image: "/esp32-board-wifi.jpg",
    description: "ESP32 dengan dual core processor untuk aplikasi IoT yang lebih kompleks.",
    stock: 18,
  },
  {
    id: "6",
    name: "Sensor Standar Kit",
    price: 150000,
    category: "Kit Sensor",
    image: "/electronics-sensors-kit.jpg",
    description: "Kit sensor standar industri dengan komponen berkualitas dan dokumentasi lengkap.",
    stock: 10,
  },
]

export const categories = ["Semua", "Board Pengembangan", "Kit Sensor", "Komponen", "Aksesoris"]
