USE empDB1;

INSERT INTO department (name)
VALUES 
    ('Sales'),
    ('Legal'),
    ('Engineering');

INSERT INTO roles (title, salary, department_id)
VALUES
 ('Sales Lead', '100000.00', 1),
 ('Salesperson', '32000.00', 1),
 ('Legal Team Lead', '120000.00', 2),
 ('Lawyer', '100000.00', 2),
 ('Senior Engineer', '110000.00', 3),
 ('Junior Engineer', '90000.00', 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('Cory', 'Neel', 1, NULL),
    ('Anita', 'Fletcher', 2, 1),
    ('Colleen', 'Gleeson', 3, NULL),
    ('Dylan', 'Gilmore', 4, 3),
    ('Justin', 'Burton', 5, NULL),
    ('Katherine', 'Long', 6, 5);