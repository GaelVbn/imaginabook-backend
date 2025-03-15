import Review from "../models/Review.js";

export const createReview = async (req, res) => {
  const { name, rating, comment } = req.body;

  if (!name || !rating || !comment) {
    return res.status(400).send({ error: "All fields are required." });
  }

  try {
    const review = new Review({ name, rating, comment });
    await review.save();
    res.status(201).send("Review created successfully.");
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(400).send({ error: "Error creating review." });
  }
};
