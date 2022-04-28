import { useEffect, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

// import { getAllData, getBlogs, getComments, getAuthors, getCommentsByArticle } from "./API/data";
import * as API from './API/data';
import CLIENT from './API/data';

import "./App.css";

CLIENT.getEntries().then((response) => console.log('Client:', response));

const { getBlogs, getComments, getAuthors } = API

const Json = (data, index) => (
    <li key={index}>
        <pre>{JSON.stringify(data, null, 4)}</pre>
    </li>
);

const extractAuthorData = (data) => data 
    ? ({
        name: data?.fields?.name,
        description: data?.fields?.description,
        bio: documentToReactComponents(data?.fields?.bio),
        joined: (new Date(data?.sys?.createdAt)).toLocaleDateString(),
    })
    : {
        loading: true
    }

const Author = (data) => {
    const { name, description, bio, joined } = extractAuthorData(data);
    // console.log(data, name, description, bio, joined)
    return (
        <div style={{
            border: '1px solid black',
            padding: '1rem',
            margin: '1rem',
        }}>
            <h1>{name}</h1>
            <h3>{description}</h3>
            <div style={{border: '1px solid grey'}}>
                <h3>Bio</h3>
                {bio}
            </div>
            <p>Blogging since {joined}</p>
        </div>
    );
};

function App() {
    const [blogs, setBlogs] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        (async () => {
            API.getAllData(); // just to log
            API.getCommentsByArticle('4Q01PyViSZIYwtTWlearkP');
            setAuthors(await getAuthors());
            setBlogs(await getBlogs());
            setComments(await getComments());
        })();
    }, []);

    return (
        <div className="App">
            <Author {...authors[0]} />
            Authors: <ol>{authors.map(Author)}</ol>
            Blogs: <ol>{blogs.map(Json)}</ol>
            Comments: <ol>{comments.map(Json)}</ol>
        </div>
    );
}

export default App;
