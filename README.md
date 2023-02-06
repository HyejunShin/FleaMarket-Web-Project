# Flea Market

## Overview


Flea Market is a platform used for buying and selling used or unneeded items – items that are too good to throw away. Users can search for and view lists of items. They can also select a specific category of item (e.g. furniture, clothing, books) they want to look for. To upload or buy an item, users need to register and login. When uploading an item, users need to include images, price, category, and description of the item. When users click the profile of a seller, they can see a list of items sold by the seller. When buying an item, users can use the chat feature to chat with the seller, and the seller can reserve the item to a buyer. Once the seller sells the item, the seller can change the item state from reserved to sold. 


## Data Model

The application will store User_List, User, Item_List, User_Item_List, and Chat.

* the User_List stores the list of user_ids and references to all users
* each User has a reference to User_Item_List and an array of references to Chat documents
* the Item_List stores the comprehensive list of items through referring each item to an item in a User_Item_List

An Example User_List:

```javascript
{
  items: [
    { user_id: "1", user: // a reference to a User document, },
    { user_id: "2", user: // a reference to a User document, },
  ]
}
```

An Example User:

```javascript
{
  id: // a unique numerical id of the User
  username: "User",
  hash: // a password hash,
  item_list: // reference to User_Item_List 
  chat: // an array of references to Chat documents
}
```

An Example Item_List with Embedded Items:

```javascript
{
  items: [
    { user_id: "1", username: "User1", item: // reference to an item in User_Item_List},
    { user_id: "2", username: "User2", item: // reference to an item in User_Item_List},
  ]
}
```

An Example User_Item_List with Embedded Items:

```javascript
{
  items: [
    { id: "1", name: "chair", price: "10", state: "unsold", image: // image data, createdAt: // timestamp},
    { id: "2", name: "table", price: "20", state: "sold", image: // image data, createdAt: // timestamp},
  ]
}
```

An Example Chat:

```javascript
{
  messages: [
    { user_id: "1", username: "User1", message: "Hi, is this item sold?", createdAt: // timestamp},
    { user_id: "2", username: "User2", message: "Not yet.", price: "20", createdAt: // timestamp},
  ]
}
```

## [Link to Commented First Draft Schema](db.mjs) 


## Wireframes

/ - home page

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation.png)

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(1).png)

/login - login page

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(2).png)

/signup - signup page

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(3).png)

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(4).png)

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(8).png)

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(5).png)

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(7).png)

## Site map

![list create](https://github.com/nyu-csci-ua-0467-001-002-fall-2022/final-project-HyejunShin/blob/master/documentation/Untitled%20presentation%20(9).png)


## User Stories or Use Cases

1. as non-registered user, I can view, search, and filter lists of items
2. as non-registered user, I can register a new account with the site
3. as a user, I can log in to the site
4. as a user(selller), I can add items that I want to sell
5. as a user(seller), I can delete items
6. as a user(buyer), I can initiate chat and send chat messages to the seller of the item 
7. as a user(seller), I can respond to chat messages
8. as a user(seller), I can change the state of an item from unsold / reserved / sold

## Research Topics

* (3 points) Perform client side form validation using custom JavaScript
    * errors must be integrated into the DOM
    * check that users input appropriate formats of data during registration and adding item
* (2 points) Using bootstrap for css framework
* (3 points) Use multer middleware/library to store and retrieve images from mongoose
* (3 points) Unit testing with JavaScript using Mocha Chai
* (1 point) Advanced workings with handlebars
  * using handlebars-dateformat library to format date data
  * using hbs.registerHelper to handle data in more complex ways


12 points total out of 10 required points

## [Link to Initial Main Project File](app.mjs) 


## Annotations / References Used

None

