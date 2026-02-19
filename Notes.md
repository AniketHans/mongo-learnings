# Mongo

1. MongoDB is:-
   1. Document oriented
   2. NoSQL DBMS
   3. Schemaless documents
2. In Mongo, we create Databases. Each database has multiple collections(similar to tables in SQL). In each collection, we have multiple documents (similar to rows in a table). The document contains the data in BSON format.
3. BSON = Binary representation of JSON. BSON is used for high read and write speeds and reduced storage requirements
4. MongoDB has a server that connects with the outside application and a storage engine which performs reading and writing of file in database. Mongo server recieves the CRUD operation commands and forward them to storage engine. Storage engine performs JSON -> BSON and BSON -> JSON conversion in case of write and read respectively and saves and retrieves data from database.

## Commands:

### Database and Collection creation and deletion

1. `show dbs` or `show databases`: show database
2. `use <database-name>`: create a database or if exists you will start using the database. Until you have a collection in your database, it will not be shown in show databases command
3. `db.dropDatabase()`: It will drop the existing database
4. `show collections`: shows the created collections in current database
5. `db.createCollection(<name>)`: it creates a collection in the current db
6. `db.<collection-name>.drop()`: It deletes the mentioned collection in the current database

### Collection CRUD

1. `db.<collection-name>.insertOne({field1: value1, field2: value2})`: Insert a single document into the collection
2. `db.<collection-name>.insertMany([{field1: value1, field2: value2},{field1: value1, field2: value2}])`: Insert a multiple documents into the collection at once

   > Note: MongoDB attaches a unique \_id (ObjectId) to all the documents in a collection. This \_id can be used to unique identify a document, query on it and in indexing as well

   > While adding fields with name containing, special characters or spaces or starts with numeric digit etc, using quotes('') is necessary. For eg, insertOne({'full name': "Haha singh"}). Best practice is to always use quotes while entering the field names

   > Ordered and Unordered inserts: When you try to use insertMany([doc1, doc2]), also known as Batch Writes, the default behaviour is ordered inserts.

   > In ordered inserts, suppose you have 3 documents to insert in a batch, [doc1, doc2, doc3], but doc2 has some error. When you try to insert using `db.<collection>.insertMany([doc1, doc2, doc3])`, doc1 will be inserted and you will get an error when trying to insert doc2 and remaining docs will also not be inserted. This means in ordered inserts, the insertion stops when an error is occured

   > In unordered inserts, all the correct docs will be inserted and all the docs that have any error will not be inserted. To enable this, `db.<collection>.insertMany([doc1, doc2, doc3], {ordered: false})`

3. `db.<collection-name>.find()`: It returns all the documents available in a collection as an array
4. `db.<collection-name>.find({key1:value1, key2: value2})`: It returns all the documents available in a collection as an array matching the given key value pairs
5. `db.<collection-name>.findOne({key1:value1, key2: value2})`: It returns a document matching the given key value pairs

   > Importing data from external json file: (Note --> mongodb database tools is necessary to perform the below actions)

   > File where json data is not present as array of objects: `mongoimport <file-path> -d <database-name> -c <collection-name>`.............................. eg: `mongoimport C:\Users\anike\Desktop\Projects\mongo-learnings\data-generation\products.json -d ecom -c products`

   > File where json data is present as array of objects: `mongoimport <file-path> -d <database-name> -c <collection-name> --jsonArray`......................eg: `mongoimport C:\Users\anike\Desktop\Projects\mongo-learnings\data-generation\categories.json -d ecom -c categories --jsonArray`

   > Exporting data from a collection as json objects in json file:` mongoexport -d <database> -c <collection> -o <file-path>`.............................. eg,`mongoexport -d students -c student_info -o C:\Users\anike\Desktop\Projects\mongo-learnings\data-generation\student-info.json`

   > Import file has a size limit of 16 MB

6. Comparison Operators:
   1. The comparison operators are:
      1. `$eq`: equal to
      2. `$ne`: not equal to
      3. `$gt`: greater than
      4. `$gte`: greater than equal to
      5. `$lt`: less than
      6. `$lte`: less than equal to
      7. `$in`: in
      8. `$nin`: not in
   2. Syntax: `db.<collection-name>.find({key: {$operator: value}})`
      1. Eg:
         1. `db.products.find({'categoryId':{$eq: 15}})`
         2. `db.products.find({'categoryId':{$in: [15,10,2]}})`
