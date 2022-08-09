const myform = document.getElementById('myform')
const title = document.getElementById('title')
const body = document.getElementById('description')
const articles = document.getElementById('articles')


let article_id;

const getAllData = () => {
    fetch('http://127.0.0.1:5000/get', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(resp => resp.json())
        .then(data => renderArticles(data))
        .catch(error => console.log(error))
}


const insertData = (newData) => {
    fetch('http://127.0.0.1:5000/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newData)
        })
        .then(resp => resp.json())
        .then(() => {
            getAllData()
        })
        .catch(error => console.log(error))
}

const deleteData = (id) => {
    console.log(id);
    fetch(`http://127.0.0.1:5000/delete/${id}/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    getAllData()

}

const updateData = (id) => {
    console.log(id);
    fetch(`http://127.0.0.1:5000/get/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(resp => resp.json())
        .then(data => {
            renderOneItem(data)
        })

    getAllData()

}

const renderOneItem = (mydata) => {
    title.value = mydata.title
    body.value = mydata.body
    article_id = mydata.id
}

const updateDataAfterRefillOnInputBoxes = (article_id, mydata) => {
    fetch(`http://127.0.0.1:5000/update/${article_id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(mydata)
        })
        .then(resp => resp.json())
        .then(data => {
            getAllData()
        })

}

myform.addEventListener('submit', (e) => {
    e.preventDefault()
    const newData = {
        title: title.value,
        body: body.value
    }
    if (article_id) {
        updateDataAfterRefillOnInputBoxes(article_id, newData)
        article_id = ''
    } else {
        insertData(newData)

    }
    myform.reset()
    console.log("Hello to electron js")
})

function renderArticles(mydata) {
    articles.innerHTML = '';
    mydata.forEach(data => {
        articles.innerHTML += `
        <div class="card card-body my-2">
            <h2>${data.title}</h2>
            <p>${data.body}</p>
            <h5> ${data.date} </h5>
            <p>
                <button class = "btn btn-danger" onclick = "deleteData('${data.id}')">Delete</button>
                <button class = "btn btn-success" onclick = "updateData('${data.id}')">Update</button>
            </p>
        </div> 
        `
    })
}

getAllData()