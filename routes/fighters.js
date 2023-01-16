const express = require("express");
const router = express.Router();
const db = require("../services/db");
const Fighter = require("../models/fighter");
const { ObjectId } = require("mongodb");

router.delete("/:id", async (req, res) => {
  try {
    const deletedFighter = await db.collection("fighters").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    if (deletedFighter.deletedCount === 0) {
      res.status(404).json({ message: "Fighter not found" });
    } else {
      res.status(200).json({ message: "Fighter deleted", deletedFighter });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting fighter", error: err });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.record;
    delete update._id;

    // Delete extra fields that are not present in the fighter model
    Object.keys(update).forEach((key) => {
      if (!(key in Fighter)) {
        delete update[key];
      }
    });

    const updatedFighter = await db.collection("fighters").updateOne(
      {
        _id: new ObjectId(req.params.id),
      },
      { $set: update }
    );
    if (updatedFighter.matchedCount === 0) {
      res.status(404).json({ message: "Fighter not found" });
    } else if (updatedFighter.modifiedCount === 0) {
      res.status(404).json({ message: "No changes detected" });
    } else {
      res.status(200).json({ message: "Fighter updated", updatedFighter });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating fighter", error: err });
  }
});

router.post("/", async (req, res) => {
  try {
    const fighter = Fighter(req.body);
    await fighter.validate();
    await db.collection("fighters").insertOne(fighter);
    res.status(201).json({ message: "Fighter created" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const data = await db
      .collection("fighters")
      .findOne({ _id: ObjectId(req.params.id) });
    if (!data) {
      res.status(404).json({ message: "Fighter not found" });
    } else {
      res.json(data);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const data = await db.collection("fighters").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
