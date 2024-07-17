const homebtn = document.getElementById("homebtn")
const moviesbtn = document.getElementById("moviesbtn")
const recommendbtn = document.getElementById("recommendbtn")

homebtn.addEventListener('click', e=> { 
        window.location.href = "../Home/home.html"
})
moviesbtn.addEventListener('click', e=> { 
    window.location.href = "../Movies/movies.html"
})
recommendbtn.addEventListener('click', e=> { 
    window.location.href = "../Recommend/recommend.html"
})