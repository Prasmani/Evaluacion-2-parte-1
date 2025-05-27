/************************************************************
 * DECLARACIÓN DE VARIABLES GLOBALES
 ************************************************************/
const students = [];

const nameInput = document.getElementById("name");
const lastNameInput = document.getElementById("lastName");
const gradeInput = document.getElementById("grade");
const tableBody = document.querySelector("#studentsTable tbody");
const averageDiv = document.getElementById("average");
const totalStudentsDiv = document.getElementById("total-students");
const approvedStudentsDiv = document.getElementById("approved-students");
const failedStudentsDiv = document.getElementById("failed-students");

/************************************************************
 * FUNCION: Calcular estadísticas
 ************************************************************/
function calcularEstadisticas() {
  const total = students.length;
  const aprobados = students.filter(student => student.grade >= 4.0).length;
  const reprobados = total - aprobados;
  
  totalStudentsDiv.textContent = `Total de estudiantes: ${total}`;
  approvedStudentsDiv.textContent = `Cantidad de aprobados: ${aprobados}`;
  failedStudentsDiv.textContent = `Cantidad de reprobados: ${reprobados}`;
}

/************************************************************
 * EVENTO: Envío del Formulario
 ************************************************************/
document.getElementById("studentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Validaciones y limpieza de errores
  nameInput.setCustomValidity("");
  lastNameInput.setCustomValidity("");
  gradeInput.setCustomValidity("");

  const name = nameInput.value.trim();
  const lastName = lastNameInput.value.trim();
  const grade = parseFloat(gradeInput.value);
  const fecha = new Date().toLocaleDateString();

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
  if (isNaN(grade) || grade < 1 || grade > 7) {
    gradeInput.setCustomValidity("La nota debe estar entre 1.0 y 7.0.");
    gradeInput.reportValidity();
    hasError = true;
  }
  if (hasError) return;

  const student = { name, lastName, grade, fecha };
  students.push(student);
  renderTable();
  calcularPromedio();
  calcularEstadisticas();
  this.reset();
});

/************************************************************
 * FUNCION: Renderizar la tabla completa
 ************************************************************/
function renderTable() {
  tableBody.innerHTML = "";
  students.forEach((student, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${student.name}</td>
      <td>${student.lastName}</td>
      <td>${student.grade.toFixed(1)}</td>
      <td>${student.fecha}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-modificar" data-index="${index}" title="Modificar">✏️</button>
          <button class="btn-eliminar" data-index="${index}" title="Eliminar">🗑️</button>
        </div>
      </td>
    `;
    tableBody.appendChild(row);

    row.querySelector(".btn-eliminar").addEventListener("click", eliminarEstudiante);
    row.querySelector(".btn-modificar").addEventListener("click", modificarEstudiante);
  });
}

/************************************************************
 * FUNCION: Calcular promedio
 ************************************************************/
function calcularPromedio() {
  if (students.length === 0) {
    averageDiv.textContent = "Sin notas registradas.";
    return;
  }
  const suma = students.reduce((acc, s) => acc + s.grade, 0);
  const promedio = suma / students.length;
  averageDiv.textContent = `Promedio General del Curso: ${promedio.toFixed(2)}`;
}

/************************************************************
 * FUNCION: Eliminar estudiante
 ************************************************************/
function eliminarEstudiante(event) {
  const index = parseInt(event.target.getAttribute("data-index"));
  students.splice(index, 1);
  renderTable();
  calcularPromedio();
  calcularEstadisticas();
}

/************************************************************
 * FUNCION: Iniciar modificacion de estudiante
 ************************************************************/
function modificarEstudiante(event) {
  const row = event.target.closest("tr");
  const index = parseInt(event.target.getAttribute("data-index"));

  const student = students[index];
  row.innerHTML = `
    <td><input type="text" value="${student.name}" class="edit-name"></td>
    <td><input type="text" value="${student.lastName}" class="edit-lastname"></td>
    <td><input type="number" value="${student.grade}" class="edit-grade" min="1" max="7" step="0.1"></td>
    <td>${student.fecha}</td>
    <td>
      <div class="action-buttons">
        <button class="btn-guardar" data-index="${index}" title="Guardar">💾</button>
      </div>
    </td>
  `;

  row.querySelector(".btn-guardar").addEventListener("click", function () {
    guardarModificacion(index, row);
  });
}

/************************************************************
 * FUNCION: Guardar Modificaciones
 ************************************************************/
function guardarModificacion(index, row) {
  const newName = row.querySelector(".edit-name").value.trim();
  const newLastName = row.querySelector(".edit-lastname").value.trim();
  const newGrade = parseFloat(row.querySelector(".edit-grade").value);

  if (!newName || !newLastName || isNaN(newGrade) || newGrade < 1 || newGrade > 7) {
    alert("Por favor, ingresa valores válidos.");
    return;
  }

  students[index].name = newName;
  students[index].lastName = newLastName;
  students[index].grade = newGrade;

  renderTable();
  calcularPromedio();
  calcularEstadisticas();
}

// Inicializar estadísticas al cargar la página
calcularEstadisticas();