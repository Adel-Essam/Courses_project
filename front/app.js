fetch("http://localhost:8000/api/courses").then((res) =>
    res.json().then((data) => {
        console.log(data);
    })
);
