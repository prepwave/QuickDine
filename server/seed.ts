import "dotenv/config";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

console.log(await dns.promises.resolveSrv("_mongodb._tcp.cluster0.sefi5f1.mongodb.net"));
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { User } from "./models/User.js";
import Restaurant from "./models/Restaurants.js";
import Booking from "./models/Booking.js";
import {
  UtensilsCrossedIcon,
  FishIcon,
  CroissantIcon,
  Building2Icon,
  BeefIcon,
  LeafIcon,
 
} from "lucide-react";
import { Globe, Share2, Mail } from "lucide-react";
import { GlobeIcon, Share2Icon, MailIcon } from "lucide-react";

console.log("🚀 Seed file started");

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/quickdine";
const seedData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log("Connected to MongoDB");

        // Your seed data logic here

        await User.deleteMany({});
        await User.create([
            { name: "John Doe", email: "john@example.com", password: "password", role: "admin" },
            { name: "Jane Smith", email: "jane@example.com", password: "password", role: "owner" },
            { name: "Bob Johnson", email: "bob@example.com", password: "password", role: "user" },
        ]);
       
       

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("password", salt);
        const adminPassword = await bcrypt.hash("adminpassword", salt);
        const UserPassword = await bcrypt.hash("userpassword", salt);
        const ownerPassword = await bcrypt.hash("ownerpassword", salt);

        // Admin
        const adminUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            phone: "123-456-7890",
            password: adminPassword,
            role: "admin",
        });
        // user
        const testUser = await User.create({
            name: "User",
            email: "user@example.com",
            phone: "987-654-3210",
            password: UserPassword,
            role: "user",
        });
        // owner
        const ownerUser = await User.create({
            name: "Owner",
            email: "owner@example.com",
            phone: "555-555-5555",  
            password: ownerPassword,
            role: "owner",
        });

        

        
       
        const dummyReviews = [
    {
        _id: "dummy-rev-1",
        userName: "Emily Watson",
        rating: 5,
        comment: "Absolutely phenomenal experience! The ambiance was perfect, and the food was cooked to perfection. A must-visit!",
        visitedDate: "2026-06-10T12:00:00.000Z",
        createdAt: "2026-06-10T12:00:00.000Z",
    },
    {
        _id: "dummy-rev-2",
        userName: "Marcus Vance",
        rating: 4,
        comment:
            "The signature dishes were incredible and the staff was extremely attentive. Will definitely come back for another dinner.",
        visitedDate: "2026-06-08T18:30:00.000Z",
        createdAt: "2026-06-08T18:30:00.000Z",
    },
    {
        _id: "dummy-rev-3",
        userName: "Sophia Loren",
        rating: 5,
        comment: "Every course of the tasting menu was a delightful surprise. The pairings were exquisite. High-end dining at its finest.",
        visitedDate: "2026-06-05T20:15:00.000Z",
        createdAt: "2026-06-05T20:15:00.000Z",
    },
];
    const footerSections = [
    {
        title: "COMPANY",
        links: [
            { label: "About Us", path: "#" },
            { label: "Partner with Us", path: "#" },
            { label: "Careers", path: "#" },
        ],
    },
    {
        title: "LEGAL",
        links: [
            { label: "Terms of Service", path: "#" },
            { label: "Privacy Policy", path: "#" },
            { label: "Cookies", path: "#" },
        ],
    },
];
     const socialLinks = [
    { icon: GlobeIcon, href: "#" },
    { icon: Share2Icon, href: "#" },
    { icon: MailIcon, href: "#" },
];
     const bottomLinks = [
    { label: "Terms", path: "#" },
    { label: "Privacy", path: "#" },
];
     const cuisines = [
    { name: "Italian", icon: UtensilsCrossedIcon, label: "ITALIAN" },
    { name: "Japanese", icon: FishIcon, label: "SUSHI" },
    { name: "French", icon: CroissantIcon, label: "FRENCH" },
    { name: "Rooftop", icon: Building2Icon, label: "ROOFTOP" },
    { name: "Steakhouse", icon: BeefIcon, label: "STEAKHOUSE" },
    { name: "Vegetarian", icon: LeafIcon, label: "VEGETARIAN" },
];
    const dummyUser = {
    
    name: "Alex Mercer",
    email: "alex@example.com",
    phone: "+01234567788",
    role: "owner",
    
};

