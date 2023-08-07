# TODO-list-App
API - Requirement - Node - PostgreSQL - Express - Prisma - jest - supertest

## User Requirements:
- You can have multiple TODO lists
- A TODO list has a name
- Each TODO list can have multiple TODO items
- Each TODO item has a name and a text body
- You can create, edit and delete TODO items, and lists
- You can move TODO items from a list to another list

## System Requirements:
- 1 route for creating an empty TODO list (POST)
- 1 route for returning all TODO lists that exists, and their sizes
- 1 route for returning all TODO items on a TODO list (GET + pagination)
- 1 route for editing an existing TODO list
- 1 route for deleting an existing TODO list
- 1 route for creating a new TODO item (POST) on an existing TODO list
- 1 route for updating an existing TODO item (PATCH x PUT?)
- 1 route for deleting an existing TODO item (DELETE)
- 1 route for moving a TODO item from a list, to another list
- Import: the HTTP body on requests and response must be JSONs.
- Test it using command cURL or Postman!

