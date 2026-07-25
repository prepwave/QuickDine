import { Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import Restaurant from "../models/Restaurants.js";
import cloudinary from "../config/cloudinary.js";
console.log("Cloudinary Config:");
console.log(cloudinary.config());
import Booking from "../models/Booking.js";

// Helper Function to upload buffer to cloudinary
const uploadToCloudinary = async (
  fileBuffer: Buffer
): Promise<{ secure_url: string }> => {
  try {
    console.log("Uploading image to Cloudinary...");

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "QuickDine",
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Upload Error:", error);
              return reject(error);
            }

            if (!result) {
              return reject(new Error("Upload failed"));
            }

            resolve(result);
          }
        )
        .end(fileBuffer);
    });

    console.log("Upload Success:", result.secure_url);

    return {
      secure_url: result.secure_url,
    };
  } catch (err) {
    console.error("UPLOAD FAILED");
    console.error(err);
    throw err;
  }
};
// ======================================================
// Get owner's restaurant
// GET /api/owner/restaurant
// ======================================================
export const getOwnerRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const ownerId = req.user?.id;

    if (!ownerId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    const restaurant = await Restaurant.findOne({
      owner: ownerId,
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      restaurant,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// Create owner's restaurant
// POST /api/owner/restaurant
// ======================================================
export const createRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
     console.log("========== CREATE RESTAURANT ==========");
    console.log("req.user =", req.user);
    console.log("req.file =", req.file);
    console.log("req.body =", req.body);


    

    const ownerId = req.user?.id;

    if (!ownerId) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
      return;
    }

    // Check if owner already has a restaurant
    const existingRestaurant = await Restaurant.findOne({
      owner: ownerId,
    });

    if (existingRestaurant) {
      res.status(400).json({
        success: false,
        message: "You already own a restaurant.",
      });
      return;
    }

    const {
      name,
      description,
      cuisine,
      priceRange,
      location,
      address,
      image,
      chef,
      tags,
      availableSlots,
      totalSeats,
    } = req.body;
    console.log(req.file);
    console.log(req.body);
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");
      // handle image
      let imageUrl ="";
      if(req.file){
        const result = await uploadToCloudinary(req.file.buffer);
        imageUrl = result.secure_url;

      }

      // setup parsed tags and slots
      const parsedTags = typeof tags === "string" ? tags.split(",").map((t)=> t.trim()) : tags || [];
      const parsedSlots = typeof availableSlots === "string" ?  availableSlots.split(",").map((s)=> s.trim()) : availableSlots || ["17:00", "18:00","19:00", "20:00", "21:00"];

    const restaurant = await Restaurant.create({
      name,
      slug,
      description,
      cuisine,
      priceRange,
      location,
      address,
      image: imageUrl,
      chef,
      tags: parsedTags,
      availableSlots: parsedSlots,
      totalSeats,
      owner: ownerId,
      featured: false,
      exclusive: false,
      rating: 0,
      reviewCount: 0,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Restaurant submitted successfully. Waiting for admin approval.",
      restaurant,
    });
  } catch (error: any) {
    console.error("===== CREATE RESTAURANT ERROR =====");
  console.error(error);

  if (error.stack) {
    console.error(error.stack);
  }

  res.status(500).json({
    success: false,
    message: error.message,
  });
  }
};

// ======================================================
// Update owner's restaurant
// PUT /api/owner/restaurant
// ======================================================
export const updateOwnerRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findOne({
      owner: req.user?.id,
    });

    if (!restaurant) {
      res.status(404).json({
        success: false,
        message: "Restaurant profile not found",
      });
      return;
    }

    const {
      name,
      description,
      cuisine,
      priceRange,
      location,
      address,
      chef,
      tags,
      availableSlots,
      totalSeats,
    } = req.body;

    // Upload image if provided
    let imageUrl = restaurant.image;

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // Parse tags and slots
    const parsedTags =
      typeof tags === "string"
        ? tags.split(",").map((t: string) => t.trim())
        : tags;

    const parsedSlots =
      typeof availableSlots === "string"
        ? availableSlots.split(",").map((s: string) => s.trim())
        : availableSlots;

    // Update fields
    if (name) {
      restaurant.name = name;
      restaurant.slug = name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    if (description) restaurant.description = description;
    if (cuisine) restaurant.cuisine = cuisine;
    if (priceRange) restaurant.priceRange = priceRange;
    if (location) restaurant.location = location;
    if (address) restaurant.address = address;
    if (chef) restaurant.chef = chef;
    if (totalSeats) restaurant.totalSeats = totalSeats;

    if (parsedTags) restaurant.tags = parsedTags;
    if (parsedSlots) restaurant.availableSlots = parsedSlots;
    if(tags){
      restaurant.tags = typeof tags === "string" ? tags.split(",").map((t)=> t.trim()): tags;
    }
    if(availableSlots){
      restaurant.availableSlots = typeof availableSlots === "string" ? availableSlots.split(",").map((s)=> s.trim()): availableSlots;
    }

 
   // Handle new image upload if any
    
    // Handle new image upload if any
    

    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    const updated = await restaurant.save()
    res.json(updated);

    restaurant.image = imageUrl;

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error: any) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// ======================================================
// Get bookings for owner's restaurants
// GET /api/owner/bookings
// ======================================================
export const getOwnerBookings = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
  const restaurant = await Restaurant.findOne({
    owner: req.user?.id,
  });

  if (!restaurant) {
    res.status(404).json({
      message: "Restaurant profile not found",
    });
    return;
  }

  const bookings = await Booking.find({
    restaurant: restaurant.id,
  })
    .populate("user", "name email phone")
    .sort({
      bookingDate: -1,
      timeSlot: -1,
    });

  res.status(200).json({
    success: true,
    bookings,
  });
} catch (error: any) {
  console.error(error);

  res.status(500).json({
    success: false,
    message: error.message,
  });
}
}

// Update status of a booking 
// PUT / api / owner/booking/:id?status
export const updateBookingStatus = async (req: AuthRequest, res: Response ): Promise<void> => {
  try {
    const { status }= req.body;
    if(!status|| !["confirmed", "cancelled", "completed"].includes(status)){
      res.status(400).json({message: "Please enter a valid booking status "});
      return
    }
    const booking = await Booking.findById(req.params.id)
    if(!booking){
      res.status(404).json({message: "Booking not found"});
      return
    }
    // Verify booking bleongs to the owner's restaurants 
    const restaurant = await Restaurant.findById(booking.restaurant)
    if(!restaurant|| restaurant.owner.toString() !== req.user?._id.toString()){
      res.status(404).json({message: "Not authorized to manage this booking "});
      return
    }
    booking.status = status ;
    await booking.save();
    res.json(booking);

  } 
  catch (error: any) {
    console.error(error);
    res.status(400).json({message: error.message});


  }
}