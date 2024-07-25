const homebtn = document.getElementById("homebtn")
const moviesbtn = document.getElementById("moviesbtn")
const gamesbtn = document.getElementById("gamesbtn")

homebtn.addEventListener('click', e=> { 
        window.location.href = "../Home/home.html"
})
moviesbtn.addEventListener('click', e=> { 
    window.location.href = "../Movies/movies.html"
})
gamesbtn.addEventListener('click', e=> { 
    window.location.href = "../Games/games.html"
})

const activityType = document.getElementById("activityType")
const submitBtn = document.getElementById("submitbtn")
activityType.addEventListener('change', e => {
    submitBtn.disabled = false
})

submitBtn.addEventListener('click', e => {
    const name = document.getElementById("name")
    const recommendation = document.getElementById("recommendation")
    const message = document.getElementById("message")
    if (name.value == '' || recommendation.value == '' || message.value == '') {
        alert("Please fill out all fields before submitting")
    }
    else {
        window.location.href = "success.html"
    }
})