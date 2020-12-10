window.onload = () => {
    startUp();
};

const startUp = () => {
    if (window.sessionStorage.getItem("loc") === null && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        window.sessionStorage.setItem("loc", "unknown");
    }
    loadView();
};

const showPosition = (position) => {
    let lat = position.coords.latitude;
    let longt = position.coords.longitude;
    fetch(`https://geocode.xyz/${lat},${longt}?geoit=json`, {
        method: 'GET'
    })
    .then((response) => {
        if (response.status !== 200) {
            console.log(`Looks like there was a problem. Status code: ${response.status}`);
            window.sessionStorage.setItem("loc", "unknown");
        } else {
            response.json().then((data) => {
                window.sessionStorage.setItem("loc", data.city);
            })
        }
    })
    .catch((error) => {
        console.log("fetch error: " + error);
    })
};

const loadView = () => {
    const name = window.sessionStorage.getItem("name");
    if (name !== null) {
        toBullentin();
    } else {
        const div = document.getElementById("container");
        const view = document.getElementById("name").innerHTML;
        div.innerHTML = view;
    }
};

const onGo = () => {
    const nameInput = document.getElementById("name-input");
    if (nameInput.value.length) {
        window.sessionStorage.setItem("name", nameInput.value);
        toBullentin();
    } else {
        nameInput.innerHTML = '';
    }
};

const toBullentin = () => {
    const div = document.getElementById("container");
    const view = document.getElementById("bullentin").innerHTML;
    div.innerHTML = view;
};

const uploadMessage = () => {
    const message = document.getElementById("message").value;
    if (message.length) {
        const payload = {
            "name": window.sessionStorage.getItem("name"),
            "location": window.sessionStorage.getItem("loc"),
            "message": message,
        }
        fetch(`http://127.0.0.1:5000/upload`, {
            method: "POST",
            headers: new Headers({
                "content-type": "application/json",
            }),
            body: JSON.stringify(payload),
        })
        .then(() => {
            window.location.href = '/';
        })
        .catch((error) => {
            console.log("Fetch error: " + error);
        })
    }
};