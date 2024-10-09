document.addEventListener("DOMContentLoaded", async () => {
    initMarkdownPreview()
}, false);

function createDivNode(id) {
    const div = document.createElement('div')
    div.id = id
    return div
}

const initOutline = () => {
    const headingElements = []
    Array.from(document.getElementById('preview').children).forEach((item) => {
        if (item.tagName.length === 2 && item.tagName !== 'HR' && item.tagName.indexOf('H') === 0) {
            headingElements.push(item)
        }
    })

    let toc = []
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY
        toc = []
        headingElements.forEach((item) => {
            toc.push({
                id: item.id,
                offsetTop: item.offsetTop,
            })
        })

        const currentElement = document.querySelector('.vditor-outline__item--current')
        for (let i = 0, iMax = toc.length; i < iMax; i++) {
            if (scrollTop < toc[i].offsetTop - 30) {
                if (currentElement) {
                    currentElement.classList.remove('vditor-outline__item--current')
                }
                let index = i > 0 ? i - 1 : 0
                document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add('vditor-outline__item--current')
                break
            }
        }
    })
}

async function initMarkdownPreview() {
    try {
        let result = await fetch('markdown.md')
        let text = await result.text()
        console.log(text)
        // create div
        let body = document.getElementsByTagName("body")[0]
        let outlineDiv = createDivNode("outline")
        body.appendChild(outlineDiv)
        let previewDiv = createDivNode("preview")
        body.appendChild(previewDiv)
    
        console.log(text)
    
        Vditor.preview(document.getElementById('preview'), text, {
            renderers: {},
            speech: {
                enable: true,
            },
            anchor: 1,
            after() {
                if (window.innerWidth <= 768) {
                    return
                }
                const outlineElement = document.getElementById('outline')
                Vditor.outlineRender(document.getElementById('preview'), outlineElement)
                if (outlineElement.innerText.trim() !== '') {
                    outlineElement.style.display = 'block'
                    initOutline()
                }
            },
        })
    } catch(e) {

    }
   
       
   
 
}