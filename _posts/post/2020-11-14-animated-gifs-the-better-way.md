---
layout: post
title: Animated GIFs the Better Way
date: 2020-11-14 12:00 +1300
comments: true
categories: blog
published: true
image: 005-animated-gifs-the-better-way/cover.jpg
comments: true
tags:
- terminal
- ffmpeg
- apng
---

When workin on the prototype for the [Foodr app](https://upamanyu.in/works/2017/foodr-app){:target="_blank"}, instead of just screenshots, I wanted to have animations to demonstrate some of its features. One of the criteria was that the animations should work everywhere, from IE6 to an iPad. This ruled out two common video options, Flash and the <code class="language-html">video</code> element. Animated GIF files would have been a candidate, except for two issues: the 256 color limitation, which would have made the animations ugly, and the encoders I tried spat out huge files, at almost 1MB per-animation.

That is when I discovered the world of Animated PNGs