7. Cursors:
   1. Cursors in MongoDB are used to efficiently retrieve large result sets from queries, providing control over the data retrieval process
   2. MongoDB retrieves query results in batches using cursors
   3. Cursors are a pointer to the results set on the server from the given query
   4. Cursors are used to iterate through query results
   5. MongoDB retrieves query result in batches
   6. Default batch size is 101 documents
   7. Cursor methods:
      1. **count()**
         1. `db.products.find({'categoryId':{$eq: 15}}).count()` // count the total results
      2. **limit()**
         1. `db.products.find({'categoryId':{$eq: 15}}).limit(4)` // only return 4 results
      3. **skip()**
         1. `db.products.find({'categoryId':{$eq: 15}}).limit(4).skip(2)` // skips the first 2 documents from the results set
      4. **sort()**
         1. 1 means ascending order and -1 means descsending order
         2. `db.products.find({'categoryId':{$in: [2,5,10]}}).sort({categoryId: 1, rating: -1})` // first sort by price in acsending order and then by rating in descending order.
8. Logical Operators:
   1. `$and`
      1. `{$and: [ {condition1}, {condition2}, ....] }`
      2. Eg: `db.products.find({$and: [{price: {$gt: 100}}, {rating: {$eq: 3}}]}).limit(1)`
         1. Getting document where price>100 and rating==3
   2. `$or`
      1. `{$or: [ {condition1}, {condition2}, ....] }`
      2. Eg: `db.products.find({$or: [{price: {$gt: 100}}, {rating: {$eq: 3}}]}).limit(1)`
         1. Getting document where price>100 or rating==3
   3. `$not`
      1. `{key: {$not: {operator: value}}}`
      2. Eg: `db.products.find({price: {$not: {$gt: 100}}}).limit(5)`
         1. Getting documents where prices not > 100
   4. `$nor`
      1. `{$nor: [ {condition1}, {condition2}, ....] }`
      2. Eg: `db.products.find({$nor: [{price: {$gt: 100}}, {rating: {$gt: 2}}]}).limit(5)`
         1. Getting documents where neither (price>100 or rating>2)
9. `$expr`:
   1. This operator allows using aggregation expressions within a query
   2. This is also useful when you need to compare fields from same documnet in a more complex manner
   3. Syntax: `{$expr: {$operator: [ '$field', value ]}}`
      1. `db.products.find({$expr:{$gt:[{$multiply: ['$rating','$stock']}, '$price']}}).limit(5)`
      2. Just fetching all the products where, rating \* stock > price
10. Elements Operator:
    1. `$exists`
       1. Fetchs all the documents where the given key/field exists
       2. `{ field: { $exists: <boolean> }}`
          1. Eg: `db.products.find({"huihi": {$exists:true}}).limit(5)`
    2. `$type`
       1. Fetches all teh documnets where a particular key/field has value of the mentioned type
       2. `{ field: { $type: <bson-data-type> }}`
          1. Eg: `db.products.find({"price": {$type:"number"}}).limit(1)`
    3. `$size`
       1. Fetches all the documents where the key/field has an array as value and the size if the array is equal to the mentioned value
       2. `{field: {$size: <array-length>}}`
          1. Eg: `db.comments.find({"comments": {$size:5}}).limit(1)`
11. Projection:
    1. This is used to either show some speific fields in th result or remove some specific fields from the result
    2. Syntax: `db.<collection>.find({}, { field1: 1, field2: 1 })`
    3. Here, 1 is used to include a field in the result and 0 is used to exclude a field in the result.
    4. You cannot include and exclude fields in same query means you can either have `{ field1: 1, field2: 1, ... }` or `{ field1: 0, field2: 0, ... }`
    5. Here, `_id` field is an exception, you can exclude and include it in any query. It means both `{ field1: 1, field2: 1, _id: 0, ... }` and `{ field1: 0, field2: 0, _id: 1 ... }` are valid.
    6. Eg:
       1. `db.comments.find({comments: {$size: 5}},{"comments": 1, "author": 1})`, it returns comments, author and \_id from each document.
       2. `db.comments.find({comments: {$size: 5}},{"comments": 1, "author": 1, "_id":0})` this removes the \_id from the result
       3. `db.comments.find({comments: {$size: 5}},{"comments": 0, "author": 0})`, this returns all the fields except comments and author from each document
       4. `db.comments.find({comments: {$size: 5}},{"comments": 1, "author": 0})`, This is **invalid**. You can either have all the inclusion operations or all the exclusion opeartions. Not a mix of these. \_id is an exception here.
