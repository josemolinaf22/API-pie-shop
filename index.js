//Bring in the express server and create application
const express = require("express");
const app = express();
const pieRepo = require("./repos/pieRepo");
const errorHelper = require("./helpers/errorHelpers");
const cors = require("cors");
//use the express router object
let router = express.Router();

// configure cors
app.use(cors());
// configure middleware to support json data parsing in request object
app.use(express.json());

//create get to return a list of all pies
router.get("/", function (req, res, next) {
  pieRepo.get(
    function (data) {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retrieved.",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});
// create get/search?id=n&name=str to search for pies by 'id' and/or 'name'
router.get("/search", function (req, res, next) {
  let searchObject = {
    id: req.query.id,
    name: req.query.name,
  };
  pieRepo.search(
    searchObject,
    function (data) {
      res.status(200).json({
        status: 200,
        statusText: "OK",
        message: "All pies retreived.",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

router.get("/:id", function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        res.status(200).json({
          status: 200,
          statusText: "OK",
          message: "Single pie retrieved",
          data: data,
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "NOT FOUND",
          message: "The pie '" + req.params.id + "' could not be found",
          error: {
            code: "NOT_FOUND",
            message: "The pie '" + req.params.id + "' could not be found",
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});

router.post("/", function (req, res, next) {
  pieRepo.insert(
    req.body,
    function (data) {
      res.status(201).json({
        status: 201,
        statusText: "Created",
        message: "new pie added",
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

router.put("/:id", function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        //attempt to update the data
        pieRepo.update(req.body, req.params.id, function (data) {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: "Pie '" + req.params.id + "' updated.",
            date: data,
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          messsage: "The pie '" + req.params.id + "' could not be found. ",
          error: {
            code: "NOT_FOUND",
            message: "The pie '" + req.params.id + "' could not be found. ",
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});

router.delete("/:id", function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        //attempt to delete the data
        pieRepo.delete(req.params.id, function (data) {
          res.status(200).json({
            status: 200,
            statusText: "OK",
            message: "The pie '" + req.params.id + "' is deleted.",
            data: "Pie '" + req.params.id + "' deleted.",
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusText: "Not Found",
          messsage: "The pie '" + req.params.id + "' could not be found. ",
          error: {
            code: "NOT_FOUND",
            message: "The pie '" + req.params.id + "' could not be found. ",
          },
        });
      }
    },
    function (err) {
      next(err);
    }
  );
});

router.patch("/:id", function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      //attempt to update the data
      pieRepo.update(req.body, req.params.id, function (data) {
        res.status(200).json({
          status: 200,
          statusText: "Ok",
          message: "Pie '" + req.params.id + "' patched.",
          data: data,
        });
      });
    }
  });
});

// configure router so all routes are prefixed with /api/v1
app.use("/api/", router);

// configure exception logger to console
app.use(errorHelper.logErrorsToConsole);
// configure exception logger to file
app.use(errorHelper.logErrorsToFile);
//  configure client error handler
app.use(errorHelper.clientErrorHandler);
// configure catch-all exception middleware last
app.use(errorHelper.errorHandler);

// create server to listen to port 5000
let server = app.listen(5000, function () {
  console.log("Node server is running on http://localhost:5000..");
});
