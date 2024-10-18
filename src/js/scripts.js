var rowCount = 0;

//display list
function getData(){
    var request = new XMLHttpRequest();

    var tBody = document.getElementById('list');
    
    request.open('GET', 'https://jsonplaceholder.typicode.com/todos/');
    request.onload = function(){
        var listData = JSON.parse(request.responseText);

        //rendering html
        var htmlString = "";

        for (i=0; i<listData.length; i++){
            htmlString += "<tr id='" + listData[i].id + "'><td><a href='#'onclick='openItem(" + listData[i].id + ")'>" + listData[i].id + "</a></td><td>" + listData[i].title + "</td><td>" + listData[i].completed + "</td><td><button type='button' class='btn btn-success add' onclick='openEdit("+ listData[i].id +")'>Edit</button></td><td><button type='button' class='btn btn-success del' onclick='deleteItem("+ listData[i].id +")'>Delete</button></td></tr>"; 
        }

        tBody.insertAdjacentHTML('beforeend', htmlString);
        rowCount = tBody.rows.length;
    };
    request.send();
}

//display single list item
function openItem(id){
    var request1 = new XMLHttpRequest();

    var listItem = document.getElementById('item-bg');
    listItem.style.display = 'inline-block';

    request1.open('GET', 'https://jsonplaceholder.typicode.com/todos/' + id);
    request1.onload = function(){
        var item = JSON.parse(request1.responseText);
        
        var id = document.getElementById('itemID');
        var title = document.getElementById('itemTitle');
        var completed = document.getElementById('completed');

        id.innerText = item.id;
        title.placeholder = item.title;
        completed.selectedIndex = item.completed == true ? 0 : 1;
    }
    request1.send();

    //close pop up
    var closePop = document.getElementById('close');
    closePop.addEventListener('click', function(){
        listItem.style.display= 'none';
    });
}

function openEdit(id) {
    var listItem = document.getElementById('edit-bg');
    listItem.style.display = 'inline-block';

    var row = document.getElementById(id);

    if (!row) {
        console.error("Row with ID " + id + " not found.");
        return;
    }

    var title = row.querySelector('td:nth-child(2)').innerText; 
    var completed = row.querySelector('td:nth-child(3)').innerText; 

    document.getElementById('editTitle').value = title; 
    document.getElementById('editcompleted').value = completed; 
    document.getElementById('editID').innerText = id; 

    var closePop = document.getElementById('close1');
    closePop.addEventListener('click', function() {
        listItem.style.display = 'none';
    });
}

function handleEditSubmit(event) {
    event.preventDefault();

    var title = document.getElementById('editTitle').value;
    var completedValue = document.getElementById('editcompleted').value; // Get value from select
    var completed = (completedValue === 'true');
    var id = parseInt(document.getElementById('editID').innerText);

    var request = new XMLHttpRequest();
    request.open("PUT", "https://jsonplaceholder.typicode.com/todos/" + id, true);
    request.setRequestHeader("Content-Type", "application/json");
    request.onload = function(){
        var response = JSON.parse(request.responseText);
        
        //editing based on response
        var id = response.id;
        var row = document.getElementById(id); 
        var title = row.querySelector('td:nth-child(2)'); 
        var completed = row.querySelector('td:nth-child(3)');

        title.innerText = response.title;
        completed.innerText = response.completed;

        alert('edit successful!');
    }

    var newItem = {
        "userId": id,
        "id": id,
        "title": title,
        "completed": completed
    };

    console.log(newItem);

    request.send(JSON.stringify(newItem));
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('edit').addEventListener('submit', handleEditSubmit);
});

function openAdd(){
    var addForm = document.getElementById('add-bg');
    addForm.style.display = 'inline-block';

    var closePop = document.getElementById('close2');
    closePop.addEventListener('click', function() {
        addForm.style.display = 'none';
    });
}

function handleAddSubmit(event){
    event.preventDefault();

    var title = document.getElementById('addTitle').value;
    var completedValue = document.getElementById('addcompleted').value; // Get value from select
    var completed = (completedValue === 'true'); 

    var request = new XMLHttpRequest();
    request.open('POST','https://jsonplaceholder.typicode.com/todos', true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function(){
        var response = JSON.parse(request.responseText);
        
        //adding a new row based on the response
        var htmlString = "<tr id='" + response.id + "'><td><a href='#'onclick='openItem(" + response.id + ")'>" + response.id + "</a></td><td>" + response.title + "</td><td>" + response.completed + "</td><td><button type='button' class='btn btn-success add' onclick='openEdit("+ response.id +")'>Edit</button></td><td><button type='button' class='btn btn-success del' onclick='deleteItem("+ response.id +")'>Delete</button></td></tr>";
        document.getElementById('list').insertAdjacentHTML('beforeend', htmlString);
        alert('added successfully!');
    }

    var newItem = {
        "userId": ++rowCount,
        "title": title,
        "completed": completed
    }

    request.send(JSON.stringify(newItem));
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('add').addEventListener('submit', handleAddSubmit);
});

function deleteItem(id){
    var request = new XMLHttpRequest();
    request.open('POST','https://jsonplaceholder.typicode.com/todos/' + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function(){
        var response = JSON.parse(request.responseText);
        
        //deleting based on the response
        if (JSON.stringify(response) === '{}') {
            var row = document.getElementById(id);
            if (row) {
                row.remove(); 
                alert('deleted successfully!');
            }
        }
    }

    var newItem = {
        "id": id
    }

    request.send(JSON.stringify(newItem));
}




