var express = require('express');
var db = require('../config/mongoConnection');
var router = express.Router();
var emailValidator = require('email-validator');
var multer = require('multer');
var uniqid = require('uniqid');
var _ = require('underscore');

router.get('/', function (req, res, next) {
  res.send({ message: 'Success' });
});

function callpython(id) {
  var pypath = `public\\python\\AIinCap.py`;
  var spawn = require('child_process').spawn;
  var process = spawn('python', [pypath, id]);
  process.stdout.on('data', function (data) {
    console.log(data.toString());
  });
}

router.post('/fitmentResults', function (req, res, next) {
  var objectId = req.body.uniqueid;
  console.log(objectId);
  let reqData = {
    _id: objectId,
  };
  const database = db.getDatabase();
  var results = database
    .collection('fitmentResults_collection')
    .find(reqData)
    .toArray(function (err, result) {
      if (result.length > 0) {
        let jsonArray = result[0].fitmentresults;
        //let fitmentresults = JSON.parse(jsonArray);
        let sorted = jsonArray.map(function (item) {
          return {
            Request: item.Request,
            Name_ID: item.Name_ID,
            Rank_y: item.Rank_y,
            fitment: item.fitment,
          };
        });

        let group = sorted.reduce((r, a) => {
          r[a.Request] = [...(r[a.Request] || []), a];
          return r;
        }, {});

        res.send(group);
      }
    });
});

router.post('/apiCollectionFour', function (req, res, next) {
  const UID = req.body.uniqueid;
  const name_ID = req.body.name_ID;
  const database = db.getDatabase();
  var results = database
    .collection('fitmentResults_collection')
    .find({ _id: UID }, { _id: 0, fitmentresults: 1 })
    .toArray(function (err, result) {
      if (result.length > 0) {
        let jsonArray = result[0].fitmentresults;
        //let fitmentresults = JSON.parse(jsonArray);
        let sorted;
        let fitmentresults = _.where(jsonArray, { Name_ID: name_ID });
        if (fitmentresults.length !== 0) {
          sorted = fitmentresults.map(function (item) {
            return {
              Reviews: item.Reviews,
            };
          });
        }
        // if (sorted.length !== 0) {
        //   res.send(sorted);
        // } else {
        //   res.send('Not Found');
        // }
        var resultstwo = database
          .collection('employeeData_collection')
          .find({ Name_ID: name_ID })
          .toArray(function (err, resp) {
            let group;
            if (resp.length !== 0) {
              console.log('group', group);

              let employeedata = resp.map((item) => {
                return {
                  Name_ID: item.Name_ID,
                  Sub_Unit_1: item.Sub_Unit_1,
                  Skill: item.Skill,
                  Skill_Level: item.Skill_Level,
                  Rank: item.Rank,
                };
              });

              group = employeedata.reduce((r, a) => {
                console.log('a', a);
                console.log('r', r);
                r[a.Sub_Unit_1] = [...(r[a.Sub_Unit_1] || []), a];
                return r;
              }, {});
            }
            var resultstwo = database
              .collection('employeeEngagements_collection')
              .find({ Name_ID: name_ID })
              .toArray(function (err, respo) {
                let employeeengagement;
                if (respo.length !== 0) {
                  employeeengagement = respo.map((item) => {
                    return {
                      EngagementName: item.EngagementName,
                      Review: item.Review,
                    };
                  });
                }
                var response = {
                  employeeData_collection: group,
                  employeeEngagements_collection: employeeengagement,
                  fitmentResults_collection: sorted,
                };
                res.send(response);
              });
          });
      }
    });
});

router.post('/updateAppData', function (req, res, next) {
  const database = db.getDatabase();
  var data = req.body;
  var senddata = {
    appData: data,
    CreatedByUser: 'Sravan.Tallozu',
  };

  var results = database
    .collection('demandRequest_collection')
    .insert(senddata, function (err, resp) {
      if (err) {
        throw err;
      } else {
        console.log(JSON.stringify(resp.insertedIds[0]))
        callpython(JSON.stringify(resp.insertedIds[0]))
        res.send({ message: resp });
      }
    });
});

router.post('/giveStatus', (req, res, next) => {
  const UID = req.body.uniqueid;
  console.log(UID)
  const database = db.getDatabase();
  console.log(UID);
  var results = database
    .collection('requestQueue_collection')
    .find({ _id: UID })
    .toArray(function (err, respo) {
      res.send(respo);
      console.log(respo);
    });
});

module.exports = router;
