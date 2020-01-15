var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as ID: " + connection.threadId);
    afterConnection();
});

function afterConnection() {
    inquirer.prompt([{
        type: "list",
        message: "Please choose action from list below:",
        choices: ["Buy Item", "Exit"],
        name: "userGo"
    }]).then(function (inq) {

        switch (inq.userGo) {
            case ("Buy Item"):
                buyStuff();
                break;
            
            case ("Exit"):
                console.log("Thank you for shopping. Please come again!");
                connection.end();
                break;
        }
    });
}

function buyStuff() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Show nice and perty table
        console.table(res);
    });

}
