import { useEffect, useRef, useState } from "react";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

// import { getAllData, getBlogs, getComments, getAuthors, getCommentsByArticle } from "./API/data";
import * as API from "./API/data";
import CLIENT from "./API/data";

import "./App.css";

CLIENT.getEntries().then((response) => console.log("Client:", response));

const { getBlogs, getComments, getAuthors } = API;

const Json = (data, index) => (
    <li key={index}>
        <pre>{JSON.stringify(data, null, 4)}</pre>
    </li>
);

const extractAuthorData = (data) =>
    data
        ? {
              name: data?.fields?.name,
              description: data?.fields?.description,
              bio: documentToReactComponents(data?.fields?.bio),
              joined: new Date(data?.sys?.createdAt).toLocaleDateString(),
          }
        : {
              loading: true,
          };

const Author = (data) => {
    const { name, description, bio, joined } = extractAuthorData(data);
    // console.log(data, name, description, bio, joined)
    return (
        <div
            style={{
                border: "1px solid black",
                padding: "1rem",
                margin: "1rem",
            }}
        >
            <h1>{name}</h1>
            <h3>{description}</h3>
            <div style={{ border: "1px solid grey" }}>
                <h3>Bio</h3>
                {bio}
            </div>
            <p>Blogging since {joined}</p>
        </div>
    );
};

const extractBlogData = (data) =>
    data
        ? {
              title: data?.fields?.title,
              article: documentToReactComponents(data?.fields?.article),
              published: new Date(data?.fields?.published).toLocaleDateString(),
              articleID: data.sys.id,
              authorID: "2TGcpW4pMxZXOa3zJVDoWc",
              comments: data.comments,
          }
        : {
              loading: true,
          };

const Blog = (data) => {
    const { title, article, published } = extractBlogData(data);

    return (
        <div className="blog">
            <h1>{title}</h1>
            <div className="article">{article}</div>
            <div className="footer">Published on {published}</div>
        </div>
    );
};

const extractCommentData = (data) =>
    data
        ? {
              text: data?.fields?.text,
              author: data?.fields?.author?.fields?.name,
              posted: new Date(data?.sys?.createdAt).toLocaleDateString(),
          }
        : {};
const Comment = (data) => {
    const { text, author, posted } = extractCommentData(data);

    return (
        <div className="comment">
            <p>{text}</p>
            <p>
                posted by {author} on {posted}
            </p>
        </div>
    );
};

const CommentSection = ({ comments, articleID, authorID }) => {
    const [comment, setComment] = useState("");

    return (
        <div className="comments">
            <h1>Comment Section!</h1>
            <form>
                <textarea
                    value={comment}
                    placeholder="Anything to add?"
                    onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        API.postComment(comment, articleID, authorID);
                    }}
                >
                    Comment!
                </button>
                <p>
                    commenting as {authorID} on {articleID}
                </p>{" "}
                {comments.map(Comment)}
            </form>
        </div>
    );
};

function App() {
    const [blogs, setBlogs] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [comments, setComments] = useState([]);

    const [user, setUser] = useState();
    const [article, setArticle] = useState();

    const fetchData = async () => {
        const authors = await getAuthors();
        const blogs = await getBlogs();
        const comments = await getComments();

        setAuthors(authors);
        setBlogs(blogs);
        setComments(comments);

        setUser(authors[0].sys.id); //Fake login
        setArticle(blogs[0].sys.id); //Fake selected article
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="App">
            Authors: <ol>{authors.map(Author)}</ol>
            Blogs:<ol>{blogs.map(Blog)}</ol>
            Comments: <ol>{comments.map(Comment)}</ol>
            CommentSection:{" "}
            <CommentSection
                comments={comments}
                articleID={article}
                authorID={user}
            ></CommentSection>
        </div>
    );
}

export default App;
