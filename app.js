import  express  from "express";
import mysql from "mysql";
import bcrypt from "bcrypt";
import session  from "express-session";
import multer from "multer";

const app = express();
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'',
    database: 'artistic'
});

const upload = multer({dest : './public/images/uploads/'})

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
        res.locals.userID = req.session.userID;
        
    }
    next();
});

app.get('/', (req, res) => {
    res.render('index.ejs')
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
app.get('/login', (req, res) => {
    if(res.locals.isLoggedIn) {
        res.redirect('/')
    } else {
        res.render('login.ejs', {error: false})
    }
});


app.post('/login', (req, res) => {
    let email = req.body.email
    let password = req.body.password
    connection.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (error, results) => {
            if(results.length > 0) {
                bcrypt.compare(password, results[0].password, (error, isEqual) => {
                    if(isEqual) {
                       
                        req.session.userID = results[0].id;
                        req.session.username = results[0].username;
                        res.redirect('/find-talent');
                    } else {
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
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        res.redirect('/');
    })
});
app.get('/profile/:id', (req, res) => {
    if(res.locals.isLoggedIn && req.session.userID===parseInt(req.params.id) ) {
        connection.query(
            `SELECT * FROM users WHERE id = ${parseInt(req.params.id)}`,
            (error, user)=>{
                connection.query(
                    `SELECT image FROM images WHERE imgOwner = ${parseInt(req.params.id)}`,
                    (error,images)=>{
                        // console.log(images)
                        // console.log(user)
                        res.render('profile.ejs', {user: user[0], images: images})
                    }
                )
            }
        )
    } else {
        console.log('not loged in or id do not match')
        res.redirect('find-talent')
    }
});
app.get('/find-talent', (req, res) => {
    connection.query(
        `SELECT * FROM users`,
        (error, results)=>{
            res.render('find-talent.ejs', {talents: results})
        }
    )
 
});
app.get('/user/:id', (req, res) => {
    console.log(parseInt(req.params.id))
    connection.query(
        `SELECT * FROM users WHERE id = ${parseInt(req.params.id)}`,
        (error, results) => {
            if(error){
                console.log(error)
            }else{
                connection.query(
                `SELECT * FROM images WHERE imgOwner = ${parseInt(req.params.id)}`,
                (error, images)=> {
                    if(error){
                        console.log(error)
                    }else{
                        res.render('user.ejs', {user: results[0], images: images})
                    }
                })
            }
        }
    )
})
app.get('/add-images', (req,res)=>{
    if(res.locals.isLoggedIn){
        res.render('add-images.ejs')
    }else{
        res.redirect('/login')
    }
})
app.post('/add-image', upload.single('images'), (req, res) => {
    let description = req.body.description;
    connection.query(
        `INSERT INTO images(image, imgOwner, description) VALUES('/images/uploads/${req.file.filename}', ${req.session.userID}, ?)`,
        [description],        
        (error,results)=>{
            if(error){
                console.log(error)
            }else{
                res.redirect(`/profile/${req.session.userID}`)
            }
        }
    )
})
app.get('*', (req, res) => {
    res.render('404.ejs')
});


app.listen(4000, ()=>console.log('server running on PORT 4000'));