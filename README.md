# TalkNet

TalkNet is social network. Created using MERN stack. Main programming language — TypeScript.

## Application Architecture

Entire application now consist of 3 main parts (services):

-   `Client` is web-application (SPA).

-   `Main Server` provides API for interracting with database.

-   `Messenger Service` is used to update info about messages and chats in real time by using WebSocket protocol.

This services' architectures:

> `Client` — Feature Sliced Design

> `Main Server` — MVC

> `Messenger Service` — Hasn't any specific architecture

## Cross-Service data flow

Was decided to don't give `Messenger Service` access to the data base.<br/>
Because MongoDB doesn't provide data standardization, this decision excludes errors related to incorrect data formats in data base's documents cuz only `Main Server` has access to the data base.<br/>
This decision also increases speed of development and reliability.

Doing so `Messenger Service` become acting like some type of proxy (or some kind of interface engine maybe) and this will have the same problems which have proxy technology, and the main of them is increasing the time to wait for a response from the server.

![Cross-Service data flow scheme](/TalkNet_cross-service_data_flow.png)

# Data Base Scheme

![Data base scheme](/DB_Scheme.png)

# WARNING

This application won't show up in searches cuz index.html includes:

```bash
<meta name="robots" content="noindex" />
```

It's required cuz this is non-commercial pet-project made for educational purposes.
