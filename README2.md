> Disclaimer: A new assignment was given in August 2014 (about 2 months after this project was created) involving the extension of the project. Check out the original `README.md` for the previous Solution Design, and as always, a continuous deployment can be found by visiting the [http://domo-arigato-origami.herokuapp.com][live demo].

# Solution Design [v2]

In order to satisfy criteria outlined in the second Software Requirements Specification, I have designed the following solution for Takumi Nakamura:

Takumi has been dealt with in the past, so it makes sense to build on top of the web application that has already been created for him. Since it was built on solid foundations with future expansion and scalability in mind, only a few minor tweeks and additions are required.

Like last time, the new features will be implemented using Ruby. Data is already saved to text files in the existing system, so extending this functionality to handle a waiting list will save time and money. As always, my JTask library will be used to read and write to the text files. New icons introduced are credit to the Open Source IcoMoo library. Again, you can find a full list of the currrent application's features in the foreword of the original `README.md` file.

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
| CREATE    | fname: Adam, lname: Mac, phone: 0234567854, email: x@x.com  | save | save     | [Screenshot][test-1] |
| READ      | SELECT NAME WHERE ID = `4`                | Adam            | Adam            | [Screenshot][test-2] |
| UPDATE    | UPDATE ID `5` WITH fname "John"           | John            | John            | [Screenshot][test-3] |
| DESTROY   | DELETE ID `2`                             | nil             | nil             | [Screenshot][test-4] |
| ...       |                                           |                 |                 |                      |
| INVALID   | fname: , lname: , phone: Hi, email: No.   | throw validation error | throw validation error | [Screenshot][test-5] |

### Questions

**Q: When you explain that including security measures and encryption features into the solution will take a little longer and therefore cost a bit more, Takumi argues that as the data being transmitted is not sensitive in nature you do not need to include security or encryption. Discuss this and present an argument for inclusion of security and encryption.**

**A:** When collecting any information from a member of the public, it becomes the direct responsibility of the collector to do everything in their power to protect it from unauthorised access. In the case of Takumi's bookings system, I would ultimately argue in favor the use of encryption for most of the stored data. The strongest argument supporting the use of encryption would be that if someone somehow gained access to the text file database, they wouldn't be able to interpret the data without knowing the salt used to hash it - particularly appealing since email addresses and phone numbers are stored in the system. Furthermore, plain text files don't have the same security features that proper databases have - meaning the database is extremely susceptible to an identity fraud hacker if some form of encryption wasn't used. Encryption WILL slow the system down slightly (data must be encrypted an decrypted constantly), however completed lessons and old waiting list records are now automatically deleted - reducing the amount of time needed to read the text file. For someone who knows what they are doing, this feature shouldn't take more than a couple of hours to implement system wide (in terms of this application) - but it could be far more costly in a larger system. Passwords were already encrypted in my original system.

**Q: One of your friends, who is also a programmer has written a similar solution for another company and still has some of the code he created. He offers you this so that you can include it in your solution for Domo Arigato Origami. Should this offer be accepted? Explain why or why not.**

**A:** Today, sharing code is an integral part of programming - why reinvent the wheel? It's important to always check the license of software before you include it in your project, however. If the friend released the code as *open source*, meaning it can be used and redistributed by anyone for free (possibly with some restrictions) - we should use it in our project if it's going to save time and be useful. If the friend, however, wrote the software while he was working for his employer - the chances are it's copyrighted to the business and we can't use it. Either way, we'll need to get a definite response from the friend before we may proceed.