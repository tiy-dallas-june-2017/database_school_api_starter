let teacherList = document.querySelector('#teacherList');

function fillTeacherList() {
  fetch('/api/teachers')
    .then(function(response) {
      return response.json();
    })
    .then(function(results) {
      //Clear the teacher list.
      teacherList.innerHTML = '';
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
}

function fillSubjects(teacherId) {
  fetch(`/api/teachers/${teacherId}/subjects`)
    .then(function(response) {
      return response.json();
    })
    .then(function(results) {
      console.log('Rendering Subjects', results);

      let teacherSubjectsElement = document.querySelector('#teacherSubjects');

      let teacherSubjects = '<h3>Subjects Taught</h3>';
      teacherSubjects += `<form id='addSubjectForm'>
        <input type="hidden" id="newTeacherId" value="${teacherId}"/>
        <input type="text" id='newSubjectName' />
        <button type="submit" id="addSubjectButton">Add Subject</button>
      </form>`;

      results.forEach(function(subject) {
        teacherSubjects += `<div>${subject.subject_name}</div>`;
      });

      teacherSubjectsElement.innerHTML = teacherSubjects;
      listenToAddSubjectButton();
    });
}

fillTeacherList();

let addTeacherButton = document.querySelector('#addTeacherButton');
addTeacherButton.addEventListener('click', function(evt) {
  evt.preventDefault();

  let firstNameElement = document.querySelector('#firstName');
  let lastNameElement = document.querySelector('#lastName');

  let newTeacherData = {
    firstName: firstNameElement.value,
    lastName: lastNameElement.value
  };

  fetch('/api/teachers', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify(newTeacherData)
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(results) {
      console.log('Response from my API.', results);
      fillTeacherList();
    });

  firstNameElement.value = '';
  lastNameElement.value = '';
});

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

  fillSubjects(teacherId);
});

function listenToAddSubjectButton() {
  let addSubjectButton = document.querySelector('#addSubjectButton');
  addSubjectButton.addEventListener('click', function(evt) {
    evt.preventDefault();

    let subjectName = document.querySelector('#newSubjectName');
    let teacherId = document.querySelector('#newTeacherId');

    let newSubjectData = {
      subjectName: subjectName.value,
      teacherId: teacherId.value
    };

    fetch('/api/subjects', {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(newSubjectData)
    })
      .then(function(response) {
        return response.json();
      })
      .then(function(result) {
        console.log(result);
        fillSubjects(teacherId.value);
        fillTeacherList();
      });

    console.log('add subject button works!', newSubjectData);
  });
}
