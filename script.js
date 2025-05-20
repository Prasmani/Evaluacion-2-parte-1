const students = [];

const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const gradeInput = document.getElementById("grade");

document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Resetear mensajes de error previos
  nameInput.setCustomValidity("");
  lastNameInput.setCustomValidity("");
  gradeInput.setCustomValidity("");

  const name = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const grade = parseFloat(gradeInput.value);

  let hasError = false;

  if (!name) {
    nameInput.setCustomValidity("Por favor, ingresa el nombre.");
    nameInput.reportValidity();
    hasError = true;
  }

  if (!lastName) {
    lastNameInput.setCustomValidity("Por favor, ingresa el apellido.");
    lastNameInput.reportValidity();
    hasError = true;
  }

  if (isNaN(grade)) {
    gradeInput.setCustomValidity("Por favor, ingresa una nota válida.");
    gradeInput.reportValidity();
    hasError = true;
  } else if (grade < 1 || grade > 7) {
    gradeInput.setCustomValidity("La nota debe estar entre 1.0 y 7.0.");
    gradeInput.reportValidity();
    hasError = true;
  }

  if (hasError) return;

  const student = { name, lastName, grade };
  students.push(student);
  addStudentToTable(student);
  calcularPromedio();
  this.reset();
});

const tableBody = document.querySelector("#studentsTable tbody");

function addStudentToTable(student) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${student.name}</td>
    <td>${student.lastName}</td>
    <td>${student.grade.toFixed(1)}</td>
  `;
  tableBody.appendChild(row);
}

const averageDiv = document.getElementById("average");

function calcularPromedio() {
  if (students.length === 0) return;
  const suma = students.reduce((acc, cur) => acc + cur.grade, 0);
  const promedio = suma / students.length;
  averageDiv.textContent = `Promedio General del Curso: ${promedio.toFixed(2)}`;
}
