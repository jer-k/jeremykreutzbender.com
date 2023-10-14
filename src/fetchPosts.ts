// import matter from 'gray-matter'
// import path from 'path'
// import type { Post } from './types'
// import fs from 'fs/promises'
// import { cache } from 'react'
//
// // `cache` is a React 18 feature that allows you to cache a function for the lifetime of a request.
// // this means getPosts() will only be called once per page build, even though we may call it multiple times
// // when rendering the page.
// export const fetchPosts = cache(async () => {
//     const posts = await fs.readdir('./posts/')
//
//     return Promise.all(
//         posts
//             .filter((file) => path.extname(file) === '.mdx')
//             .map(async (file) => {
//                 const filePath = `./posts/${file}`
//                 const postContent = await fs.readFile(filePath, 'utf8')
//                 const { data, content } = matter(postContent)
//
//                 if (data.published === false) {
//                     return null
//                 }
//
//                 return { ...data, body: content } as Post
//             })
//     )
// })
//
// export async function fetchPost(slug: string) {
//     const posts = await fetchPosts()
//     return posts.find((post) => post.slug === slug)
// }
//
// export default fetchPosts
