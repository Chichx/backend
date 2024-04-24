async function LoginView(req, res) {
    res.render('login')
}

async function RegisterView(req, res) {
    res.render('register')
}

async function Profile(req, res) {
    if (!req.session.user) return res.redirect('/')
    
    const userData = {
        first_name: req.session.user.first_name,
        last_name: req.session.user.last_name,
        age: req.session.user.age,
        email: req.session.user.email,
        role: req.session.user.role,
    };
    
    res.render("profile", { userData: userData });  
}

module.exports = { LoginView, RegisterView, Profile };