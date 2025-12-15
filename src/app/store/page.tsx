"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const products = [
  {
    id: 1,
    name: "Premium Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 299.99,
    category: "Electronics",
    image: "🎧",
  },
  {
    id: 2,
    name: "Smart Watch",
    description: "Track your fitness and stay connected",
    price: 399.99,
    category: "Electronics",
    image: "⌚",
  },
  {
    id: 3,
    name: "Laptop Bag",
    description: "Durable and stylish laptop bag",
    price: 79.99,
    category: "Accessories",
    image: "💼",
  },
  {
    id: 4,
    name: "Coffee Maker",
    description: "Brew perfect coffee every morning",
    price: 149.99,
    category: "Home",
    image: "☕",
  },
  {
    id: 5,
    name: "Running Shoes",
    description: "Comfortable shoes for your daily run",
    price: 129.99,
    category: "Sports",
    image: "👟",
  },
  {
    id: 6,
    name: "Desk Lamp",
    description: "Modern LED desk lamp with adjustable brightness",
    price: 59.99,
    category: "Home",
    image: "💡",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
};

export default function StorePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-purple-500/5">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold flex items-center gap-3 mb-2">
            <ShoppingBag className="text-purple-500" />
            Store
          </h1>
          <p className="text-muted-foreground">
            Browse our collection of premium products
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={item}>
              <Card className="h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="text-6xl mb-4 text-center">
                    {product.image}
                  </div>
                  <CardTitle>{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <Badge variant="secondary">{product.category}</Badge>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <Button>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
