export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName = "Wonjongseo";
    res.locals.loggedInUser = req.session.user || {};
    next();
};

export const protectorMiddleWare = (req, res, next) => {
    if (req.session.loggedIn) {
        return next();
    }
    return res.redirect("/login");
};

export const publicOnlyMiddleWare = (req, res, next) => {
    if (!req.session.loggedIn) {
        return next();
    }
    return res.redirect("/");
};
