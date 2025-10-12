import { createLocation, getPlaceLocation, deleteLocation } from "../models/location.js"

export const CreateLocation = async (req, res) => {
  const { place, longitude, latitude } = req.body;
  if (!place || !longitude || !latitude) {
    return res.status(400).json({ success: false, error: "Place, longitude and latitude are required" });
  }
  try {
    const result = await createLocation({ place, longitude, latitude });
    res.status(201).json({ success: true, message: `location ${place} created` });
  } catch (error) {
    console.error(error?.message);
    if (error?.code == "ER_DUP_ENTRY") {
      return res.status(409).json({ success: false, error: "Location already exists" });
    }
    res.status(500).json({ succes: false, error: error?.message || "Internal server error" });
  }
};

export const GetPlaceLocation = async (req, res) => {
  const { place } = req.body;
  if (!place) {
    return res.status(400).json({ success: false, error: "Place is required" });
  }
  try {
    const result = await getPlaceLocation(place);
    if (!result) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }
    res.status(200).json({ success: true, data: { longitude: result?.longitude, latitude: result?.latitude }});
  } catch (error) {
    console.error(error?.message);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
};

export const DeleteLocation = async (req, res) => {
  const { place } = req.body;
  if (!place) {
    res.status(400).json({ success: false, error: "Place, longitude and latitude are required" });
  }
  try {
    let result = await getPlaceLocation(place);
    if (!result) {
      return res.status(404).json({ success: false, error: "Place not found" });
    }
    result= await deleteLocation(place);
    return res.status(200).json({ success: true, data: { message: `Place ${place} deleted` }});
  } catch (error) {
    console.error(error?.message);
    return res.status(500).json({ success: false, error: error?.message || "Internal server error" });
  }
};
