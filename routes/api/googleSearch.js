const axios = require("axios");
const router = require("express").Router();

router.get("/", (req, res) => {
  console.log(req.query)
  axios
    .get("https://www.googleapis.com/books/v1/volumes?&printType=books&maxResults=10", { params: req.query} )
    .then((results) => {
      res.json(results.data.items),
      console.log(results.data.items)})
    .catch(err =>{ res.status(422).json(err),console.log(err)});
});

module.exports = router;
//, { params: req.query}{ data: { results } }
//<button id="ydQiDQAAQBAJ" class="btn btn-lg btn-success input-lg">Save to Database</button>