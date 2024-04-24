# [jeremykreutzbender.com](https://jeremykreutzbender.com)

Hello and welcome to the repository for my personal website. In 2022 I started using Next.js professionally and as the
Vercel team has been adding new features (functionality with React Server Components, Server Actions, etc) to Next.js
I wanted a place to play around and experiment with them. My old website was primarily a blog on a Gatsby template where
I didn't know how much of anything was working; it worked well for dropping in .mdx files to post content but beyond that
I struggled to make changes or upgrade packages on it. Thus I decided I wanted to rebuild my personal site from the ground
up using Next.js while giving myself a chance to learn about the new features in Next.js and React as well as Typescript.
Below is list of the libraries I've been using, pages I've built, and what I've been working on with those pages.

## Technologies / Libraries

- [Next.js](https://github.com/vercel/next.js)
  - [App Router](https://nextjs.org/docs/app)
  - [Server Actions](https://nextjs.org/docs/app/api-reference/functions/server-actions)
- [React](https://github.com/facebook/react)
- [Typescript](https://www.typescriptlang.org/)
- [shadcn/ui](https://ui.shadcn.com/)
- [resend](https://resend.com/overview)
  - [react email](https://react.email/)
- [react-hook-form](https://react-hook-form.com/)
- [zod](https://zod.dev/)

## Pages

### [CV](https://jeremykreutzbender.com/cv)

...

### [Contact](https://jeremykreutzbender.com/contact)

The Contact page was the first page I built out using a lot of the libraries listed above. While I was familiar with
`react-hook-form` from work, I decided to use `zod` instead of `yup` as a chance to look into a different library and
learn something new. I ended up finding a little helper function in some Github issues, `nonempty`, which seemed to be
something that existed in earlier versions of `zod` and added that as well.

This was my first Server Action that I wrote as well, `sendEmail`. Which handled all the needed pieces for using `resend`
to send the emails. It was a fun experience to set up `jest` to write all the tests. Coming from primarily writing Ruby on Rails
and the ability to churn out [rspec](https://rspec.info/) tests without thinking, being able to write tests for Server Actions
feels very close to home.
