const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => { //returns boolean
//write code to check is the username is valid
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => { //returns boolean
//write code to check if username and password match the one we have in records.
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', {expiresIn: 60 * 60});

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).json({message: "User successfully logged in"});
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.post("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    if (!isbn) {
        return res
            .status(400)
            .json({message: 'Missing ISBN'});
    }

    const review = req.body.review;
    if (!review) {
        return res
            .status(400)
            .json({message: 'Missing review'});
    }

    const username = req.session.authorization.username;
    if (!username) {
        return res
            .status(500)
            .json({message: 'Something went wrong'});
    }

    Object.keys(books).forEach((key) => {
        if (books[key].isbn === isbn) {
            if (!books[key].reviews[username]) {
                books[key].reviews[username] = review;
            } else {
                return res
                    .status(400)
                    .json({message: 'Review already present!'});
            }
        }
    });

    return res
        .status(200)
        .json({message: 'Review added successfully'});

});

// Edit a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    if (!isbn) {
        return res
            .status(400)
            .json({message: 'Missing ISBN'});
    }

    const review = req.body.review;
    if (!review) {
        return res
            .status(400)
            .json({message: 'Missing review'});
    }

    const username = req.session.authorization.username;
    if (!username) {
        return res
            .status(500)
            .json({message: 'Something went wrong'});
    }

    Object.keys(books).forEach((key) => {
        if (books[key].isbn === isbn) {
            if (books[key].reviews[username]) {
                books[key].reviews[username] = review;
            } else {
                return res
                    .status(404)
                    .json({message: 'No review to update'});
            }
        }
    });

    return res
        .status(200)
        .json({message: 'Review updated successfully'});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    if (!isbn) {
        return res
            .status(400)
            .json({message: 'Missing ISBN'});
    }

    const username = req.session.authorization.username;
    if (!username) {
        return res
            .status(500)
            .json({message: 'Something went wrong'});
    }

    Object.keys(books).forEach((key) => {
        if (books[key].isbn === isbn) {
            if (books[key].reviews[username]) {
                delete books[key].reviews[username];
            } else {
                return res
                    .status(404)
                    .json({message: 'No review to delete'});
            }
        }
    });

    return res
        .status(200)
        .json({message: 'Review deleted successfully'});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
