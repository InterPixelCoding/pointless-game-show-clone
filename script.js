function innerCSS(css) {
    let styles = css.match(/{([^}]+)}/g);
    let styles_format = []; let bracket_indices = []; let element_array = [];
    let css_format = '';
    for(let i = 0; i<css.length; i++) {
        if([' ', '\n'].includes(css[i]) == false) {
            css_format+=css[i]
        }
    }
    bracket_indices = [...css_format].map((char, index) => {if (char === '{') {return index;} else {return null;}}).filter(index => index !== null);

    for(let i = 0; i<bracket_indices.length; i++) {
        let n = 1; 
        let element = '';
        let element_format = '';
        let start_search = bracket_indices[i];
        while(css_format[start_search - n] !== '}' && start_search - n >= 0) {
            let char = String(css_format[start_search - n]);
            element+=char
            n++
        }
        for(let i = 1; i<=element.length; i++) {
            let char = element[element.length - i];
            element_format+=char
        }
        element_array.push(element_format)
    }

    styles.forEach(style => {
        let new_style = ''
        for(let i = 0; i<style.length; i++) {
            if([' ', '\n', '{', '}'].includes(style[i]) === false) {
                new_style += style[i]
            }
        }
        styles_format.push(new_style)
    })

    element_array.forEach(function(el, index) {
        let items = document.querySelectorAll(el);
        items.forEach(item => {
            item.style.cssText += styles_format[index]
        })
    })
}

const nav_links = document.querySelectorAll('nav > button > span')
const slides = document.querySelectorAll('.max')
innerCSS(`.max {top: ${document.querySelector('nav').offsetHeight}px}`)

nav_links.forEach(link => {
    link.addEventListener("click", () => {
        slides.forEach(slide => {
            if(slide.classList.contains('hidden') == false) {
                slide.classList.add('hidden');
                slide.style.zIndex = '0'
            }
        })
        let query = `.${link.textContent.toLowerCase()}`;
        let selected = document.querySelector(query);
        innerCSS(`${query} {z-index: 50}`)
        selected.classList.remove('hidden')
    })
})

const scorer = document.querySelector('.scorer-container');
const jackpot = scorer.querySelector('.score-jackpot')
const resolution = 100;

for(let i = 0; i<resolution; i++) {
    let newPoint = document.createElement("div")
    newPoint.classList.add('point')
    jackpot.appendChild(newPoint);
    innerCSS(`
    .point {
        height: calc(100% / ${resolution}); width: 100%; 
    }
    `)
}

function score_animation(score) {
    let points = document.querySelectorAll('.point');
    let span = document.querySelector('.score-number > span');
    document.addEventListener("keydown", (e) => {
        if(e.key === 'z') {
            let i = 0;
            innerCSS(`.jackpot {height: ${jackpot.offsetHeight}px}`)
            setTimeout(() => {
                let intervalID = setInterval(() => {
                    i++
                    let current_score = 100 - i;
                    span.textContent = 100 - i
                    if(current_score == score) {
                        clearInterval(intervalID)
                    }
                    points[i-1].style.transform = 'translateY(-50vh)';
                    points[i-1].style.height = '1%';
                    points[i-1].classList.remove('glow')
                    points[i].classList.add('glow')
                    points[i].style.height = '2%'
                }, 100);
            }, 1000);
        }
        if(e.key === 'r') {
            span.textContent = '100'
            points.forEach(function(point, index) {
                innerCSS(`
                .point:nth-child(${index + 1}) {
                    height: 1%;
                    transform: translateY(0);
                }`
                ); 
            if(point.classList.contains('glow')) {point.classList.remove('glow')}
        })
        }
    })
}

score_animation(69)