const inquirer = require('inquirer');
const mysql = require('mysql2');
const consoleTable = require('console.table');

// Create Connection To Database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '',
  database: 'employeeDB'
});

connection.connect((err) => {
  if (err) throw err;
  console.log('CONNECTION TO DATABASE SUCCESSFUL!');
  promptUser();
});

const promptUser = () => {
  inquirer.prompt({
    type: "list",
    name: "task",
    message: "What would you like to do?",
    choices: [
      "View Employees",
      "View Roles",
      "View Departments",
      "Add Employee",
      "Add Role",
      "Add Department",
      "Update Employee Role",
      "Exit"]
  })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          queryTable("employee", `SELECT * FROM employee`);
          break;
        case "Add Employee":
          addEmployee();
          break;

        case "View Departments":
          queryTable("department", `SELECT * from department`)
          break;
        case "Add Department":
          addDepartment();
          break;

        case "View Roles":
          queryTable("role", `SELECT * from role`);
          break;
        case "Add Role":
          addRole();
          break;

        case "Update Employee Role":
          updateEmployee();
          break;

        case "End":

          connection.end();
          break;
      }
    });
}

// Function to display tables
function queryTable(tableName, queryString) {

  let queryForTable = queryString

  connection.query(queryForTable, (err, res) => {
    if (err) throw err;

    console.log("==============================================")
    console.table(res);
    console.log("Displaying" + tableName)
    console.log("==============================================")

    promptUser()
  });
}

//  Add employee function
function addEmployee() {

  let employeeTbl = 'SELECT * FROM employee'

  connection.query(employeeTbl, (err, res) => {
    if (err) throw err;
    console.table(res);
  });

  getRole();

}

// Get role
function getRole() {

  let roleTable = `SELECT role.id, role.title FROM role`

  connection.query(roleTable, (err, res) => {
    if (err) throw err;

    let roleChoices = res.map(({ id, title }) => ({
      value: id,
      title: `${id} ${title}`
    }));

    console.table(res);

    promptAddEmployee(roleChoices);

  });
}

// Add employee inquiry
function promptAddEmployee(roleChoices) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "Employee first name: "
      },
      {
        type: "input",
        name: "last_name",
        message: "Employee last name: "
      },
      {
        type: "list",
        name: "role_id",
        message: "Employee role: ",
        choices: roleChoices
      },
      {
        type: "input",
        name: "manager_id",
        message: "Manager ID?",
      },
    ])
    .then((answer) => {
      console.log(answer)
      try {
        let query = 'INSERT INTO employee SET ?'
        connection.query(query, answer, (error, results, fields) => {
            if (error) throw error;
          });

        // Update table and display
        let updateTable = 'SELECT * FROM employee'

        connection.query(updateTable, (err, res) => {
          console.table(res);
        });
      }
      catch (error) {
        console.log("Role could not be added, try again!");
      }
      promptUser();
    });
}

function updateEmployee() {
  let employeeTable = 'SELECT * FROM employee'

  connection.query(employeeTable, function (err, res) {
    console.table(res);
  });

  inquirer.prompt([
    {
      type: 'input',
      name: 'id',
      message: 'Please enter the employee id you wish to update: '
    },
    {
      type: 'input',
      name: 'role_id',
      message: 'Enter new role id: '
    },
    {
      type: 'input',
      name: 'manager_id',
      message: 'Enter new manager id: '
    }
  ]).then((answer) => {
    console.log(answer);

    let updateQuery = `UPDATE employee SET role_id='${answer.role_id}' WHERE id='${answer.id}'`

    connection.query(updateQuery, (err, res) => {
      if (err) throw err;
    })
    
    // Update table and display
    let updateTable = 'SELECT * FROM employee'

    connection.query(updateTable, (err, res) => {
      console.table(res);

    });
    promptUser();
  })
}

//add a role
function addRole() {
      var roleTable = 'SELECT * FROM role'
      connection.query(roleTable, (err, res) => {
        console.table(res);
      })

      var query = `SELECT department.id, department.name from department`

      connection.query(query, (err, res) => {
        if (err) throw err;

        const deptChoices = res.map(({ id, name }) => ({
          value: id, name: `${id} ${name}`
        }));

        promptAddRole(deptChoices);
      });
    }

function promptAddRole(deptChoices) {
      inquirer
        .prompt([
          {
            type: "input",
            name: "title",
            message: "Title for role?"
          },
          {
            type: "input",
            name: "salary",
            message: "Salary of role?"
          },
          {
            type: "list",
            name: "department_id",
            message: "Department of role?",
            choices: deptChoices
          },
        ])
        .then((answer) => {
          console.log(answer)
          try {
            var query = connection.query('INSERT INTO role SET ?', answer,
              (error, results, fields) => {
                if (error) throw error;

              });
          }
          catch (error) {
            console.log("Role could not be added, please try again!");
          }

          promptUser();
        });
    }

// add a new department
function addDepartment() {

      let query = 'SELECT * FROM department'
      connection.query(query, (err, res) => {

        console.table(res);

      });

      addDeptPrompt();
    }
// add department 
function addDeptPrompt() {
      inquirer
        .prompt([
          {
            type: "input",
            name: "name",
            message: "Department name?"
          },
        ])
        .then((answer) => {
          console.log(answer)
          try {
            var query = connection.query('INSERT INTO department SET ?', answer,
              (error, results, fields) => {
                if (error) throw error;

              });
          }
          catch (error) {
            console.log("Department could not be added, try again");
          }

          promptUser();
        });
    }