import Video from "../models/Video";

export const deleteAll = async (req, res, next) => {
    await Video.deleteMany({});
    return res.redirect("/");
};

export const home = async (req, res) => {
    const videos = await Video.find({}).sort({createdAt: "desc"});
    return res.render("home", {pageTitle: "Home", videos});
};

export const watch = async (req, res) => {
    const {id} = req.params;

    const video = await Video.findById(id);

    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video Not Found"});
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
        return res.status(404).render("404", {pageTitle: "Video Not Found"});
    }
    return res.render("edit-video", {
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

export const search = async (req, res) => {
    const {keyword} = req.query;

    let videos = [];

    if (keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(`${keyword}$`, "i"),
            },
        });
    }

    return res.render("search", {pageTitle: "Search Video", videos});
};

export const deleteVideo = async (req, res) => {
    const {id} = req.params;
    const ok = await Video.exists({_id: id});

    if (!ok) {
        return res.redirect("/");
    }

    await Video.findByIdAndDelete(id);

    return res.redirect("/");
};

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
