---
layout: post
title: Printing source code in Mac OS X
date: 2016-05-10 11:30
comments: true
categories: blog
published: true
image: 002-printing-source-code-mac-osx/terminal.png
comments: true
tags:
- source code
- OSX
---

<figure>
	<img src="/images/posts/002-printing-source-code-mac-osx/terminal.png" alt="Terminal executing the Command">
	<figcaption>Terminal to Execute the Command</figcaption>
</figure>

Almost all the time, I need to print out the syntax of a project, during development or as reference, for my screencasts, I always end up printing it from Microsoft Word or Pages, sans the beautiful syntax highlighting. The lightweight text editors like [Sublime Text 2](https://www.sublimetext.com/) doesn’t support printing right now, and [TextMate](https://macromates.com/) or [Coda](https://panic.com/coda/), in my opinion, doesn't produce much beautiful result.

But, to my rescue, I recently discovered this nice program called [enscript](http://linux.die.net/man/1/enscript). The program is capable of probably doing a lot of good things, but in my case, I use it now, to produce a PostScript file with printed code. 

In Mac OS X it can be installed using brew:

<pre>
<code>brew install enscript</code>
</pre>

So, here is a good example using encsript :

{% highlight PowerShell %}
enscript -1rG --line-numbers -p - \
  --highlight=javascript --color=1 -c script.js > ~/script.ps \
  && open ~/script.ps
{% endhighlight %}

Everything is pretty clear, but

-	**1** is for printing one page per sheet
-	**r** is for album mode, remove it to print for usual book mode
-	**p** is for producing ps output, after that it piped to file ~/out.ps
-	**color=0** for black/white mode
-	**color=1** for colored mode
-	**c** is for cutting lines, if they are bigger than the actual width of a sheet. There is also –word-wrap option

Another example with automatic conversion to pdf using <code>ps2pdf</code> :

{% highlight PowerShell %}
enscript -1G --line-numbers -p - \
  --word-wrap -f Leon\ Regular --highlight=javascript --color=1 script.js | \
  pstopdf -i -o script.pdf && open script.pdf
{% endhighlight %}

In conclusion, if you need your <code>code files printed</code> (ruby, perl, html, js, c#), you can easily use this method to print them. Also, some automated scripts could be set up, to make the process simplified.

Simple problem, simple solution.