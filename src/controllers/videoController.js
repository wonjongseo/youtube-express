import Video from "../models/Video";

export const home = async (req, res) => {
    const videos = await Video.find({});
    return res.render("home", {pageTitle: "Home", videos});
};

export const watch = async (req, res) => {
    const {id} = req.params;

    const video = await Video.findById(id);

    if (!video) {
        return res.render("404", {pageTitle: "Video Not Found"});
    }
    return res.render("watch", {
        pageTitle: video.title,
        video,
    });
};
export const getEdit = async (req, res) => {
    const {id} = req.params;

    const video = await Video.findById(id);

    if (!video) {
        return res.render("404", {pageTitle: "Video Not Found"});
    }
    return res.render("edit", {
        pageTitle: `Editing ${video.title}`,
        video,
    });
};
export const postEdit = async (req, res) => {
    const {id} = req.params;
    const {title, description, hashtags} = req.body;

    const ok = await Video.exists({_id: id});

    if (!ok) {
        return res.render("404", {pageTitle: "Video Not Found"});
    }

    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: hashtags.split(",").map((word) => `#${word}`),
    });

    return res.redirect(`/videos/${id}`);
};

export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("Upload");
export const deleteVideo = (req, res) => res.send("Delete Video");

export const getUpload = (req, res, next) => {
    return res.render("upload", {pageTitle: "Upload Video"});
};

export const postUpload = async (req, res, next) => {
    const {title, description, hashtags} = req.body;
    // ssss
    try {
        await Video.create({
            title,
            description,
            hashtags: hashtags.split(",").map((word) => `#${word}`),
        });
    } catch (error) {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }

    return res.redirect("/");
};
