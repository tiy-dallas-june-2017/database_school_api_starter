fetch('/api/teachers')
  .then(function(response) {
    return response.json();
  })
  .then(function(results) {
    let teacherList = document.querySelector('#teacherList');

    teacherList.addEventListener('click', function(evt) {
      console.log(evt.target.getAttribute('data-teacher-id'));
      let teacherId = evt.target.getAttribute('data-teacher-id');
      fetch(`/api/teachers/${teacherId}`)
        .then(function(response) {
          return response.json();
        })
        .then(function(results) {
          console.log(results);
          let teacherDetailsElement = document.querySelector('#teacherDetails');

          teacherDetailsElement.innerHTML = `
            <div>ID: ${results.teacher_id}</div>
            <div>Name: ${results.first_name} ${results.last_name}</div>
          `;
        });

      fetch(`/api/teachers/${teacherId}/subjects`)
        .then(function(response) {
          return response.json();
        })
        .then(function(results) {
          console.log(results);

          let teacherSubjectsElement = document.querySelector(
            '#teacherSubjects'
          );

          let teacherSubjects = '<h3>Subjects Taught</h3>';
          results.forEach(function(subject) {
            teacherSubjects += `<div>${subject.subject_name}</div>`;
          });

          teacherSubjectsElement.innerHTML = teacherSubjects;
        });
    });

    //1. Loop the results array using a foreach.
    results.forEach(function(teacher) {
      let listItem = document.createElement('li');
      console.log(teacher);
      listItem.innerHTML = `${teacher.first_name} ${teacher.last_name} - Subjects Taught: ${teacher.subjects_taught}`;
      listItem.setAttribute('data-teacher-id', teacher.teacher_id);
      teacherList.appendChild(listItem);
      //let listItemMarkup = `<li>${student.firstName}</li>`;
      //console.log(student);
    });
  });
