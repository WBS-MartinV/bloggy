import credentials from "./credentials.json";
const contentful = require("contentful");

const client = contentful.createClient(credentials);

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
        // select: 'sys.createdAt, fields.bio',  
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

export default client

export {
    getAllData,
    getAuthors,
    getComments,
    getBlogs
}