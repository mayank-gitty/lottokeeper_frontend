import Loki from "lokijs";

var db = new Loki("example5.db");
var users = db.addCollection("users");

export { db, users };
