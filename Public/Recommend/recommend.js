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