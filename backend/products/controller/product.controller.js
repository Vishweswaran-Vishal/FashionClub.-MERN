import mongoose from "mongoose";
import { Product } from "../model/Product.model.js";
import { rm } from "fs";

export const createProduct = async (req, res) => {
  try {
    if (req.user.role != "admin") {
      return res.status(403).json({
        message: "unauthorised Access",
      });
    }
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      countInStock,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      isFeatured,
      isPublished,
      tags,
    //   dimensions,
      images,
    //   weight,
      sku,
    } = req.body;

    // if(!images) {
    //     return res.status(400).json({
    //         message: "Please select the image",
    //     });
    // }

    const product = await Product.create({
      name,
      description,
      category,
      price,
      discountPrice,
      countInStock,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
    //   dimensions,
    //   weight,
      sku,
      user: req.user._id,
    });
    res.status(201).json({
      message: "Product details added successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// export const fetchAllProducts = async (req, res) => {
//     try {
//         const products = await Product.find();
//         return res.status(200).json({ message: "List of Products", length: products.length, products });
//     } catch (error) {
//         return res.status(500).json({
//             message: error.message,
//         })
//     }
// }

export const fetchAllProducts = async (req, res) => {
  try {
    const {
      collection,
      size,
      color,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      category,
      material,
      brand,
      limit,
    } = req.query;

    let query = {};

    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collection = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = size.includes(",") ? { $in: size.split(",") } : size;
    }

    if (color) {
      query.colors = color.includes(",") ? { $in: color.split(",") } : color;
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;

        default:
          break;
      }
    }

    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json({ length: products.length, products });
  } catch (error) {
    // console.error(error);
    res.status(500).send(error.message);
  }
};

export const bestSeller = async (req, res) => {
  try {
    const product = await Product.findOne().sort({ rating: -1 });

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "No best seller found" });
    }
  } catch (error) {
    // console.error(error);
    res.status(500).send(error.message);
  }
};

export const newArrivals = async (req, res) => {
  try {
    const product = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(product);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const fetchProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }
    const product = await Product.findById(id);

    if (!product) {
      return res.status(400).json({
        message: "Product not found!",
      });
    }
    return res.status(200).json({ message: "Product Detail", product });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const similarProducts = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);

    res.json(similarProducts);
  } catch (error) {
    // console.error(error);
    res.status(500).send(error.message);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }
    const product = await Product.findById(id);

    if (product) {
      const {
        name,
        description,
        price,
        discountPrice,
        countInStock,
        category,
        brand,
        sizes,
        colors,
        collections,
        material,
        gender,
        images,
        isFeatured,
        isPublished,
        tags,
        // dimensions,
        // weight,
        sku,
      } = req.body;

      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.discountPrice = discountPrice || product.discountPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
    //   product.dimensions = dimensions || product.dimensions;
    //   product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      return res.status(400).json({
        message: "Product not found!",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid Product ID",
      });
    }

    if (req.user.role != "admin") {
      return res.status(403).json({
        message: "Unauthorised Access",
      });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(403).json({
        message: "Invalid Product Details",
      });
    }

    // rm(product.image, () => {
    //     console.log("Image Deleted");
    // })

    await product.deleteOne();
    return res.json({
      message: "Product details deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