const restaurantData = [
    {
        
        name: "L'Essence",
        slug: "l-essence",
        description:
            "An intimate, Parisian-inspired fine dining chamber wrapped in dark velvet and soft golden candle glow. L'Essence specializes in meticulous plating of haute gastronomy, creating a rich sensory dialogue between modern culinary innovation and classic romance.",
        cuisine: "French",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 88,
        location: "Manhattan, NY",
        address: "115 Greenwich St, New York, NY 10006",
        image: "/restaurant_5.png",
        chef: "Jean-Luc Picard",
        tags: ["Romantic", "Velvet Booths", "Candlelit", "Haute Cuisine"],
        availableSlots: ["18:00", "19:00", "20:00", "21:00", "22:00"],
        featured: true,
        exclusive: false,
       
        
    },
    {
        
        name: "Terraza Cielo",
        slug: "terraza-cielo",
        description:
            "A sun-drenched rooftop oasis celebrating Italian and Mediterranean lifestyles. Featuring floor-to-ceiling foliage, white marble bistro tables, and panoramic skyline views, Terraza Cielo serves hand-crafted pastas and coastal seafood paired with bright botanical cocktails.",
        cuisine: "Italian",
        priceRange: "$$$",
        rating: 4.7,
        reviewCount: 205,
        location: "Manhattan, NY",
        address: "244 Fifth Ave Rooftop, New York, NY 10001",
        image: "/restaurant_3.jpg",
        chef: "Elena Rossi",
        tags: ["Rooftop", "Skyline Views", "Handmade Pasta", "Craft Cocktails"],
        availableSlots: ["12:00", "13:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
        featured: true,
        exclusive: false,
        
    },
    {
       
        name: "Kuro Omakase",
        slug: "kuro-omakase",
        description:
            "An atmospheric, moody sanctuary of premium Japanese gastronomy. Seated at a dark, polished basalt-stone counter, guests experience a deeply focused sushi omakase. Chef Kenji Sato translates the freshest seasonal ingredients directly from Tokyo's fish markets into elegant, edible poetry.",
        cuisine: "Japanese",
        priceRange: "$$$$",
        rating: 4.8,
        reviewCount: 92,
        location: "Manhattan, NY",
        address: "18 Orchard St, New York, NY 10002",
        image: "/restaurant_2.jpg",
        chef: "Kenji Sato",
        tags: ["Omakase", "Basalt Counter", "Japanese", "Zen Atmosphere"],
        availableSlots: ["18:00", "20:30"],
        featured: true,
        exclusive: true,
       
    },
    {
        
        name: "Flora Garden",
        slug: "flora-garden",
        description:
            "A bright, airy conservatory celebrating organic, plant-forward gastronomy. Nestled under glass ceilings with floor-to-ceiling botanicals, Flora Garden transforms fresh seasonal crops into delicate, high-end editorial culinary works of art.",
        cuisine: "Vegetarian",
        priceRange: "$$$",
        rating: 4.8,
        reviewCount: 110,
        location: "Manhattan, NY",
        address: "90 Grand St, New York, NY 10013",
        image: "/restaurant_6.png",
        chef: "Chloe Mercer",
        tags: ["Plant-Based", "Glasshouse", "Organic", "Bright & Airy"],
        availableSlots: ["11:30", "13:00", "14:30", "17:30", "19:00", "20:30"],
        featured: false,
        exclusive: false,
        
    },
    {
       
        name: "Ember Grille",
        slug: "ember-grille",
        description:
            "An upscale modern steakhouse with exposed brick walls, leather booths, and warm, industrial-chic pendant lighting. Offering Prime dry-aged cuts grilled over live hickory and cherrywood embers. Gourmet dining elevated into a sophisticated nocturnal experience.",
        cuisine: "Steakhouse",
        priceRange: "$$$$",
        rating: 4.6,
        reviewCount: 142,
        location: "Manhattan, NY",
        address: "320 Bowery, New York, NY 10012",
        image: "/restaurant_1.png",
        chef: "Marcus Vance",
        tags: ["Dry-Aged Beef", "Wood Fire", "Moody Lighting", "Wine Room"],
        availableSlots: ["17:00", "18:00", "19:00", "20:00", "21:00", "22:00"],
        featured: false,
        exclusive: false,
        
    },
    {
      
        name: "L'Artiste",
        slug: "l-artiste",
        description:
            "An avant-garde journey through modern French gastronomy. L'Artiste blends classic French culinary foundations with contemporary visual artistry, resulting in a sensory dining experience that is both theatrical and deeply satisfying. Set in a gorgeous high-ceilinged room with minimal charcoal and gold design language.",
        cuisine: "French",
        priceRange: "$$$$",
        rating: 4.9,
        reviewCount: 124,
        location: "Manhattan, NY",
        address: "420 Mercer St, New York, NY 10003",
        image: "/restaurant_4.png",
        chef: "Jean-Pierre Dubois",
        tags: ["Michelin Star", "Fine Dining", "Tasting Menu", "Romantic"],
        availableSlots: ["17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"],
        featured: true,
        exclusive: true,
       
    },
    
   
];

console.log("Inserting restaurants...");
const updateRestaurantsData = restaurantData.map((restaurant, idx) => {
    const {...restInfo}= restaurant;
    return {
        ...restInfo,
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: ownerUser._id, // Assign the owner user ID to the restaurant
        status: "approved",
        totalSeats: 20 + idx * 5,
    }
})
console.log("Deleting old restaurants...");
await Restaurant.deleteMany({});
console.log("Restaurants after delete:", await Restaurant.countDocuments());

console.log("Inserting restaurants...");
await Restaurant.insertMany(updateRestaurantsData);

console.log("Seeding complete! Disconnecting....");


await mongoose.disconnect();
console.log ("Disconnected from MongoDB");

    } catch (error) {
        console.error("Error seeding data:", error);
    } finally {
        // Close the MongoDB connection
        await mongoose.connection.close();
    }

};
seedData()