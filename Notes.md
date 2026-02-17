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
