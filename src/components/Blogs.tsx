import {useEffect, useState} from "react";
import {Blog, Incident, UptimeResponse} from "../nws-api/types";
import {getBlogs, getIncidents, getUptime} from "../nws-api/calls";
import "./Blog.css";
import ReactMarkdown from 'react-markdown';
import strip from 'strip-markdown';

export default function Blogs(){
    const [blogs, setBlogs] = useState<Blog[]>([]);

    const fetchBlogs = async () => {
        let resp: Blog[] = await getBlogs();
        setBlogs(resp);
    }

    useEffect(() => {
        fetchBlogs();
    }, []);

    return(
        <div>
            <h1>Blogs</h1>
            <div className={"d-flex justify-content-center"}>
                {blogs.map((e)=>{
                    return(
                      <div className={"blog-card row"} onClick={()=>{window.location.href=`/blog?id=${e.id}`}}>
                          <img src={e.imageUrl} className={"col-md-4 m-0 p-0"}/>
                          <div className={"p-2 col-md-8"}>
                              <h2>{e.title}</h2>
                              <p>By: {e.author}</p>
                              <p style={{maxHeight: 100, overflow: "clip"}}><ReactMarkdown remarkPlugins={[strip]}>{e.content}</ReactMarkdown>...</p>

                              <p><b>Click to read more</b></p>
                          </div>
                      </div>
                    );
                })}
            </div>
        </div>
    );
}
