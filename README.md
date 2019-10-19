# CleanChat

This is a chat app that is intended to be, once and for all, the

## ONE CHAT APP TO RULE THEM ALL

You can see the current status of the app here: https://clean-chat-app.herokuapp.com

(update 10/11/2019: the site is now available over HTTPS. Attempts to load the frontend with HTTP will result in issues)

(update 10/18/2019: there is now an experimental client for old versions of Windows, from 3.1 through XP, available here: ftp://casablanca25.mynetgear.com/software/Win9x/programs/Internet/Chat%20Clients/CCAVB3.zip)

Since the app is under active development, the functionality of the app will change frequently. Anything you do on the app right now may be destroyed as I push updates and nuke the database here and there.

Here's a list of what this chat app will be:

* Open source
* Openly documented
* Usable in everyday life for all your chat app needs, that you may have previously used several discrete apps for, all with their advantages and disadvantages
* Cross-platform: This is intended to be the most cross-platform chat app ever made. Users are encouraged to build their own clients using the documentation and source code provided.
* DMs, group messaging, and voice and video chat included and working on all platforms

Right now the backend is built in Node.js with Express, and the web frontend using React. Once proper functionality is achieved, more clients will be built for other platforms and systems, including smartphones.


## API Documentation

All of these are at the URL https://clean-chat-app.herokuapp.com (or you can use plain HTTP if you so desire)

Authenticate each request by setting the HTTP header Authentication to the session ID you are given when logging in.


GET /status -- API status


POST /auth -- logs in. Needs "username" and "password"

GET /auth/status -- tells you whether you are logged in or not

GET /auth/logout -- logs out


POST /users -- create a new user. Needs "username", "email" (can be empty), "password", "displayname"

GET /users/:userId -- info for a particular user

GET /users/username/:username -- info for a particular user, found by username instead of id

GET /users/:userId/contacts -- a particular user's contacts

PUT /users/:userId -- update a user's info


GET /groups -- list of public groups

GET /groups/:groupId -- info for a particular group

GET /groups/foruser/:userId -- list of private and DM groups a certain user is a member of

GET /groups/:groupId/messages/:startmsg/:endmsg -- list of messages for a group, from startmsg to endmsg index

GET /groups/dms/:user1_id/:user2_id -- gets the ID of a DM group between two users - creates the group if nonexistent

GET /groups/:groupId/users -- list of users who are members of a group

POST /groups/:groupId/messages -- add a message to the group's messages array. Needs "text", "image" (a URL), "video" (a URL), "url" (a supplementary URL), and "userId" (user adding the message)

PUT /groups/:groupId/messages -- edit a message. Needs the message info, "userId", and "id"

DELETE /groups/:groupId/messages -- delete a message. Needs "userId" and "id"


See the source code for more information.








## License

This project was created by Collin Brockway, and is licensed under the following:

MIT License

Copyright (C) Collin Brockway, and (C) Facebook, Inc. and its affiliates (React)

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
