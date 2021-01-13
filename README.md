# How to DENO

This project is part of our 5th year of Master Degree graduation.
It's aiming at beginner/intermediate developers.

*This is school project to teach other developers/students how to start with Deno*


### Examples

#### Filesystem

If you want to start the filesystem example use that command in your CLI (Command Line Interface) :
```
 deno run --unstable --allow-net --allow-read --allow-write fs/filesystem.ts
```

#### Web Server

**_If you want to start the web server examples use these command in your CLI (Command Line Interface)
Note that there are three examples available :_**

##### Web server only

```
 deno run --allow-net --allow-read --allow-plugin --unstable --watch ./webserver/webserv.ts
```

##### Web server with a local instance of mongo DB

```
 deno run --allow-net --allow-read  --allow-plugin --allow-env --unstable --watch ./webserver/mongo/webserv_localmongo.ts
```

##### Web server with a cloud instance of mongo DB

```
 deno run --allow-net --allow-read --allow-plugin --allow-env --unstable --watch ./webserver/mongo/webserv_mongocloud.ts
```