> Disclaimer: A new assignment was given in August 2014 (about 2 months after this project was created) involving the extension of the project. Check out the original `README.md` for the previous Solution Design, and as always, a continuous deployment can be found by visiting the [http://domo-arigato-origami.herokuapp.com][live demo].

# Solution Design [v2]

In order to satisfy criteria outlined in the second Software Requirements Specification, I have designed the following solution for Takumi Nakamura:

Takumi has been dealt with in the past, so it makes sense to build on top of the web application that has already been created for him. Since it was built on solid foundations with future expansion and scalability in mind, only a few minor tweeks and additions are required.

Like last time, the new features will be implemented using Ruby. Data is already saved to text files in the existing system, so extending this functionality to handle a waiting list will save time and money. As always, my JTask library will be used to read and write to the text files. Again, you can find a full list of the currrent application's features in the foreword of the original `README.md` file.

### Annotated UI Mockup

...

### New Data Dictionary

#### WaitList Model @ `storage/waiting_list.json`

|:-------------:|:-------------:|:-----:|:----------------------------------------------------------------------------------|
| Data Item     | Data Type     | Size* | Description                                                                       |
|:-------------:|:-------------:|:-----:|:----------------------------------------------------------------------------------|
| id            | string        | 255   | The unique id number of the lesson booking. |
| first_name    | string        | 255   | The first name of the student. |
| last_name     | string        | 255   | The last name of the student. |
| email         | string        | 255   | Student's email address. |
| phone         | string        | 255   | Student's phone number. |
| created_at    | string        | 255   | Timestamp containing the exact date-time of the original save. |
| updated_at    | string        | 255   | Timestamp of the last update of the record. |

> *The VCAA [clearly stipulates][vcaa] that "databases cannot be used to support solutions". Therefore, I will be using text files to create, read, update and destroy data for the system and the `size` of each data item will be irrelevant. It is worth noting, however, that in a real world scenario this technique would not be scalable and a proper database would be used to prevent the obvious security and performance issues.


### Algorithm For Text File Manipulation

```php
// Save new record
POST "/waiting_list" {
  // Collect the post data from the request
  fname = INPUT(:fname)
  lname = INPUT(:lname)
  number = INPUT(:phone_number)
  email = INPUT(:email)

  // Initialize timestamps
  current_time = Time.now

  // Save client to the waiting list
  SAVE "waiting_list.json" {
    first_name: fname,
    last_name: lname,
    phone: number,
    email: email,
    created_at: current_time,
    updated_at: current_time
  }
}
```

### Testing Table

| Scenario  | Test Data                                 | Expected Result | Actual Result   | Evidence             |
|:---------:|:-----------------------------------------:|:---------------:|:---------------:|:--------------------:|
| CREATE    | fname: Adam, lname: Mac, phone: xxxxxxx, email: x@x.com | true            | true            | [Screenshot][test-8] |
| READ      | SELECT WHERE ID = `4`                     | 75              | 75              | [Screenshot][test-1] |
| UPDATE    | UPDATE ID `5` WITH fname "John"           | 100             | 100             | [Screenshot][test-2] |
| DESTROY   | DELETE ID `2`                             | 100             | 100             | [Screenshot][test-3] |
| ...       |                                           |                 |                 |                      |
| INVALID   | fname: , lname: , phone: Hi, email: No.   |                 |                 |                      |