//Dependencies
var mysql = require("mysql");
var inquirer = require("inquirer");

//Create connection, store
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
    console.log("Thank you for choosing Bamazon!");
    console.log("-------------------------------");
    //If connection is established, start the fun!
    startNow();
});

function startNow() {
    inquirer.prompt([{
        type: "list",
        message: "Please choose an action from the list below:",
        choices: ["Buy Item", "Exit"],
        name: "userGo"
    }]).then(function (inq) {
        switch (inq.userGo) {

            case ("Buy Item"):
                buyStuff();
                break;

            case ("Exit"):
                exitProgram();
                break;
        }
    });
}

function exitProgram() {
    console.log("------------------------------------------------------");
    console.log("| Thank you for shopping Bamazon. Please come again! |");
    console.log("------------------------------------------------------");
    connection.end();
}

function continueShopping() {
    inquirer.prompt([{
        type: "list",
        message: "Would you like to continue shopping?",
        choices: ["Yes", "No"],
        name: "userContinue"
    }]).then(function (inq) {
        switch (inq.userContinue) {
            case ("Yes"):
                buyStuff();
                break;
            
            case ("No"):
                exitProgram();
                break;
        }
    })
}

function buyStuff() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Show res as a Table
        console.table(res);
        console.log("Above is a table of all available products with pricing.");
        console.log("The second column contains each item's specific ID (item_id).");
        console.log("You will use this unique ID to shop on Bamazon.");

        inquirer.prompt([{
            type: "input",
            message: "Please enter the item's Unique Item ID you wish to purchase.",
            name: "userItem"
        }, {
            type: "input",
            message: "Please enter the amount of product you would like to purchase. All prices shown in USD (taxes not included).",
            name: "userAmount"
        }]).then(function (inq) {

            connection.query("SELECT * FROM products WHERE ?", [{
                item_id: inq.userItem
            }], function (err, resOne) {
                if (err) throw err;
                if (resOne[0] != undefined) {
                    if (resOne[0].stock_quantity >= inq.userAmount) {
                        connection.query("UPDATE products SET stock_quantity = stock_quantity - ? WHERE ?",
                            [
                                //Convert amount to Integer for some math
                                parseInt(inq.userAmount),
                                {
                                    item_id: inq.userItem
                                }
                            ],
                            function (err, resTwo) {
                                if (err) throw err;

                                //Take in Total and Apply Taxes
                                var total = (inq.userAmount * resOne[0].price + (.07 * (inq.userAmount * resOne[0].price)));
                                //Round off excess decimals and store in new variable.
                                // !!! IMPORTANT !!! New roundedTotal is string. Format properly if continuing later.
                                var roundedTotal = (Math.round(total * 100) / 100).toFixed(2);

                                if (inq.userAmount > 1) {
                                    console.log("--------------------------------------------------------");
                                    console.log("| " + inq.userAmount + " units of " + resOne[0].product_name + "(s) have been purchased for $" + roundedTotal + ".");
                                    console.log("--------------------------------------------------------");
                                } else {
                                    console.log("--------------------------------------------------------");
                                    console.log("| " + inq.userAmount + " unit of " + resOne[0].product_name + "(s) has been purchased for $" + roundedTotal + ".");
                                    console.log("--------------------------------------------------------");
                                }
                                continueShopping();
                            }
                        )
                    } else {
                        console.log("----------------------------------------------");
                        console.log("| There are not enough " + resOne[0].product_name + "(s) in stock.");
                        console.log("----------------------------------------------");
                        startNow();
                    }
                } else {
                    console.log("-----------------------------------------------------");
                    console.log("| Sorry, we could not find that ID in our database. |");
                    console.log("-----------------------------------------------------");
                    startNow();
                };
            });
        });
    });
};