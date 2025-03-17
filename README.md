## Birthday Greetings Kata

Personal execution of the Birthday Greetings Kata with a TDD outside in approach from [Massimo Iacolare](https://github.com/iacoware), in turn inspired from Matteo Vaccari's one (http://matteo.vaccari.name/blog/archives/154.html)

### Problem
Develop a CLI application that send a greeting email to all employees whose birthday is today.

The employees are stored in a CSV file (employees.csv) with the following format:

```text
last_name, first_name, date_of_birth, email
Capone, Al, 1951-10-08, al.capone@acme.com
Escobar, Pablo, 1975-09-11, pablo.escobar@acme.com
Wick, John, 1987-09-11, john.wick@acme.com
```

The greetings email should contain the following text:

```text
Subject: Happy birthday!

Happy birthday, dear John!
```

with the first name of the employee substituted for `John`

### Links
- https://github.com/mailhog/MailHog
- https://nodemailer.com/

---

### Recommended setup
- Enable "Format on save" in your IDE

### Commands available through `npm run`
- `test`, `test:w`,
- `typecheck` or `tc`, `typecheck:w` or `tc:w`
- `start`,
