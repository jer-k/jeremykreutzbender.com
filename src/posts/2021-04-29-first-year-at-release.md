---
title: First Year At An Early Stage Startup (Release)
date: "2021-04-29"
template: "post"
draft: false
slug: "first-year-at-release"
category: "Thoughts"
tags:
  - "startup"
  - "product"
  - "marketing"
  - "sales"
  - "release"
description: ""
socialImage:
---

![release-logo](media/release-logo.png)

Happy Launch Day! If you weren’t aware, [Release](https://releasehub.com/) came out of beta today. Here are some links to news articles related to our launch.

- [ReleaseHub nabs $2.7M seed to give developers on-demand environments](https://techcrunch.com/2021/04/29/releasehub-nabs-2-7m-seed-to-give-developers-on-demand-environments/) - TechCrunch Article
- [Release your Ideas with Environments as a Service. Fueled by a Seed Round from Sequoia.](https://releasehub.com/blog/releasehub-sequoia-funded) - Our CEO Tommy McClung's thoughts on our funding
- [Release: Limitless environments so developers never have to wait to ship code](https://medium.com/sequoia-capital/release-limitless-environments-so-developers-never-have-to-wait-to-ship-code-a7165fcc763c) - From our lead investor Bogomil Balkansky
- [Sequoia leads $2.7M Seed Round to Launch ReleaseHub, Environments-as-a-Service](https://releasehub.com/blog/launch-press-release) - Launch Press Release
- [Sequoia Leads $2.7M Seed Round to Launch ReleaseHub, Environments-as-a-Service](https://newsdirect.com/news/sequoia-leads-2-7m-seed-round-to-launch-releasehub-environments-as-a-service-181963653) - NewsDirect picked up on our Press Release
- [Sequoia Leads $2.7M Seed Round to Launch ReleaseHub, Environments-as-a-Service](https://finance.yahoo.com/news/sequoia-leads-2-7m-seed-160000177.html) - Yahoo Finance
- [Sequoia Leads $2.7 Million Seed Round to Launch ReleaseHub, Environments-as-a-Service](https://aithority.com/saas/sequoia-leads-2-7-million-seed-round-to-launch-releasehub-environments-as-a-service/) - AIThority

In March in 2020, I made a decision to join Release as a Founding Engineer and the first hire at the company. I had recently taken some time off from work and relocated from Santa Monica, CA to Portland, OR to be closer to friends and family as well as traveled to Australia and New Zealand. The months away from working were refreshing but I was excited to dive back into a very early stage startup and learn as much as I could. It has been quite the year and I wanted to highlight, at a high level, what my experience has been like.

## Remote First Was Always The Plan

As I mentioned, I moved back to Portland from Santa Monica, but the founders of Release remained in Los Angeles. As I was discussing joining the team, I let them know that it was my desire to be in Portland and working remotely would have to be the norm for us. They agreed, likely due to the fact that I had previously worked with them and we had worked with remote engineers to great success in the past.

I believe one of the keys to working remotely is over communication. Letting people know if you’re stepping away from the desk to run an errand or take a break ensures that if they need to reach out to you, they’ll understand when you’ll be back. While it is much harder to spark those random conversations that happen when you bump into someone in the hallway of the office, we tried our best to foster those discussions through having everyone hop onto a Zoom call. It isn’t always easy being pulled away from your tasks for an impromptu three hour discussion on how the business is doing but it happened more than once and was welcomed by all of us.

I think another thing that helped was what we call ‘coffee talk’, where each morning to start the Zoom call, we would spend 15-20 minutes chatting about whatever before getting into the daily standup. I know many people despise standup and forcing people into another 15-20 minutes of sitting on a Zoom sounds unbearable, but hear me out. There were only four of us when I joined and we grew to seven by the end of 2020. With the company being barely a year old and everyone being remote meant that we had to build comradery between all the employees so that when discussions about the business came up, people were comfortable voicing their opinions. I believe we achieved this goal by talking about our weekends, what we were up to with our hobbies or updates about our pets.

## Building Product, Throwing It Away, and Building It Again

Move fast and… throw things away? We always knew that the core of our product would be Environments as a Service, but the pieces around the edges of this core were and still are constantly being iterated on. There were multiple times where we would build features, test them, and realize that we were really off base. One such example I remember is building an onboarding flow that required the user to choose between a personal account or a business account. If they chose a business account then they had to claim a domain and all users who signed up with that domain would go into their account. Finally they had to schedule a meeting with us through Calendly to get their account set to an onboarded state. While hand holding to get people up and running is a good idea, too many steps to even see what the product does decimates your funnel. We tossed that entire flow out the window and rebuilt it with a simple form only requiring a name for account and guess what? We now see people signing up on their own and working to get themselves up and running.

Another instance of this was that I was tasked to write a CLI for the application and at the start of the project I asked whether or not I should invest the time to learn Go and use it or stick with what I knew best and use Ruby. The decision was made to go with Ruby and I went ahead and wrote up a CLI. Everything worked great on my Macbook Pro while developing the CLI but once we attempted to distribute it through brew, issues started popping up. If I recall, something to do with eventmachine, which was brought in as a dependency for an ActionCable client, and the version of Ruby on the installers machine (or lack of Ruby all together) started causing issues. I can’t remember exactly, except for the fact that it was not seamless to install the CLI, which would cause issues for anyone trying to use it. We eventually decided that it was not worth the time and effort to try to resolve these issues and stopped working on the CLI. Fast forward six months and we were recommended a Go developer who was available to do some freelance work. We hired him to build out the initial version of the CLI in Go and we were delighted to have no installation issues when we distributed the alpha version of it throughout the company!

Those were only two instances I thought of off the top of my head but they reinforced the idea that no product choices we made were inherently wrong. We then had to take a step back, acknowledge things weren’t working as well as we wanted and start again. Throwing out something you spent a lot of time on can be a challenging task but understanding that you’re going to be in a better place the second time around is well worth the investment.

## Email Marketing and Spam Filters

Something I had never run into before was dealing with spam filters when sending emails. In my previous jobs I had only ever sent emails to people within the company, but we had decided that we wanted to do some marketing by sending out product update emails to everyone who had ever signed up for an account on Release.

Here is a glimpse into the past of a product update email we sent out at the end of October (bonus old logo!)
[October 2020 - What's new on Release?](https://docs.releasehub.com/whats-new/october-2020)
![release-whats-new-october-2020](media/whats-new-october2020.png)

What we came to find out was that our emails were ending up in the spam folder of most of the recipients. At first we weren’t sure if people weren’t opening the emails or if they were actually being marked as spam, but after doing an internal test on ourselves, we found that Gmail did not like the tracking pixel that was being inserted by the email platform we were using. While this is probably something that experienced marketers or salespeople catch onto quickly, if you take a bunch of engineers who have been focused on building products for a decade and ask them to do email marketing, you never know what you’ll end up with. In the end, we figured out how to resolve the issue, but little things that you think using a 3rd party platform would solve for you, might just be the difference between reaching your audience or not.

## Content Marketing

![release-visitor-growth](media/release-visitor-growth.png)

Release set a goal of producing a piece of content on our blog every week for a year, it is a lofty goal and we've slipped here and there but what we really found was that it does work. As time has gone on this year we've found success writing articles related to what we're working on and promoting them on different sites. Once someone has written their blog post and is ready to publish it, we'll set a morning meeting to do our promotion cycle. That cycle includes posting to places like HackerNews, Reddit, Twitter, and LinkedIn.

Sometimes the articles are more technical in nature, such as [Kubernetes - How to Debug CrashLoopBackOff in a Container](https://releasehub.com/blog/kubernetes-how-to-debug-crashloopbackoff-in-a-container) which was published at the end of January and is the first huge spike you see on graph. Other times the pieces are much more on the content marketing side, such as [Great SaaS Sales Demos - 3 Game Changers](https://releasehub.com/blog/great-saas-sales-demos) which is the tallest point of the graph in late March. Unfortunately my piece, [Cutting Build Time In Half with Docker’s Buildx Kubernetes Driver](https://releasehub.com/blog/cutting-build-time-in-half-docker-buildx-kubernetes), which I thought was littered with great tech buzzwords, flopped and did not make a splash on the graph. All in all, the emphasis to continue to produce content and generate awareness for what we're up to at Release is working and I'm all for pushing myself to write more!

## Pricing Is Hard

Pricing is hard and we spent a lot of time coming up with different approaches to how we were going to price the business. If someone were to come onboard and create an application that used 10GB of RAM compared to someone else who only needed 1GB, we couldn't really say both cost the same without creating behind the scenes cost issues for ourselves. We spent a lot of time looking at what other hosting services were offering and drew a lot of inspiration from Heroku and their pricing on dynos to create an initial pricing sheet. What we found was that trying to explain too complex pricing matrix that involved the number of environments and how much memory they were using was a difficult task. It was also complicated by fact that we offer an enterprise service where Kubernetes runs in our customer's AWS account. If we were to charge customers based on the amount of memory they were using, well they were already paying AWS for those servers and memory so it felt like a bit of misalignment.

We decided to take a much more streamlined approach and price based on the number of environments that a customer ends up having. We set limits on the number of concurrent environments they are able to have deployed, starting with 10. If a customer has a small development team, 10 is likely enough, but we've had customers who are very active and have many Pull Requests open come to us requesting a larger number of environments. Overall we're happy with our per environment cost structure for the moment.

## Sales And How I Didn’t Do Any

A brief summary of my sales effort was that I did none. From March 2020 through the end of the year the sales effort was handled by the founders of the company, after which we started hiring our sales team. Having the founders handle the sales effort makes sense, they’re the face of the new company and with outbound efforts we wanted recognizable names to be the ones in the meetings. While there may have been some nuggets of knowledge to learn from those meetings, I’m not entirely interested in trying to do sales so I stayed away. Since the start of this year (2021) we’ve hired two members of the sales team who are doing an amazing job! I immediately noticed the difference in their approach and knowledge with the sales process versus three engineering founders. Not trying to discredit the founders, they did an amazing job to get us to where we are today, but their backgrounds are in engineering and product, not sales.

## Final Thoughts

Thats a wrap! It has been quite a year and there has been a ton to process but that was the reason I wanted to join a startup at this early of a stage. I’ve definitely learned some tips for if I ever happen to start my own company. I hope you enjoyed reading and don’t forget to check out [Release](https://releasehub.com) if you are interested in our Environments as a Service platform.
