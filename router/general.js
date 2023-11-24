const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const doesExist = (username)=>{
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!doesExist(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop using async
public_users.get('/async', async function (req, res) {
  //Write your code here
  const response = await axios.get('http://localhost:5000/');
    
  const books = response.data; 
    
  return res.status(200).json(books);
});


// Get book details based on ISBN using async
public_users.get('/async/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    
  const book = response.data; 
  return res.status(200).json({book});
 });

 // Get book details based on author using async
public_users.get('/async/author/:author', async function (req, res) {
  //Write your code here
  let author = req.params.author;
  const response = await axios.get(`http://localhost:5000/author/${author}`);
    
  const book = response.data; 
  return res.status(200).json({book});
});

// Get book details based on title using async
public_users.get('/async/title/:title', async function (req, res) {
  //Write your code here
  let title = req.params.title;
  const response = await axios.get(`http://localhost:5000/title/${title}`);
    
  const book = response.data; 
  return res.status(200).json({book});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  
  return res.status(200).json({books});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let book;
  for (let key in books) {
    if (books[key].ISBN === isbn) {
      book = books[key]; // Return the book object if ISBN matches
    }
  }
  return res.status(200).json({book});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let author = req.params.author;
  let book;
  for (let key in books) {
    if (books[key].author === author) {
      book = books[key]; // Return the book object if ISBN matches
    }
  }
  return res.status(200).json({book});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let title = req.params.title;
  let book;
  for (let key in books) {
    if (books[key].title === title) {
      book = books[key]; // Return the book object if ISBN matches
    }
  }
  return res.status(200).json({book});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let isbn = req.params.isbn;
  let bookReviews;
  for (let key in books) {
    if (books[key].ISBN === isbn) {
      bookReviews = books[key].reviews; // Return the book object if ISBN matches
    }
  }
  return res.status(200).json({bookReviews}); 
});

module.exports.general = public_users;
