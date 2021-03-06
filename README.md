## ScienceBlog
ScienceTalk是一款分享科技资讯类文章的博客网站

该网站采用的技术栈主要有：
前端：html+css+javascript+jquery
vue全家桶,elementUI
后端：express框架
数据库：mongodb

该文章借鉴了csdn博客网站的部分设计，主要的功能点有:
主页文章列表显示，
热点文章列表显示，
按照（点赞数排名），
用户登陆与注册，
用户个人信息与头像上传功能，
文章详情页面的展示，
用户点赞评论收藏功能，
用户文章编辑与草稿保存功能，
以及与之相应用户的草稿箱，和写过的文章列表功能。

前端功能介绍：
1.文章首页
包括文章的显示以及热点文章的显示，一般文章是按照日期进行降序排列的，文章是按照点赞数的多少进行排列的。
此外还加入了文章的标题的搜索功能，在输入标题的内容是可以实时显示出检索的标题，点击结果可以检索出文章，在这个搜索功能当中运用到了
防抖技术，保证搜索时不用频繁的向服务器发出请求

2，文章详情页面
显示文章作者的基本信息以及文章的一些基本信息还有文章的内容，支持用用户点赞、评论、以及收藏，还有文章评论功能，

3.个人的信息页面
包括头像上传功能以及个人信息的编辑与修改功能

4.文章编辑页面
文章编辑器采用mavon-editor编辑器，支持带图片的文章的上传，草稿保存以及文章的发布，发布前可以设置文章的标签，类别以及文章的封面

5，文章管理页面
包括该用户写过的文章和草稿箱，已写过的文章可以跳转到详情页面进行浏览。草稿箱中的文章可以进行编辑并重新发布

6.用户管理页面
目前只加入了评论管理模块，主要是用来通知有新的评论

7.用户登陆功能
支持token登陆

8.后台
后台采用express技术，编写了相应的访问接口，支持跨域访问，除邓露和注册接口外均设置有token拦截器，如果token值出现错误或者过期，
不会对后台数据进行成功修改

个人见解：
本项目借鉴了CSDN的部分功能设计以及黑马的多人博客管理系统的经验，该项目的亮点我觉得有以下几点：
1.文章支持显示图片，根据自己看过的部分类似项目，博客文章只是一堆文字，并没有带有图片
2.文章的下拉加载，采用了节流函数，来方式滚动到指定位置加载时，频繁请求的现象

本人本科天坑专业，目前在自学前端找工作，本项目设计得比较简单，适合刚学完vue的初学者进行练手的项目，个人认为不论是什么后台管理系统项目，
其实最核心的点就是前端向后台请求数据后台返回数据交由前端处理和渲染，记住这一点，项目也就不需要局限于后台管理系统这一方面了。编程我觉得
最看重逻辑思维。api什么的忘了可以去查，最重要的是遇到一个需求该怎么解决问题，否则学再多的api也是徒劳。

如果要预览我的项目可以访问以下地址：
http://47.115.132.14:8888/



## MIT License

Copyright (c) 2021 弥勒

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
