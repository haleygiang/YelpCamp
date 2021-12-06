const express = require('express');
const router = express.Router({ mergeParams: true });

const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas")

// middleware
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// add review for a campground 
router.post('/', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const new_review = new Review(req.body.review);
    campground.reviews.push(new_review);
    await new_review.save();
    await campground.save();
    req.flash('success', 'Successfully created a review!')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// delete a review 
router.delete('/:reviewId', catchAsync(async (req, res,) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!')
    res.redirect(`/campgrounds/${id}`)
}))

module.exports = router;