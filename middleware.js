module.exports.isLoggedIn = (req, res, next) => {
    // console.log("REQ.USER...", req.user);

    // store the URL user is requesting 
    if (!req.isAuthenticated()) {
        console.log(req.session);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Sorry, you must sign in!');
        return res.redirect('/login');
    }
    next();
}


