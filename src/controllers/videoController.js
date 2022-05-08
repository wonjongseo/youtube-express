import Video from "../models/Video";

export const deleteAll = async (req, res, next) => {
    await Video.deleteMany({});
    return res.redirect("/");
};

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
        hashtags: Video.formatHastags(hashtags),
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

    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHastags(hashtags),
        });
    } catch (error) {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }

    return res.redirect("/");
};
