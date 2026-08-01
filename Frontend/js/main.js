/* ===========================================
   EVENTAI MAIN JAVASCRIPT
=========================================== */

// Page Loaded

document.addEventListener("DOMContentLoaded", function () {

    console.log("EventAI Loaded Successfully!");

    revealElements();

});

// =========================
// Smooth Scrolling
// =========================

const navLinks = document.querySelectorAll('nav a[href^="#"]');

navLinks.forEach(link => {

    link.addEventListener("click", function (e) {

        e.preventDefault();

        const target = document.querySelector(this.getAttribute("href"));

        if(target){

            target.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});

// =========================
// Navbar Shadow
// =========================

window.addEventListener("scroll", function(){

    const navbar = document.querySelector("nav");

    if(window.scrollY > 50){

        navbar.style.boxShadow = "0 10px 25px rgba(0,0,0,.15)";

    }

    else{

        navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,.08)";

    }

});

// =========================
// Button Hover Animation
// =========================

const buttons = document.querySelectorAll("button");

buttons.forEach(button=>{

    button.addEventListener("mouseenter",()=>{

        button.style.transform="scale(1.05)";

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform="scale(1)";

    });

});

// =========================
// Reveal Animation
// =========================

const revealItems=document.querySelectorAll(

".card,.hero-content,.hero-image,.about-content,.about-image,.stats div"

);

function revealElements(){

    revealItems.forEach(item=>{

        const windowHeight=window.innerHeight;

        const itemTop=item.getBoundingClientRect().top;

        const revealPoint=120;

        if(itemTop<windowHeight-revealPoint){

            item.style.opacity="1";

            item.style.transform="translateY(0)";

        }

        else{

            item.style.opacity="0";

            item.style.transform="translateY(40px)";

        }

    });

}

window.addEventListener("scroll",revealElements);

// =========================
// Active Navigation Link
// =========================

const sections=document.querySelectorAll("section");

const links=document.querySelectorAll("nav ul li a");

window.addEventListener("scroll",()=>{

    let current="";

    sections.forEach(section=>{

        const sectionTop=section.offsetTop-100;

        const sectionHeight=section.clientHeight;

        if(pageYOffset>=sectionTop){

            current=section.getAttribute("id");

        }

    });

    links.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")==="#"+current){

            link.classList.add("active");

        }

    });

});

// =========================
// Hero Button Actions
// =========================

const startBtn=document.querySelector(".primary-btn");

if(startBtn){

    startBtn.addEventListener("click",()=>{

        window.location.href="register.html";

    });

}

const learnBtn=document.querySelector(".secondary-btn");

if(learnBtn){

    learnBtn.addEventListener("click",()=>{

        const featureSection=document.querySelector("#features");

        if(featureSection){

            featureSection.scrollIntoView({

                behavior:"smooth"

            });

        }

    });

});