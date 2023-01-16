const express = require("express");
const router = express.Router();
const db = require("../services/db");
const Event = require("../models/event");
const { ObjectId } = require("mongodb");

router.delete("/:id", async (req, res) => {
  try {
    const deletedEvent = await db.collection("events").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (deletedEvent.deletedCount === 0) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.status(200).json({ message: "Event deleted", deletedEvent });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting event", error: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update._id;
    let convertedDate = new Date(update.date);
    if (update.date && convertedDate < new Date()) {
      res.status(400).json({ message: "Event date cannot be in the past" });
    } else {
      const updatedEvent = await db.collection("events").updateOne(
        {
          _id: new ObjectId(req.params.id),
        },
        { $set: update }
      );
      if (updatedEvent.matchedCount === 0) {
        res.status(404).json({ message: "Event not found" });
      } else if (updatedEvent.modifiedCount === 0) {
        res.status(404).json({ message: "No changes detected" });
      } else {
        res.status(200).json({ message: "Event updated", updatedEvent });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating event", error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    const eventWithSameName = await db.collection("events").findOne({ name });
    if (eventWithSameName) {
      res.status(400).json({ message: "Event with same name already exists" });
    } else {
      const event = Event(req.body);
      await event.validate();
      await db.collection("events").insertOne(event);
      res.status(201).json({ message: "Event created" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await db
      .collection("events")
      .findOne({ _id: ObjectId(req.params.id) });
    if (!data) {
      res.status(404).json({ message: "Event not found" });
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await db.collection("events").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
