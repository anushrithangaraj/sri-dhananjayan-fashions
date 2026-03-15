// backend/src/seed/seedProducts.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import connectDB from '../config/db.js';

dotenv.config();
connectDB();

const sampleProducts = [
    // Men's Collection
    {
        name: "Classic Navy Blue Blazer",
        description: "Elegant navy blue blazer perfect for formal occasions. Made from premium wool blend fabric.",
        price: 8999,
        categories: ["Men"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["Navy Blue", "Black"],
        images: [
            "https://picsum.photos/300/400?random=1"
        ],
        stock: 25,
        rating: 4.5,
        numReviews: 128,
        discount: 10,
        isFeatured: true
    },
    {
        name: "Premium White Cotton Shirt",
        description: "Classic white formal shirt made from Egyptian cotton. Breathable and comfortable.",
        price: 2499,
        categories: ["Men"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["White", "Light Blue", "Pink"],
        images: [
            "https://picsum.photos/300/400?random=2"
        ],
        stock: 50,
        rating: 4.3,
        numReviews: 95,
        discount: 0,
        isFeatured: true
    },
    {
        name: "Slim Fit Black Jeans",
        description: "Modern slim fit black jeans with stretchable fabric for maximum comfort.",
        price: 3499,
        categories: ["Men"],
        sizes: ["28", "30", "32", "34", "36"], // These now match the enum
        colors: ["Black", "Dark Blue"],
        images: [
            "https://picsum.photos/300/400?random=3"
        ],
        stock: 35,
        rating: 4.4,
        numReviews: 67,
        discount: 15
    },
    {
        name: "Casual Linen Shirt",
        description: "Lightweight linen shirt perfect for summer. Breathable and stylish.",
        price: 1999,
        categories: ["Men"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Beige", "Light Blue", "Olive"],
        images: [
            "https://picsum.photos/300/400?random=4"
        ],
        stock: 30,
        rating: 4.2,
        numReviews: 42,
        discount: 5
    },

    // Women's Collection
    {
        name: "Floral Print Maxi Dress",
        description: "Beautiful floral print maxi dress with flowing silhouette. Perfect for summer parties.",
        price: 4599,
        categories: ["Women"],
        sizes: ["XS", "S", "M", "L", "XL"],
        colors: ["Multi-color", "Blue", "Pink"],
        images: [
            "https://picsum.photos/300/400?random=5"
        ],
        stock: 20,
        rating: 4.7,
        numReviews: 156,
        discount: 20,
        isFeatured: true
    },
    {
        name: "Elegant Evening Gown",
        description: "Stunning evening gown with sequin details. Perfect for special occasions.",
        price: 12999,
        categories: ["Women"],
        sizes: ["S", "M", "L"],
        colors: ["Black", "Red", "Navy"],
        images: [
            "https://picsum.photos/300/400?random=6"
        ],
        stock: 10,
        rating: 4.8,
        numReviews: 43,
        discount: 10,
        isFeatured: true
    },
    {
        name: "Designer Kurti Set",
        description: "Traditional embroidered kurti with matching dupatta. Handcrafted details.",
        price: 3999,
        categories: ["Women"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Maroon", "Green", "Yellow"],
        images: [
            "https://picsum.photos/300/400?random=7"
        ],
        stock: 25,
        rating: 4.5,
        numReviews: 89,
        discount: 0
    },
    {
        name: "Cotton Palazzo Set",
        description: "Comfortable cotton palazzo suit set with trendy design.",
        price: 2999,
        categories: ["Women"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["Blue", "Pink", "Purple"],
        images: [
            "https://picsum.photos/300/400?random=8"
        ],
        stock: 40,
        rating: 4.3,
        numReviews: 62,
        discount: 5
    },

    // Kids Collection
    {
        name: "Kids Party Wear Set",
        description: "Cute party wear set for boys. Includes shirt and trousers.",
        price: 1899,
        categories: ["Kids"],
        sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"],
        colors: ["Blue", "Black", "Red"],
        images: [
            "https://picsum.photos/300/400?random=9"
        ],
        stock: 30,
        rating: 4.4,
        numReviews: 38,
        discount: 10,
        isFeatured: true
    },
    {
        name: "Frocks for Girls",
        description: "Beautiful frock with lace details. Perfect for parties and celebrations.",
        price: 1599,
        categories: ["Kids"],
        sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
        colors: ["Pink", "Peach", "White"],
        images: [
            "https://picsum.photos/300/400?random=10"
        ],
        stock: 35,
        rating: 4.5,
        numReviews: 47,
        discount: 0,
        isFeatured: true
    },
    {
        name: "Casual Wear Set",
        description: "Comfortable casual wear set for everyday use.",
        price: 1299,
        categories: ["Kids"],
        sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y"],
        colors: ["Multicolor", "Blue", "Green"],
        images: [
            "https://picsum.photos/300/400?random=11"
        ],
        stock: 45,
        rating: 4.2,
        numReviews: 29,
        discount: 5
    },
    {
        name: "Traditional Kids Wear",
        description: "Adorable traditional outfit for festivals and functions.",
        price: 2299,
        categories: ["Kids"],
        sizes: ["2-3Y", "3-4Y", "4-5Y", "5-6Y", "6-7Y"],
        colors: ["Maroon", "Gold", "Green"],
        images: [
            "https://picsum.photos/300/400?random=12"
        ],
        stock: 20,
        rating: 4.6,
        numReviews: 33,
        discount: 15
    }
];

const seedProducts = async () => {
    try {
        // Clear existing products
        await Product.deleteMany();
        console.log('Products cleared');

        // Check if admin user exists, if not create one
        const adminExists = await User.findOne({ role: 'admin' });
        if (!adminExists) {
            await User.create({
                name: 'Admin',
                email: 'admin@dhananjayan.com',
                password: 'admin123',
                role: 'admin'
            });
            console.log('Admin user created');
        }

        // prepare products: if a product has colors and no stockByColor,
        // create entries using the existing stock value
        const preparedProducts = sampleProducts.map(prod => {
            if (!prod.stockByColor && Array.isArray(prod.colors) && prod.colors.length > 0) {
                prod.stockByColor = prod.colors.map(c => ({ color: c, stock: prod.stock || 0 }));
            }
            return prod;
        });

        // Insert sample products
        await Product.insertMany(preparedProducts);
        console.log('Sample products inserted successfully');
        console.log(`Total products: ${preparedProducts.length}`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

seedProducts();