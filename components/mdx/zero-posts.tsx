const titlesAndSlugs = {
  "Setting up Rocicorp's Zero with Ruby on Rails":
    "setting-up-rocicorp-zero-with-rails",
  "Using PostgreSQL Functions with Rocicorp's Zero and Ruby on Rails":
    "using-postgresql-functions-with-rocicorp-zero-and-rails",
  "Server Implementation Plan For Rocicorp's Zero - Custom Mutators":
    "server-implementation-plan-rocicorp-zero-custom-mutators",
};

const prodUrl = "https://jeremykreutzbender.com/blog";
type Props = {
  currentSlug: string;
};
export function ZeroPosts({ currentSlug }: Props) {
  const posts = [];
  for (const [title, slug] of Object.entries(titlesAndSlugs)) {
    const item =
      currentSlug === slug ? (
        <div title="You're currently reading this post">{title}*</div>
      ) : (
        <a href={`${prodUrl}/${slug}`}>{title}</a>
      );
    posts.push(<li key={slug}>{item}</li>);
  }

  return (
    <>
      <h4>All My Posts About Zero</h4>
      <ul>{posts}</ul>
    </>
  );
}
