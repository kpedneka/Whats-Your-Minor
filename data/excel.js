"use strict"
const mongoCollections = require("../config/mongoCollections");
const uuid = require('node-uuid');
const courses = mongoCollections.courses;

let exportedMethods = {
    addData(data) {
        if (!data)
            return Promise.reject("No data provided");

        return courses().then((coursesCollection) => {             
                    return coursesCollection.insert(data).then((WriteResult) => {
                        if (WriteResult.nInserted == 0) {
                            return Promise.reject("Could not execute the command");
                        }
                        else {
                            //console.log(`Post saved with id ${newInsertInformation.insertedId}`);
                            return Promise.resolve("success");
                        }
                    });
         });
    },

    printAll() {
        return courses().then((coursesCollection) => {             
                    return coursesCollection.find({major:"Political Science "}).toArray().then((result) => {
                        if (!result) {
                            return Promise.reject("Could not execute the command");
                        }
                        else {
                            //console.log(`Post saved with id ${newInsertInformation.insertedId}`);
                            return Promise.resolve(result);
                        }
                    });
         });
    }
}

module.exports = exportedMethods;