import Video from "../models/Video";

export const home = (req, res) => {
    return res.render("home", {pageTitle: "Home"});
};

export const watch = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];

    return res.render("watch", {pageTitle: `Watching ${video.title}`});
};
export const getEdit = (req, res) => {
    const {id} = req.params;
    const video = videos[id - 1];

    return res.render("edit", {pageTitle: `Editing: ${video.title}`});
};
export const postEdit = (req, res) => {
    const {id} = req.params;
    const {title} = req.body;

    videos[id - 1].title = title;
    return res.redirect(`/videos/${id}`);
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");

export const getUpload = (req, res, next) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = (req, res, next) => {
    // ww

    return res.redirect("/");
};
