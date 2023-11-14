import Link from "next/link";

export function BlogCard() {
  <article className="p-4 bg-white rounded shadow">
    <img
      alt="Post Image 5"
      className="w-full h-auto rounded-md"
      height="200"
      src="/placeholder.svg"
      style={{
        aspectRatio: "300/200",
        objectFit: "cover",
      }}
      width="300"
    />
    <h3 className="text-xl font-bold mt-4">Post Title 5</h3>
    <p className="text-gray-500">Post Excerpt 5...</p>
    <Link className="text-blue-500 hover:underline" href="#">
      Read More
    </Link>
  </article>;
}