12. Embedded documents:
    1. When keys in a document contain other objects or array of objects as values then we refer the document as nested document
    2. For querying inside nested documents use dot(.) notations
       1. Syntax: `db.<collection>.find({ "parent.child": value })`
       2. Eg: `db.comments.find({"comments.user": "Ava"})`, find all the comments where `comments : [{user: "Ava"}]`
       3. `db.comments.find({ "metadata.views": { $gt: 100 } })` , find all the comments where `metadata : {views : value > 100}`
    3. `$all`:
       1. This operator selects the document where the value of a field is an array that contains all the specified elements
       2. Syntax: `{<field> : { $all: [ value1, value2, ... ]}}`
          1. `db.comments.find({"comments.user": {$all: ["Ava", "Noah"]}})`, this returns the document having both values for the key
    4. `$elemMatch`:
       1. This operator selects the document where the value of a field is an array with at least one element that matches all the specified query criterias
       2. This is used when you are trying to query multiple keys in an array of object
       3. Syntax: `{<field> : { $eleMatch: { <query1>, <query2>, ... }}}`
          1. `db.comments.find({"comments": { $elemMatch: { "user": "Ava", "text": "Helped optimize my queries." }}})`, here we were querying comments.user and comments.text
13. Update Operations:
    1. Here, we use `$set` operator
    2. `updateOne()`
       1. Syntax: `db.<collection-name>.updateOne( { filter }, { $set: { existingField: newValue, newField: value } } )`
          1. Eg: `db.categories.updateOne({"name":"Category 1"},{$set: {"description":"This is decription of Category 1", "topSelling":true}})`, updated description and added new field topSelling where the category name is "Category 1"
    3. `updateMany()`
       1. Syntax: `db.<collection-name>.updateMany( { filter }, { $set: { existingField: newValue, newField: value } } )`
          1. `db.categories.updateMany({"name":{$exists: true}},{$set: {"offer":"BOGO"}})`, added new offer field to all the documents where name field exists in them
    4. `$unset`:
       1. This is used for removing an existing field
       2. Syntax: `db.<collection>.updateOne({filter}, {$unset: { <fieldName>: 1 }})`
          1. `db.categories.updateMany( { "name": { $exists: true } }, { $unset: { "offer": 1 } } )`, this will remove the offer field from all the documents containing name field
    5. `$rename`:
       1. This is used to rename an existing field-name to new field-name
       2. Syntax: `db.<collection>.updateOne({filter}, {$rename: { oldFieldName: newFieldName }})`
          1. `db.categories.updateOne( { _id: 1 },{ $rename: { "description": "discription" } } )`, renaming the field description to discription where \_id is 1
14. Updating arrays and Enbedded documents
    1. `$push`:
       1. This is used to push new element/object in the array of a document
       2. Syntax: `db.<collection>.updateOne({filter}, {$push: { <array-field>: "new element" }})`
          1. `db.comments.updateOne( { _id: 1 }, { $push: { "comments": { "user": "Hihi", "text": "haha" } } } )`, added a new comment object
          2. `db.comments.updateOne({_id:1},{$push: {"funnyComment": {"user": "Hihi", "text": "haha hihi huhu"}}})`, if array field does not exists then it will create a new field and then add data to it
    2. `$pop`:
       1. This will pop the last element from the array of a document
       2. Syntax: `db.<collection>.updateOne({filter}, {$pop: { <array-field>: <num-value> }})`, the num value can be 1 or -1.
       3. 1 will result in poping value from the last of the array and -1 will result in poping the value from start of the array
          1. `db.comments.updateOne({_id:1},{$pop: {"comments": -1}})`, this will pop the first comment from the comments array in the document
    3. Update a particular key's value in an embedded doc
       1. Syntax: `db.<collection>.updateOne({filter}, { $set: { <array-key>.$.<field-tobe-updated> : <new value> } })`
          1. `db.comments.updateOne({_id:1, "comments.user": "Ava"}, { $set: {"comments.$.text": "Haha this is so funny"}})`, this will update the comment.text for document where \_id is 1 and comments.user is Ava
       2. Here, the `$` is acting as a positional operator storing the position of the queried element in array
15. Deleting:
    1. `deleteOne({filter})`:
       1. This will delete a document based on the filter
       2. Syntax: `db.<collection>.deleteOne({filter})`
    2. `deleteMany({filter})`:
       1. This will delete all the documents satisfying the filter condition
          1. Syntax: `db.<collection>.deleteMany({filter})`

