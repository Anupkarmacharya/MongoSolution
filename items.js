/*
  Copyright (c) 2008 - 2016 MongoDB, Inc. <http://mongodb.com>
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');
function ItemDAO(database) {
    "use strict";
    this.db = database;
    this.getCategories = function(callback) {
        "use strict";
        /*
        * TODO-lab1A
        *
        * LAB #1A:
        * Create an aggregation query to return the total number of items in each category. The
        * documents in the array output by your aggregation should contain fields for
        * "_id" and "num". HINT: Test your mongodb query in the shell first before implementing
        * it in JavaScript.
        *
        * Ensure categories are organized in alphabetical order before passing to the callback.
        *
        * Include a document for category "All" in the categories to pass to the callback. All
        * should identify the total number of documents across all categories.
        *
        */
        var categories = [];
      var allNum = 0;
     var query =  database.collection('item').aggregate([{$group: {_id: "$category", num: {$sum: 1}}}, {$sort: {_id: 1}}]).toArray(
          function(err, dcs){
            // assert.equal(err,null);
            // assert.notEqual(dcs.length,0);
            dcs.forEach(function(dc){
              allNum += dc.num;
              // dc.unshift({_id: 'All', num: allNum});
                  categories.push(dc);
            });
            categories.unshift({_id: 'All', num: allNum});
              callback(categories);
          }
        );
    }
    this.getItems = function(category, page, itemsPerPage, callback) {
        "use strict";
        /*
         * TODO-lab1B
         *
         * LAB #1B:
         * Create a query to select only the items that should be displayed for a particular
         * page. For example, on the first page, only the first itemsPerPage should be displayed.
         * Use limit() and skip() and the method parameters: page and itemsPerPage to identify
         * the appropriate products. Pass these items to the callback function.
         *
         * Do NOT sort items.
         *
         */
        //
        // var pageItem = this.createDummyItem();
        var pageItems = [];
        // console.log("cat",category, "itemsPerPage", itemsPerPage);
        // for (var i=0; i<5; i++) {
        //     pageItems.push(pageItem);
        // }
        //  var pageSize= 2;
        //  var query = this.db.collection("item").find("category").skip(page * itemsPerPage).limit(itemsPerPage);

        if(category == "All"){
        this.db.collection("item").find({},{"title":1,_id:0,img_url:1}).skip(page * itemsPerPage).limit(itemsPerPage).toArray(function(err, pageItem) {
          // assert.equal(err,null);
          // assert.notEqual(pageItem.length,0);
          callback(pageItem);
        });
      } else {
        this.db.collection("item").find({"category":category}).skip(page * itemsPerPage).limit(itemsPerPage).toArray(function(err, pageItem) {
          // assert.equal(err,null);
          // assert.notEqual(pageItem.length,0);
          callback(pageItem);
        });
      }
        //  console.log("query",this.db.collection("item").find({$category:"All"}).skip(page * itemsPerPage).limit(itemsPerPage));
        // TODO-lab1B Replace all code above (in this method).
        // callback(pageItems);
    }
    this.getNumItems = function(category, callback) {
        "use strict";
        var numItems = 0;
        /*
         * TODO-lab1C
         *
         * LAB #1C: Write a query that determines the number of items in a category and pass the
         * count to the callback function. The count is used in the mongomart application for
         * pagination. The category is passed as a parameter to this method.
         *
         * See the route handler for the root path (i.e. "/") for an example of a call to the
         * getNumItems() method.
         *
         */
         if(category == "All"){
         var query = this.db.collection("item").find().toArray(
           function(err, dcs) {
             dcs.forEach(function(dc){
               numItems += 1;
             })
           // assert.equal(err,null);
           // assert.notEqual(pageItem.length,0);
           callback(numItems);
         });
         return;
       }
         var query =  this.db.collection('item').find({"category":category}).toArray(
              function(err, dcs){
                // assert.equal(err,null);
                // assert.notEqual(dcs.length,0);
                dcs.forEach(function(dc){
                  numItems += 1;
                  //console.log("dc", numItems);
                  // numItems += dc.numItems;
                      // categories.push(dc);
                });
                // categories.unshift({_id: 'All', num: allNum});
                  callback(numItems);
              }
            );

    }
    this.searchItems = function(query, page, itemsPerPage, callback) {
        "use strict";
        /*
         * TODO-lab2A
         *
         * LAB #2A: Using the value of the query parameter passed to this method, perform
         * a text search against the item collection. Do not sort the results. Select only
         * the items that should be displayed for a particular page. For example, on the
         * first page, only the first itemsPerPage matching the query should be displayed.
         * Use limit() and skip() and the method parameters: page and itemsPerPage to
         * select the appropriate matching products. Pass these items to the callback
         * function.
         *
         * You will need to create a single text index on title, slogan, and description.
         *
         */

        // var item = this.createDummyItem();
        var items = [];

        var query = this.db.collection('item').find( {$or:[{title:{$regex:query}},{slogan:{$regex:query}},{description:{$regex:query}}]}).skip(page * itemsPerPage).limit(itemsPerPage).toArray(
          // db.item.find()
            function(err, dcs){

            // assert.equal(err,null);
            // assert.notEqual(dcs.length,0);
            //console.log("itemsPerPage", dcs);
            dcs.forEach(function(dc){
              // dc.unshift({_id: 'All', num: allNum});
                  items.push(dc);
            });
              callback(items);
          }
        );

        // for (var i=0; i<5; i++) {
        //     items.push(item);
        // }
        // // TODO-lab2A Replace all code above (in this method).
        // callback(items);
    }
    this.getNumSearchItems = function(query, callback) {
        "use strict";
        var numItems = 0;

        /*
        * TODO-lab2B
        *
        * LAB #2B: Using the value of the query parameter passed to this method, count the
        * number of items in the "item" collection matching a text search. Pass the count
        * to the callback function.
        *
        */

        var valuee = this.db.collection('item').find( {$or:[{title:{$regex:query}},{slogan:{$regex:query}},{description:{$regex:query}}]}).toArray(function(err, docs){

            docs.forEach(function(doc){
              numItems += 1;
            });
            callback(numItems);
        });


    }
    this.getItem = function(itemId, callback) {
        "use strict";
        /*
         * TODO-lab3
         *
         * LAB #3: Query the "item" collection by _id and pass the matching item
         * to the callback function.
         *
         */
         var item = [];

         this.db.collection('item').find({_id:itemId}).toArray(function(err, docs){

           docs.forEach(function(doc){

             callback(doc);
             //item.push(doc);
           });
           //var item = this.createDummyItem();
           // TODO-lab3 Replace all code above (in this method).

           //console.log("Im the one who knowks",docs);

         });

    }
    this.getRelatedItems = function(callback) {
        "use strict";
        this.db.collection("item").find({})
            .limit(4)
            .toArray(function(err, relatedItems) {
                assert.equal(null, err);
                callback(relatedItems);
            });
    };
    this.addReview = function(itemId, comment, name, stars, callback) {
        "use strict";
        /*
         * TODO-lab4
         *
         * LAB #4: Add a review to an item document. Reviews are stored as an
         * array value for the key "reviews". Each review has the fields: "name", "comment",
         * "stars", and "date".
         *
         */
        var reviewDoc = {
            name: name,
            comment: comment,
            stars: stars,
            date: Date.now()
        }
        // var dummyItem = this.createDummyItem();
        // dummyItem.reviews = [reviewDoc];

        //Using $push
        var comments = this.db.collection('item').updateOne({_id:itemId}, {$push:{reviews:reviewDoc}});

        //Using $addToSet
        //var comments = this.db.collection('item').updateOne({_id:itemId}, {$addToSet:{reviews:reviewDoc}});

        //Using $set
        //db.item.updateOne({_id:12}, {$set:{reviewsd:[{name:"shirshak", class:15}]}})


      // Using $push
      // {$push:{reviews:{name:"shirshak", email:"shirshak@shirshak.com"}}}

      // Using $addToSet
      // db.item.updateOne({_id:8},{$addToSet:{reviews:{name:"shirshak", test:"shirshak@shirshak.com"}}})

        callback(comments);
    }
    // this.createDummyItem = function() {
    //     "use strict";
    //     var item = {
    //         _id: 1,
    //         title: "Gray Hooded Sweatshirt",
    //         description: "The top hooded sweatshirt we offer",
    //         slogan: "Made of 100% cotton",
    //         stars: 0,
    //         category: "Apparel",
    //         img_url: "/img/products/hoodie.jpg",
    //         price: 29.99,
    //         reviews: []
    //     };
    //     return item;
    // }
}
module.exports.ItemDAO = ItemDAO;
