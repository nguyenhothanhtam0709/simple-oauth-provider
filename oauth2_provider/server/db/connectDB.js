require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose.set("useFindAndModify", false);
// mongoose.set("useCreateIndex", true);
mongoose.set("strictQuery", true);
