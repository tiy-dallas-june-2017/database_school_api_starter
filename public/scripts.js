console.log("I'm running.");

fetch('/api/students')
  .then(function(response) {
    return response.json();
  })
  .then(function(results) {
    let studentList = document.querySelector('#studentList');

    studentList.addEventListener('click', function(evt) {
      console.log(evt.target.getAttribute('data-student-id'));
      let studentId = evt.target.getAttribute('data-student-id');
      fetch(`/api/students/${studentId}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(results) {
          console.log(results);
          let studentDetailsElement = document.querySelector('#studentDetails');

          studentDetailsElement.innerHTML = `
            <div>ID: ${results.student_id}</div>
            <div>Name: ${results.first_name} ${results.last_name}</div>
            <div>Email: ${results.email}</div>
            <div>Gender: ${results.gender}</div>
          `;
        });
    });

    //1. Loop the results array using a foreach.
    results.forEach(function(student) {
      let listItem = document.createElement('li');
      listItem.innerHTML = `${student.first_name} ${student.last_name}`;
      listItem.setAttribute('data-student-id', student.student_id);
      studentList.appendChild(listItem);
      //let listItemMarkup = `<li>${student.firstName}</li>`;
      //console.log(student);
    });
  });