### Indexing in MongoDB

1. MongoDb uses B-trees for indexing.
2. MongoDB chose B-trees because they support equality, range queries, sorting, and compound indexes. Although \_id may appear random, ObjectId is time-ordered, and WiredTiger mitigates random insert costs. B-trees give predictable query performance, which MongoDB prioritizes over pure insert speed.
   1. The autogenerated \_id in mongoDb is of the form `| 4 bytes timestamp | 5 bytes random | 3 bytes counter |`. So \_id is pseudo-sequential, not random.
3. `explain()`
   1. This is used to get extra info about a query execution
   2. For more info about query execution time, use `explain("executionStats")`
      1. Eg: `db.products.find({"price": {$gt: 50}}).explain("executionStats")`
4. Check the existing indexes created on a collection:
   1. `getIndexes()`:
      1. `db.products.getIndexes()`, output:- `[ { v: 2, key: { _id: 1 }, name: '_id_' } ]`
         1. This means the index version used by mongodb is 2
         2. An index is created on \_id field with 1 meaning in ascending order. -1 means index is created on descending order
         3. name of the index is `_id_` means it is an autogenerated index created by mongodb
5. MongoDb creates a defualt index per collection on the \_id field
6. Create an index on the field:
   1. `createIndex({field:1})`:
      1. 1 means order in ascending order and -1 means order in descending order
      2. `db.products.createIndex({"categoryId":1})`, here we have created index on the categoryId of the products collection documents in ascending order
7. Dropping index:
   1. `db.<collection>.dropIndex({field : 1})` or `db.<collection>.dropIndex("index_name")`
8. Types of indexes in MongoDB:
   1. Single Field Index
      1. Index on a single field
      2. Supports ascending (1) and descending (-1) order
      3. Used for equality, range queries, and sorting
      4. `db.users.createIndex({ age: 1 })`
   2. Compound Index
      1. Index on multiple fields in a specific order.
      2. Order matters: { a: 1, b: 1 } ≠ { b: 1, a: 1 }
      3. Useful when queries filter or sort by multiple fields.
      4. `db.orders.createIndex({ userId: 1, createdAt: -1 })`
   3. Multikey Index
      1. Automatically created when indexing an array field.
      2. Enables efficient queries on array elements.
      3. MongoDB expands array values internally.
      4. `db.products.createIndex({ tags: 1 })`
   4. Text Index
      1. Supports full-text search on string content.
      2. Allows search with relevance scoring.
      3. Supports stemming and stop words.
      4. `db.articles.createIndex({ content: "text" })`
         1. `db.articles.find({$text: {$search: keyword}})`, it is faster than regex searching
         2. Regex search:
            1. `db.articles.find({content: {$regex: keyword}})`
   5. Geospatial Indexes
      1. Used for location-based queries.
      2. 2d Index
         1. For flat (planar) geometry.
         2. `db.places.createIndex({ location: "2d" })`
      3. 2dsphere Index
         1. For Earth-like spherical geometry (GeoJSON).
         2. `db.places.createIndex({ location: "2dsphere" })`
   6. Hashed Index
      1. Indexes a hash of the field value.
      2. Good for sharding and equality lookups.
      3. ❌ Not useful for range queries.
      4. `db.users.createIndex({ userId: "hashed" })`
   7. Partial Index:
      1. Indexes only documents that match a filter condition.
      2. Saves space and improves performance.
         ```
         db.users.createIndex(
               { age: 1 },
               { partialFilterExpression: { age: { $gte: 18 } } }
               )
         ```
   8. Sparse Index:
      1. Only indexes documents where the field exists.
      2. Skips documents missing the field.
      3. `db.users.createIndex({ middleName: 1 }, { sparse: true })`
   9. TTL (Time-To-Live) Index:
   10. Automatically expires documents after a set time.
   11. Used for logs, sessions, temporary data.
       ```
       db.sessions.createIndex(
          { createdAt: 1 },
          { expireAfterSeconds: 3600 }
       )
       ```
   12. Unique Index:
       1. Ensures unique values for a field.
       2. Prevents duplicate entries.
       3. `db.users.createIndex({ email: 1 }, { unique: true })`

> Important Note:

> In MongoDB, $field and field mean very different things depending on context.
>
>     field (without $) → Literal field name
>     Used when:
>        Defining documents
>        Writing query filters
>        Creating indexes
>        Referring to keys
>        Eg: db.users.find({ age: { $gt: 18 } })

