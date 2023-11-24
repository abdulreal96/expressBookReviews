const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {  
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization;
  const isbn = req.params.isbn;
  req.query['user'] = user.username;
  
  let book;

  // Find the book with the given ISBN
  for (let key in books) {
    if (books[key].ISBN === isbn) {
      book = books[key]; // Return the book object if ISBN matches
      
      // Check if the book has a 'reviews' property (assuming it's an object)
      if (!book.hasOwnProperty('reviews')) {
        book.reviews = {}; // If 'reviews' doesn't exist, initialize it as an empty object
      }

      // Check if the user has already reviewed this book
      if (book.reviews.hasOwnProperty(user.username)) {
        // Modify the existing review for the same user and ISBN
        Object.assign(book.reviews[user.username], req.query);
      } else {
        // Add a new review for a different user or a user with no previous review on this ISBN
        book.reviews[user.username] = req.query;
      }
      
      break;
    }
  }

  return res.status(200).json({ book });
});


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const user = req.session.authorization.username;
  const isbn = req.params.isbn;

  let book;
  for (let key in books) {
    if (books[key].ISBN === isbn) {
      book = books[key]; // Return the book object if ISBN matches

      // Check if the book has a 'reviews' property (assuming it's an object)
      if (book.hasOwnProperty('reviews')) {
        // Check if the current user has a review, then delete it
        if (book.reviews.hasOwnProperty(user)) {
          delete book.reviews[user]; // Delete the user's review
        }
      }
      
      break;
    }
  }

  return res.status(200).json({ message: 'Review deleted successfully' });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
