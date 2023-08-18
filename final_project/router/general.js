const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) {
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("Promise resolved")
        }, 5000)
    }).then(() => {
        res
            .status(200)
            .json(books);
    });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    if (isbn) {

        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Promise resolved")
            }, 5000)
        }).then(() => {
            res.status(200).json((Object.values(books)).filter((book) => {
                return book.isbn === isbn;
            })[0]);
        });

    } else {
        return res
            .status(400)
            .json({message: 'Missing ISBN'});
    }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    let author = req.params.author;
    if (author) {

        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Promise resolved")
            }, 5000)
        }).then(() => {
            res.status(200).json((Object.values(books)).filter((book) => {
                return book.author === author;
            }));
        });

    } else {
        return res
            .status(400)
            .json({message: 'Missing Author'});
    }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    let title = req.params.title;
    if (title) {

        new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve("Promise resolved")
            }, 5000)
        }).then(() => {
            res.status(200).json((Object.values(books)).filter((book) => {
                return book.title === title;
            }));
        });


    } else {
        return res
            .status(400)
            .json({message: 'Missing title'});
    }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    let isbn = req.params.isbn;
    if (isbn) {
        res.status(200).json((Object.values(books)).filter((book) => {
            return book.isbn === isbn;
        })[0].reviews);
    } else {
        return res
            .status(400)
            .json({message: 'Missing ISBN'});
    }
});

module.exports.general = public_users;
