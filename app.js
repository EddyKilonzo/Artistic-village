import  express  from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import session  from "express-session";

const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'artistic'
});

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: false}))


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}))

app.use((req, res, next) => {
    if(req.session.userID === undefined) {
        res.locals.isLoggedIn = false;
    } else {
        res.locals.isLoggedIn = true;
        res.locals.username = req.session.username;
    }
    next();
});



app.get('/', (req, res) => {
    res.render('index.ejs')
});
app.get('/login', (req, res) => {
    if(res.locals.isLoggedIn) {
        res.redirect('/')
    } else {
        res.render('login.ejs', {error: false})
    }
});
app.get('/signup', (req, res) => {
    let user = {
        email: '',
        fullname: '',
        password: '',
        confirmPassword: '',
    }
    res.render('signup.ejs', {error:false, user: user})
});
app.post('/signup', (req, res) => {
    let  email = req.body.email;
    let  username = req.body.username;
    let  password = req.body.password;
    let  confirmPassword = req.body.confirmPassword;
    if(password === confirmPassword) {
       bcrypt.hash(password, 10, (error, hash) => {
            connection.query(
               'SELECT email FROM users WHERE email = ?',
                [email],
                (error, results) => {
                    if(results.length === 0) {
                        connection.query(
                            'INSERT INTO users (email, username, password) VALUES (?, ?, ?)',
                            [email, username, hash],
                            (error, results) => {
                                res.redirect('/login');
                            }
                        )
                    } else {
                        let message = 'Email already exists.'
                        res.render('signup.ejs', {
                            error: true,
                            errorMessage: message,
                            email: email,
                            username: username,
                            password: password,
                            confirmPassword: confirmPassword
                        })
                    }
                }
            )           
        })
    } else {
        let message = 'Password & Confirm Password  do not match.'
        res.render('signup.ejs', {
            error: true,
            errorMessage: message,
            email: email,
            username: username,
            password: password,
            confirmPassword: confirmPassword
            });
        }
});    

// submitting login form for user authentication
app.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    connection.query(
        'SELECT * FROM users WHERE email = ?', [email],
        (error, results) => {
            if(results.length > 0) {
                bcrypt.compare(password, results[0].password, (error, isEqual) => {
                    if(isEqual) {
                        // authentication successful
                        req.session.userID = results[0].id;
                        req.session.username = results[0].username;
                        res.redirect('/');
                    } else {
                        // authentication failed
                        let message = 'Email/password mismatch.'
                        res.render('login.ejs', {
                            error: true,
                            errorMessage: message,
                            email: email,
                            password: password
                        });
                    }
                })
            } else {
                // console.log('user does not exist');
                let message = 'Account does not exist. Please create one.'
                res.render('login.ejs', {
                    error: true,
                    errorMessage: message,
                    email: email,
                    password: password
                 });
            }
        }
    );
})
//logout functionality
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    })
});
app.get('/films', (req, res) => {
    res.render('films.ejs')

});
app.get('/services', (req, res) => {
    res.render('services.ejs')
});
app.get('/weddings', (req, res) => {
    res.render('weddings.ejs')
});
app.get('/films', (req, res) => {
    res.render('films.ejs')
});
app.get('/music-videos', (req, res) => {
    res.render('music-videos.ejs')
});
app.get('/photography', (req, res) => {
    res.render('photography.ejs')
});




app.listen(4000);