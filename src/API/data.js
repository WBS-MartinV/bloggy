import credentials from "./credentials.json";
const contentful = require("contentful");

const { space, environment } = credentials;

const client = contentful.createClient(credentials);

const getAllData = async () => {
    const data = await client.getEntries({
        // EVERYTHING!
    });

    console.log("All", data);
    return data.items;
};

const getBlogs = async () => {
    const data = await client.getEntries({
        content_type: "blog",
    });
    console.log("Blogs", data);
    return data.items;
};

const getAuthors = async () => {
    const data = await client.getEntries({
        content_type: "author",
        select: "sys.createdAt,fields.bio,fields.name,fields.description",
    });
    console.log("Authors", data);
    return data.items;
};

const getComments = async () => {
    const data = await client.getEntries({
        content_type: "comment",
    });
    console.log("Comments", data);
    return data.items;
};

const getCommentsByArticle = async (id) => {
    const data = await client.getEntries({
        content_type: "comment",
        "fields.replyTo.sys.id": id,
    });
    console.log("Comments by article " + id, data);
    return data.items;
};

//////
const contentful_management = require("contentful-management");

const postingClient = contentful_management.createClient({
    accessToken: credentials.tokenForPosting,
});

// activate content type
postingClient
    .getSpace(space)
    .then((space) => space.getEnvironment(environment))
    .then((environment) => environment.getContentType("comment"))
    .then((contentType) => contentType.publish());

const postComment = (text, replyTo, author) => {
    postingClient
        .getSpace(space)
        .then((space) => space.getEnvironment(environment))
        .then((environment) => {
            console.log(environment);
            environment
                .createEntry("comment", {
                    fields: {
                        text: {
                            "en-US": text,
                        },
                        author: {
                            "en-US": {
                                sys: {
                                    type: "Link",
                                    linkType: "Entry",
                                    id: author,
                                },
                            },
                        },
                        replyTo: {
                            "en-US": {
                                sys: {
                                    type: "Link",
                                    linkType: "Entry",
                                    id: replyTo,
                                },
                            },
                        },
                    },
                })
                .then(entry => entry.publish());
        });
};

export default client;

export {
    //  get data
    getAllData,
    getAuthors,
    getComments,
    getCommentsByArticle,
    getBlogs,
    //  send data
    postComment,
};
