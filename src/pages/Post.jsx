import React, { useState, useEffect } from "react";
import PostService from "../Services/Post.service";

const Post = () => {
    const [posts, setPosts] = useState([]);
    
    const fetchPosts = () => {
        PostService.get()
            .then((response) => {
                setPosts(response.data);
                console.log(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    
    useEffect(() => {
        fetchPosts();
    }, []);
    
    return (
        <div className="bg-gray-100 min-h-screen flex flex-col items-center p-4">
            <div className="max-w-lg w-full">
                <h1 className="text-2xl font-bold text-blue-600 mb-4 text-center">Facebook Feed</h1>
                <div className="space-y-4">
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white rounded-lg shadow p-4">
                            <div className="flex items-center space-x-2">
                                <div className="bg-gray-300 h-10 w-10 rounded-full"></div>
                                <div>
                                    <p className="text-xs text-gray-500">Just now</p>
                                </div>
                            </div>
                            <div className="mt-2">
                                <p className="text-gray-800">{post.content}</p>
                            </div>
                            <div className="border-t mt-2 pt-2 flex justify-between text-gray-500 text-sm">
                                <button className="hover:text-blue-600">👍 Like</button>
                                <button className="hover:text-blue-600">💬 Comment</button>
                                <button className="hover:text-blue-600">🔄 Share</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Post;
