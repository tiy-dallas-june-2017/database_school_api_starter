console.log("I'm running.");

fetch('/api/students')
  .then(function(response) {
    return response.json();
  })
  .then(function(results) {
    let studentList = document.querySelector('#studentList');

    //1. Loop the results array using a foreach.
    results.forEach(function(student) {
      let listItem = document.createElement('li');
      listItem.textContent = `${student.first_name} ${student.last_name}`;
      studentList.appendChild(listItem);
      //let listItemMarkup = `<li>${student.firstName}</li>`;
    });
  });
