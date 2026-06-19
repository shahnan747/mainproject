const express = require("express");
const router = express.Router();
const {
  getStores,
  getStore,
  createStore,
  updateStore,
  deleteStore,
} = require("../controllers/storeController");
const { protect, authorize } = require("../middleware/auth");

router.use(protect);

router.route("/")
  .get(getStores)
  .post(authorize("admin"), createStore);

router.route("/:id")
  .get(getStore)
  .put(authorize("admin"), updateStore)
  .delete(authorize("admin"), deleteStore);

module.exports = router;
