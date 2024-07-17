const homebtn = document.getElementById("homebtn")
const gamesbtn = document.getElementById("gamesbtn")
const recommendbtn = document.getElementById("recommendbtn")

homebtn.addEventListener('click', e=> { 
        window.location.href = "../Home/home.html"
})
gamesbtn.addEventListener('click', e=> { 
    window.location.href = "../Games/games.html"
})
recommendbtn.addEventListener('click', e=> { 
    window.location.href = "../Recommend/recommend.html"
})