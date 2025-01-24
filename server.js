const adminName= 'Amine'
const adminPassword= 'asdfghjklöä'

const express = require('express');
const sqlite3 = require('sqlite3');

const port = 8080;

const { engine } = require('express-handlebars');

const app = express();

app.engine('handlebars', engine());

app.use(express.static("public"));

app.set('view engine', 'handlebars');
app.set('views', './views');

const dbFile = "final_project.db";
const db = new sqlite3.Database(dbFile);

function initTableBooks(mydb) {
    const books = [
        { "id": "1", "name": "dry", "type": "book", "desc": "*Dry* by Neal Shusterman is a dystopian novel about a severe water shortage in California. As society collapses, siblings Alyssa and Garrett must fight for survival, facing tough choices in a world where water is more valuable than life itself.", "year": "2018", "url": "/img/dry.jpg" },
        { "id": "2", "name": "atomic habits", "type": "book", "desc": "*Atomic Habits* by James Clear teaches how small, consistent changes can lead to big improvements. It focuses on building good habits, breaking bad ones, and using systems to create lasting success.", "year": "2018", "url": "/img/atomic-habits.jpg" },
        { "id": "3", "name": "born a crime", "type": "biography", "desc": "*Born a Crime* by Trevor Noah is a memoir about his mixed-race childhood in apartheid South Africa, where his existence was illegal. Through humor and personal stories, Noah reflects on race, identity, and his relationship with his strong-willed mother.", "year": "2016", "url": "/img/born-a-crime.jpg" },
        { "id": "4", "name": "Brief-answers", "desc": "*Brief Answers to the Big Questions* by Stephen Hawking explores deep questions about the universe, God, black holes, time travel, and humanity's future, emphasizing the power of science and the importance of curiosity.", "year": "2018", "type": "Research", "url": "/img/brief-answers.jpg" },
    ];

    // Correct table creation query
    mydb.run("CREATE TABLE IF NOT EXISTS books (Bid INTEGER PRIMARY KEY, Bname TEXT NOT NULL, Btype TEXT NOT NULL, Bdesc TEXT NOT NULL, Byear INTEGER NOT NULL, Bimage TEXT NOT NULL)", (error) => {
        if (error) {
            console.log("ERROR:", error);
        } else {
            // Insert each book after creating the table
            books.forEach((oneBook) => {
                mydb.run("INSERT INTO books (Bid, Bname, Btype, Bdesc, Byear, Bimage) VALUES (?, ?, ?, ?, ?, ?)", 
                    [oneBook.id, oneBook.name, oneBook.type, oneBook.desc, oneBook.year, oneBook.url], (error) => {
                        if (error) {
                            console.log("ERROR:", error);
                        } else {
                            console.log("Book added into book table");
                        }
                    });
            });
        }
    });
}

function initTablecontact (mydb) {
    const contact = [
        {"id":"1", "name":"contact", "type":"text", "desc":"If you have any questions or need more information, feel free to contact us using the details below:"},
        {"id":"2", "name":"email", "type":"text", "desc":"info@bookcollection.com"},
        {"id":"3", "name":"Phone", "type":"text", "desc":"+46 (0)728732013"},
        {"id":"4", "name":"adress", "type":"text", "desc":"Kärrhöksgatan 96, 556 12 Jönköping"},
    ]

    mydb.run("CREATE TABLE contact (Cid INTEGER PRIMARY KEY, Cname TEXT NOT NULL, Ctype TEXT NOT NULL, Cdesc TEXT NOT NULL)", (error) => {
        if (error) {
            console.log("ERROR:", error);
        } else {
            // Insert each book after creating the table
            contact.forEach((oneContact) => {
                mydb.run("INSERT INTO contact (Cid, Cname, Ctype, Cdesc) VALUES (?, ?, ?, ?)", 
                    [oneContact.id, oneContact.name, oneContact.type, oneContact.desc], (error) => {
                        if (error) {
                            console.log("ERROR:", error);
                        } else {
                            console.log("contact added into book table");
                        }
                    });
            });
        }
    });
}



app.get('/', function (req, res) {

    db.all("SELECT * FROM books", (error, listOfBooks) =>{
        if(error){
            console.log("ERROR:", error)
        }
        else{
            model = {books: listOfBooks}  
            res.render("home.handlebars",model);

        }
    })


});

app.get('/contact', function (req, res) {
    res.render("contact.handlebars", { title: "Contact Us" });
});

app.get('/login', function (req, res) {
    res.render("login.handlebars", { title: "login" });
});

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}));
//login 
app.post('/login',(req, res)=> {
    const username =req.body.username;
    const password =req.body.password;
    //verification
    if (!username || !password) {
        return res.status(400).send(`<div>Username and password are required.<br 
            Please try again: <a href="login">Login</a></div>`);
    }
    if (username == adminName) {
        console.log('The username is the admin one!');
        if (password == adminPassword) {
            console.log('The password is the admin one!');

            const model = {error: "", message: "You are the admin. Welcome Home!"}
            // sending a response

            res.render("login.handlebars", model);
        } else {

            const model = {
                error: "Sorry, the password is not correct",
                message: ""
            }
            res.status(400).render("login.handlebars", model);
        }
    } else {
        const model = {
            error: "Sorry the username is wrong: ", username, 
            message: ""
        }
        res.status(400).render("login.handlebars", model);
    }
})    


    app.get('/book/:id', function (req, res) {
        const bookId = req.params.id;
    
        db.get("SELECT * FROM books WHERE Bid = ?", [bookId], (error, book) => {
            if (error) {
                console.log("ERROR:", error);
                res.status(500).send("An error occurred.");
            } else if (!book) {
                res.status(404).send("Book not found.");
            } else {
                // Render a detailed page for the book
                res.render("bookDetail.handlebars", { book });
            }
        });
    });
    
app.listen(port, function () {
    console.log('Server up and running, listening on port ' + `${port}` + '...    :)');
});
