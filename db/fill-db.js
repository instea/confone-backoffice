var mysql = require('mysql');
var casual = require('casual');

const randomIndex = (max) => Math.floor(Math.random() * Math.floor(max)+1)

const dbErrorFunc = (err, result) => { if (err) throw err};

var con = mysql.createConnection({
  host: "localhost",
  user: "abc",
  password: "abc",
  database: "db"
});

let sql = (schemaPart, single) =>  {
    let sql = schemaPart + " ";
    for (let i=0; i < 999; i++){
        sql += single() + ", ";
    }
    sql += single() + ";";
    return sql;
}

let casualDate = () => "'" + casual.date(format ='YYYY-MM-DD') + " 01:00:00'";

let insert = (connection, entity, count, sqls) => {
    console.log(`---- INSERTING: ${entity} ------`);
    for (let i=0;i< (count / 1000); i++) {
        connection.query(sql(sqls[0], sqls[1]), (err, result) => {
            if (err) throw err;
            console.log(i + "000 record inserted");
        });
    }
}

let init = (connection) => {
    console.log('Initializing');
    connection.query("delete from rating", dbErrorFunc);
    connection.query("ALTER TABLE rating AUTO_INCREMENT = 0;", dbErrorFunc);

    connection.query("delete from conference", dbErrorFunc);
    connection.query("ALTER TABLE conference AUTO_INCREMENT = 0;",dbErrorFunc);

    connection.query("delete from customer", dbErrorFunc);
    connection.query("ALTER TABLE customer AUTO_INCREMENT = 0;", dbErrorFunc);
}

const customerCount = 10000;
const confCount = 100000;
const ratingCount = 1000000;

const customerSql = ["INSERT INTO customer (name, email, phone, notes) VALUES", () => `('${casual.company_name}', '${casual.email}', '${casual.phone}', '${casual.text}')`];
const confSql = ["INSERT INTO conference (name, customer_id, description, held_from, held_to) VALUES", 
    () => `('${casual.company_name + "Conf"}', ${randomIndex(customerCount)}, '${casual.text}', ${casualDate()}, ${casualDate()})`];
const ratingSql = ["INSERT INTO rating (conference_id, rating, date) VALUES", 
    () => `(${randomIndex(customerCount)}, ${randomIndex(5)}, ${casualDate()})`];

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    init(con);
    insert(con, "Customers", customerCount, customerSql);
    insert(con, "Conferences", confCount, confSql);
    insert(con, "Ratings", ratingCount, ratingSql);
});

