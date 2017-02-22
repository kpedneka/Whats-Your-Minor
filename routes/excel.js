"use strict"
const express = require('express');
const router = express.Router();
var mongoXlsx = require('mongo-xlsx');
const data = require("../data");
const excelData = data.excel;

var data_model = [{ course_no: "01-220-102", course_name: "Introduction to Microeconomics", department: "Economics", requirement: "Yes", upper: "No", lower: "No", major: "Economics" },
{ course_no: "01-220-103", course_name: "Introduction to Macroeconomics", department: "Economics", requirement: "Yes", upper: "No", lower: "No", major: "Economics" }];

var model = mongoXlsx.buildDynamicModel(data_model);


let excelFiles = ["./excel_files/econ.xlsx", "./excel_files/it.xlsx", "./excel_files/pol.xlsx"];

router.get("/", (req, res) => {

    excelData.printAll().then((result) => {
        res.json(result);
    }).catch((e) => {
        res.json(e);
    })
});

router.get("/insert", (req, res) => {
    excelFiles.forEach(function (file) {
        setTimeout(() => {
            mongoXlsx.xlsx2MongoData(file, model, function (err, mongoData) {
                var mongoData = mongoData.filter(function (x) {
                    if (x["course_no"] != null)
                        return x;
                });
                setTimeout(() => {
                    excelData.addData(mongoData).then((result) => {
                        if (result == "success") {
                            console.log(file, "success");
                        }
                    }).catch((e) => {
                        res.json(e);
                    })
                }, 2000);
            });
        }, 2000)
    }, this);
    //res.json("success");
});




module.exports = router;
