import credentials from "./credentials.json";
const contentful = require("contentful");

const client = contentful.createClient(credentials);
export default client

const getAllData = async () => {
    const data = await client.getEntries({
        // EVERYTHING!
    });

    console.log('All', data);
    return data.items
};


const getBlogs = async () => {
    const data = await client.getEntries({
        content_type: 'blog',     
    });
    console.log('Blogs', data);
    return data.items
};

const getAuthors = async () => {
    const data = await client.getEntries({
        content_type: 'author',
        select: 'sys.createdAt,fields.bio,fields.name,fields.description',  
    });
    console.log('Authors', data);
    return data.items
};

const getComments = async () => {
    const data = await client.getEntries({
        content_type: 'comment'        
    });
    console.log('Comments', data);
    return data.items

}

const getCommentsByArticle = async (id) => {
    const data = await client.getEntries({
        content_type: 'comment',
        'fields.replyTo.sys.id': id        
    });
    console.log('Comments by article ' + id, data);
    return data.items
}

export {
    getAllData,
    getAuthors,
    getComments,
    getCommentsByArticle,
    getBlogs
}