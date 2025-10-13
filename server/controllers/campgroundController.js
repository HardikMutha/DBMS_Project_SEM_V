import { createCampgroundQuery } from "../models/campground.js";
import { createLocation } from "../models/location.js";
import { createRequestQuery } from "../models/request.js";

export const createCampground = async (req, res) => {
  const { title, description, capacity, type, latitude, longitude, place, price } = req?.body;
  console.log(req.user);
  try {
    const newLocation = await createLocation({ place, longitude, latitude });
    const newCampground = await createCampgroundQuery({
      title,
      description,
      capacity,
      type,
      locId: newLocation?.insertId,
      ownerId: req?.user?.id,
      price,
    });
    await createRequestQuery({ requestedBy: req?.user?.id, campgroundId: newCampground?.insertId });
    return res.status(201).json({ success: true, data: newCampground });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ success: false, message: err?.message || "An Error Occurred" });
  }
};
