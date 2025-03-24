## Birthday Greetings

Birthday Greetings exercise solution with a TDD outside in approach from [Massimo Iacolare](https://github.com/iacoware), in turn inspired from [Matteo Vaccari's one](http://matteo.vaccari.name/blog/archives/154.html)

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

### Notes

See [TODO](TODO.md) and commit history to follow developement steps: following the "no match", "one match", "many matches", "errors" testlist pattern as a guide,
we then apply an oustide-in approach by putting our test “clamps” on the edges, ingesting a real csv file and interacting with a working local smtp server
to check sent emails.

By trying to stick to an _incremental_ and _iterative_ approach, we add features and refactor code, extracting non-core logic in collaborators.

When the requirements are met, we keep focusing on the architecture, introducing dependency injection and dependency inversion principle, 
and separating core objects from infrastructure ones, to reach a more “hexagonal architecture” form.

This allows the application to make use more easily of potential new collaborators, for example like an employee database as EmployeeCatalog
or a Slack client as PostalOffice.

### Links
- https://github.com/mailhog/MailHog
- https://nodemailer.com/

---

### Install
```shell
npm install
```

### Run tests
run tests in watch mode
```shell
npm run test:w
```
run typecheck in watch mode
```shell
npm run tc:w
```

### Demo instructions
launch MailHog local smtp server
```shell
./start-local-smtp-server.sh
```
run demo
```shell
npm run demo
```
check sent email on http://localhost:8025/