>     $field (with $) → Field value reference:
>     Used in:
>        Aggregation expressions
>        Computed fields
>        Comparisons inside pipelines
>        Eg: { $group: { _id: "$categoryId", totalStock: { $sum: "$stock" } } }
>
> $ tells MongoDB: “Use the value stored in this field, not the literal string.”

### Aggregation

1. Aggregation is the process of performing transformations on documents and combining them to produce computed results
2. Pipeline Stages:
   1. Aggregation pipeline consist of multiple pipeline stages, each performing a specicfic operation on the input data
3. Benefits:
   1. Aggregating data:
      1. Complex calculations and operations are possible
   2. Advanced Transformations
      1. Data can be combined, reshaped and computed for insights
   3. Efficient Processing
      1. Aggregation handles large datasets efficiently
4. `aggregate()`:
   1. This function is used to perform aggregation operations
   2. It works with an array of aggregation methods
   3. Syntax: `db.<collection>.aggregate( [ <aggregation-methods> ])`
5. Aggregation methods:
   1. `$match`:
      1. It filters documents based on specified conditions. It is similar to find() method
      2. Syntax: `{$match: {<query>}}`
         1. Eg: `db.products.aggregate( [ { $match: {"categoryId": 5} } ] )`, fetches all the products having categoryId = 5
         2. Multiple operations: `db.products.aggregate([{$match: {"categoryId": 5}}, {$match: {"stock": {$gt: 25}}}])`
      3. The results can be further used for processing which is not possible with find()
   2. `$group`:
      1. This $group stage groups documents by specified fields and performs aggregate operations on grouped data
      2. Syntax: `{$group: { _id: "$<field1>", <newField1>: { <accumulator1>: "$<field1>"}, ... }}`
         1. Eg: `db.products.aggregate([ { $group: {_id: "$categoryId", "Total Stock": {$sum: "$stock"}, "Average Rating": {$avg: "$rating"}  } } ])`, here we are grouping products collection by categoryId and calculting total stocks and avg rating for each category
      3. Some **Accumulator operators**:
         1. `$sum`
         2. `$avg`
         3. `$min`
         4. `$max`
         5. `$count`
         6. `$push`
            1. It is used to add elements to an array field within a document
            2. `db.products.aggregate([{$group: {_id: "$categoryId", "products": {$push: "$name"}}}])`:
               1. Here, we are grouping products with "categoryId" and creating a field called products containing array of product names that belongs to that category
         7. `$addToSet`
   3. `$sort`:
      1. This is used to sord the results based on a field
      2. Syntax: `{ $sort: { <field>: 1 } }`
         1. Eg: `db.products.aggregate([{$group: {_id: "$categoryId", "Total Stock": {$sum: "$stock"}, "Average Rating": {$avg: "$rating"}  }}, {$sort: {"Total Stock":1}}])`
   4. `$limit` and `$skip`:
      1. `{ $limit: 10 }`
      2. `{ $skip: 20 }`
   5. `$project`:
      1. The $project stage reshapes documents, includes or excludes fields and perform operation on fields
      2. Some common **Expression operators** used in projection:
         1. $sum
         2. $multiply
         3. $subtract
         4. $avg
         5. $mod
         6. $divide
      3. Syntax: `{ $project: { <field1>: <expression> } }`
         1. Eg:

            ```
            db.products.aggregate(
               [
                  {
                     $match: {
                        "categoryId": 5
                     }
                  },
                  {
                     $project: {
                        _id:0,
                        "name":1,
                        "price": 1,
                        "stock": 1,
                        "Total value": {
                           $multiply: [ "$price", "$stock" ]
                        }
                     }
                  }
               ]
            )
            ```

            1. Here, we are have created an aggregation pipeline of 2 operations
               1. Fetch all the products with categoryId = 5
               2. Project/show only price, stock and a custom field "Total value" created by multiplying price of each item and total stock

   6. `$unwind`:
      1. It flatten arrays
      2. Syntax: `{ $unwind: "$items" }`
         1. Eg:`{ _id:1, items: ["a", "b"] }` --> unwind(items) --> `[{ _id:1, items: "a" }, { _id:1, items: "b" }]`
         2. Eg: `db.comments.aggregate([{ $unwind: "$comments" }, { $group: { _id: "$_id", "totalComments": { $count:{} } } }])`, here we are first unwinding the comments array in each document and then counting the total number of commnet we have per \_id
