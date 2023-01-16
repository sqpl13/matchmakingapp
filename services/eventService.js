const eventService = (db) => {
  const changeFights = db.collection("fights").watch();

  changeFights.on("change", (event) => {
    if (event.operationType === "insert") {
      const newFight = event.fullDocument;
      if (newFight.event_id) {
        db.collection("events").findOneAndUpdate(
          { _id: newFight.event_id },
          { $push: { fights: newFight } }
        );
      }
    }
  });
};

module.exports = eventService;
