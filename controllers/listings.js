const Listing = require("../models/listing");

// ================= INDEX =================
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// ================= RENDER NEW FORM =================
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// ================= SHOW LISTING =================
module.exports.showListing = async (req, res) => { // ✅ FIX: Changed module.exports.index.showListing to module.exports.showListing
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/show.ejs", { listing });
};

// ================= CREATE LISTING =================
module.exports.createListing = async (req, res) => {

    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image={url,filename};

    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// ================= RENDER EDIT FORM =================
module.exports.listingEdit = async (req, res) => { // Note: Named listingEdit here
    let { id } = req.params;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    res.render("listings/edit.ejs", { listing });
};

// ================= UPDATE LISTING =================
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
  let listing= await Listing.findByIdAndUpdate(id, {
        ...req.body.listing,
   
    });
    if(typeof req.file!="undefined"){
     let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save();
    }
    req.flash("success", "Listing Updated");

    res.redirect(`/listings/${id}`);
};

// ================= DESTROY LISTING =================
module.exports.destroyListing = async (req, res) => { // ✅ FIX: Capitalized Destroylisting changed to destroyListing to match standard naming
    let { id } = req.params;

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");

    res.redirect("/listings");
};