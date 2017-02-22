"use strict"
const excelRoutes = require("./excel");

const constructorMethod = (app) => {
  //  app.use("/login", loginRoutes);     // login and register for app
    // app.use("/posts", postRoutes);      // dislpay posts, make a post, main page
    // app.use("/signin", signIn);         // sign in to facebook/twitter (no views)

    // app.use("/excel", (req, res) => {

    //     /* Read Economics */
    //     mongoXlsx.xlsx2MongoData("./excel_files/econ.xlsx", model, function (err, mongoData) {
    //         var mongoData = mongoData.filter(function (x) {
    //             if(x["course_no"]!=null)
    //             return x;
    //         });
    //     });

    //          /* Read IT */
    //     mongoXlsx.xlsx2MongoData("./excel_files/it.xlsx", model, function (err, mongoData) {
    //         var mongoData = mongoData.filter(function (x) {
    //             if(x["course_no"]!=null)
    //             return x;
    //         });
    //     });

    //          /* Read Pol */
    //     mongoXlsx.xlsx2MongoData("./excel_files/pol.xlsx", model, function (err, mongoData) {
    //         var mongoData = mongoData.filter(function (x) {
    //             if(x["course_no"]!=null)
    //             return x;
    //         });
    //     });
    // })

     app.use("/excel", excelRoutes); 

    app.use("*", (req, res) => {
        res.redirect(`/posts`);
    })
};

module.exports = constructorMethod;
