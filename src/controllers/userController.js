import User from "../models/User";
import fetch from "node-fetch";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
    return res.render("join", {pageTitle: "Join"});
};
export const postJoin = async (req, res) => {
    console.log(req.body);
    const {name, username, email, password, password2, location} = req.body;
    if (password !== password2) {
        console.log("1");
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: "Password confirmation does not match.",
        });
    }
    const existingUser = await User.exists({$or: [{username}, {email}]});
    if (existingUser) {
        console.log("2");
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: "This username/email is already taken.",
        });
    }
    try {
        await User.create({
            name,
            username,
            email,
            password,
            location,
        });
        return res.redirect("/login");
    } catch (error) {
        console.log("3");
        return res.status(400).render("join", {
            pageTitle: "Join",
            errorMessage: error._message,
        });
    }
};

export const deleteAllUser = async (req, res, next) => {
    await User.deleteMany({});
    return res.redirect("/");
};
export const getLogin = (req, res) => res.render("login", {pageTitle: "Login"});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username, socialOnly: false});
    if (!user) {
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "An account with this username does not exists.",
        });
    }

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
        return res.status(400).render("login", {
            pageTitle: "Login",
            errorMessage: "Wrong password",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const githubLoginUrl = `${baseUrl}?${params}`;
    return res.redirect(githubLoginUrl);
};

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";

    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    };

    const params = new URLSearchParams(config).toString();

    const githubLoginUrl = `${baseUrl}?${params}`;

    const data = await fetch(githubLoginUrl, {
        method: "POST",
        headers: {
            Accept: "application/json",
        },
    });

    const json = await data.json();
    if ("access_token" in json) {
        const {access_token} = json;
        const apiUrl = "https://api.github.com";

        const userData = await fetch(`${apiUrl}/user`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });

        const userJsonData = await userData.json();

        const emailData = await fetch(`${apiUrl}/user/emails`, {
            headers: {
                Authorization: `token ${access_token}`,
            },
        });

        const emailJsonData = await emailData.json();

        const emailObj = emailJsonData.find(
            (email) => email.primary === true && email.verified === true
        );

        if (!emailObj) {
            return res.redirect("/login");
        }

        let user = await User.findOne({email: emailObj.email});

        if (!user) {
            user = await User.create({
                name: userJsonData.name || "Anon",
                avatarUrl: userJsonData.avatar_url,
                username: userJsonData.login,
                email: emailObj.email,
                password: "",
                socialOnly: true,
                location: userJsonData.location,
            });
        } else {
            req.session.loggedIn = true;
            req.session.user = user;
            return res.redirect("/");
        }
    } else {
        return res.redirect("/login");
    }
};
export const getEdit = (req, res) => {
    const user = req.session.user;

    return res.render("edit-profile", {
        pageTitle: `${user.name}'s Edit Profile`,
    });
};

export const postEdit = async (req, res, next) => {
    const {
        session: {
            user: {_id},
        },
    } = req;
    const {name, username, email, location} = req.body;

    const updatedUser = await User.findByIdAndUpdate(
        _id,
        {
            name,
            username,
            email,
            location,
        },
        {new: true}
    );

    req.session.user = updatedUser;

    return res.redirect("/");
};
export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};
export const see = (req, res) => res.send("See User");

export const getChangePassword = (req, res, next) => {
    if (req.session.socialOnly === true) return res.redirect("/");

    return res.render("change-password", {pageTitle: "Change Password"});
};

export const postChangePassword = async (req, res, next) => {
    const {
        session: {
            user: {_id},
        },
    } = req;
    const {password, new_password} = req.body;
    const user = await User.findById(_id);

    const ok = await bcrypt.compare(password, user.password);

    if (!ok) {
        return res.status(400).render("change-password", {
            errorMessage: "The current Password is incorrect",
        });
    }

    user.password = new_password;
    await user.save();

    return res.redirect("/users/logout");
};
