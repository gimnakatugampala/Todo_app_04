const todoList = document.querySelector('#add-list');
const form = document.querySelector('#add-todo-form');

function renderTodo(doc){
    let li = document.createElement('li');
    let task = document.createElement('span');
    let date = document.createElement('span');
    let done = document.createElement('div');

    li.setAttribute('data-id',doc.id);
    task.textContent = doc.data().task;
    date.textContent = doc.data().date;
    done.textContent = 'DONE';

    li.appendChild(task);
    li.appendChild(date);
    li.appendChild(done);

    todoList.appendChild(li);

    //delete data
    done.addEventListener('click',(e) =>{
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('task').doc(id).delete();
    })

}

//saving data
form.addEventListener('submit',(e) =>{
    e.preventDefault();
    db.collection('task').add({
        task:form.task.value,
        date:form.date.value
    })
    form.task.value = '';
    form.date.value = '';
})

//real time database
db.collection('task').orderBy('date').onSnapshot(snapshot =>{
    let changes = snapshot.docChanges();
    changes.forEach(change =>{
        if(change.type == 'added'){
            renderTodo(change.doc)
        }else if(change.type == 'removed'){
            let li = todoList.querySelector('[data-id='+change.doc.id+']');
            todoList.removeChild(li);
        }
    })
})