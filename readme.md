> Notice: This repository contains an assessment for my high school Software Development class. Chances are you don't want to be here, but if you do - read on. A live continuous deployment of the project can be found at [http://domo-arigato-origami.herokuapp.com][demo].

# Solution Design

In order to satisfy criteria outlined in the Software Requirements Specification, I have designed the following solution for Takumi Nakamura:

This solution will take the form of a **web application**. Using this approach will provide Tukumi with a number of advantages, the most noteworthy being **accessibility** and the potential to **expand the scope** of the system in the future. The [live demo][demo] shows the latest working example as it would appear on Takumi's custom domain name (eg - www.arigato-origami.com), and can therefore be accessed from anywhere in the world with a persistent internet connection. As opposed to a traditional "local" `.exe` software solution, a web application will have **no compatibility issues** with PC, Mac or Linux operating systems and works out-of-the-box with Desktop Computers, Laptops, Tablet Devices and Smart Phones. Furthermore, since it is available online, Takumi can still interact with their system if they're out of the office or away on a holiday.

A web application will also allow Takumi to expand the scope of the system in the future. When the workload for manually inputting orders & classes becomes unmanageable - the system can be opened up to customers as a full public website so that they can do it themselves. This would not be difficult, as the foundations for the program will already be laid. Nevertheless, the private version will remain password protected for obvious reasons until Takumi chooses launch a proper website.

The core functionality of this application will be written in [Ruby][ruby_lang], a programming language that has elegant syntax, is natural to read and easy to write. More specifically it will use a tiny DSL called [Sinatra][sinatra_rb], as well as a powerful text file database platform I created myself called [JTask][jtask] - both of which run on Ruby. Supporting languages (which are *only involved* in the presentation of the user interface) are HTML, CSS and JavaScript.

Sounds fun, right? Let's get the party started...

### Algorithm For Calculation(s) [Pseudocode]

```php
// Set the base cost price of an origami lesson. The default value
// is $25.00, however this value can be changed by an admin (on the settings page).
lesson_price = Input lesson_price

Function calculate_lesson_price(num_lessons, order_cost)
  grand_total = num_lessons * lesson_price
  IF num_lessons > 4
    // Apply a 20% discount
    grand_total = discount(grand_total, 0.2)
  ELSEIF order_cost > 50
    // Apply a 10% discount
    grand_total = discount(grand_total, 0.1)
  END IF

  return grand_total
End Function

Function discount(price, percentage)
  return price - (price * percentage)
End Function

Function gst(total)
  return total * 0.1
End Function

total = calculate_lesson_price(3)
gst = gst(total)

// Show our awesome work to the world...
PRINT "Hello, world! Your total invoice price is $" + total + " plus $" + (total * 0.1) + " GST."
// If someone orders just 3 lessons (with no additional goods),
// the above line should return as:
// "Hello, world! Your total invoice price is $75 plus $7.5 GST."
```

### Data Dictionaries

#### User Model @ `storage/users.json`

| Data Item     | Data Type     | Size* | Description                                                                       |
|:-------------:|:-------------:|:-----:|:----------------------------------------------------------------------------------|
| id            | integer       | 255   | The unique id number of the user.                                                 |
| username      | string        | 15    | Contains the username in plain text format.                                       |
| password      | string        | 255   | The password that the user has chosen (hashed using enterprise grade encryption). |
| salt          | string        | 255   | The random security salt that was generated to encrypt the password.              |

#### Price Model @ `storage/prices.json`

| Data Item     | Data Type     | Size* | Description                                                                       |
|:-------------:|:-------------:|:-----:|:----------------------------------------------------------------------------------|
| lesson_price  | integer       | 255   | The custom price of a lesson (default: 25) |

#### Lesson Model @ `storage/lessons.json`

| Data Item     | Data Type     | Size* | Description                                                                       |
|:-------------:|:-------------:|:-----:|:----------------------------------------------------------------------------------|
| id            | string        | 255   | The unique id number of the lesson booking. |
| first_name    | string        | 255   | The first name of the student. |
| last_name     | string        | 255   | The last name of the student. |
| email         | string        | 255   | Student's email address. |
| phone         | string        | 255   | Student's phone number. |
| address       | string        | 255   | The student's address/location. |
| lesson_time   | datetime      | 255   | A (generated) timestamp of the lesson time and date. |

> *The VCAA [clearly stipulates][vcaa] that "databases cannot be used to support solutions". Therefore, I will be using text files to create, read, update and destroy data for the system and the `size` of each data item will be irrelevant. It is worth noting, however, that in a real world scenario this technique would not be scalable and a proper database would be used to prevent the obvious security and performance issues.

### Wireframes

<img src="http://imgkk.com/i/7p16.png" align="left" alt="Login Wireframe">
<img src="http://imgkk.com/i/zhij.png" align="right" alt="Wireframe Overview">
<p></p><p></p>
<img src="http://imgkk.com/i/jgho.png" alt="Main Wireframe">
<img src="http://imgkk.com/i/6c9w.png" alt="Color Scheme">

### Testing Table

| Scenario                       | Test Data                                 | Expected Result | Actual Result   | Evidence             |
|:------------------------------:|:-----------------------------------------:|:---------------:|:---------------:|:--------------------:|
| Sign in takumi                 | username: takumi, password: 123456        | true            | true            | [Screenshot][test-8] |
| Get the price of 3 lessons     | lessons: 3, order_cost: 0                 | 75              | 75              | [Screenshot][test-1] |
| 20% discount on 5+ lessons     | lessons: 5, order_cost: 0                 | 100             | 100             | [Screenshot][test-2] |
| Doesn't apply both discounts   | lessons: 5, order_cost: 51                | 100             | 100             | [Screenshot][test-3] |
| 10% discount when > $50        | lessons: 3, order_cost: 175               | 67.5            | 67.5            | [Screenshot][test-4] |
| Returns 0 with no lessons      | lessons: 0, order_cost: 0                 | 0               | 0               | [Screenshot][test-5] |
| Same scenario with order       | lessons: 0, order_cost: 90                | 0               | 0               | [Screenshot][test-6] |
| Calculate the GST              | lessons: 8, order_cost: 0                 | 16              | 16              | [Screenshot][test-7] |
| Update prices (default: 25)    | lesson_price: 28                          | 28              | 28              | [Screenshot][test-9] |

### Are you serious?

Unfortunately.

### Evaluation Criteria

- User sessions work and are secure
- The user interface is not difficult to navigate
- Outputs of the system are clear and accurate
- Website feels smooth and works efficiently
- Prices can be updated
- Lesson prices can be calculated
- GST is calculated correctly
- Code is well formatted and sufficiently documented


  [demo]: http://domo-arigato-origami.herokuapp.com
  [ruby_lang]: https://www.ruby-lang.org
  [sinatra_rb]: http://www.sinatrarb.com/
  [jtask]: https://github.com/adammcarthur/jtask
  [vcaa]: http://www.vcaa.vic.edu.au/Pages/correspondence/bulletins/2010/June/vce_study.aspx#4

  [test-1]: http://imgkk.com/i/1n7y.png
  [test-2]: http://imgkk.com/i/eyqb.png
  [test-3]: http://imgkk.com/i/611k.png
  [test-4]: http://imgkk.com/i/5j2o.png
  [test-5]: http://imgkk.com/i/6e1s.png
  [test-6]: http://imgkk.com/i/imix.png
  [test-7]: http://imgkk.com/i/fbgj.png
  [test-8]: http://imgkk.com/i/l0_v.png
  [test-9]: http://imgkk.com/i/yroj.png
