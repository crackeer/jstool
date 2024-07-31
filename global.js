function getQuery(key, value) {
    let url = new URLSearchParams(window.location.search)
    return url.get(key) || value
}

function getAllQuery() {
    let params = new URLSearchParams(window.location.search)
    let retData = {}
    for (let param of params) {
        retData[param[0]] = param[1]
    }
    return retData
}

function pushStateWith(query) {
    let newURL = window.location.pathname + "?" + httpBuildQuery(query)
    window.history.pushState(null, "", newURL)
}


function randomKey(t) {
    return crypto.getRandomValues(new Uint8Array(t)).reduce(((t, e) => t += (e &= 63) < 36 ? e.toString(36) : e < 62 ? (e - 26).toString(36).toUpperCase() : e > 62 ? "-" : "_"), "")
}

function windowReload() {
    window.location.reload()
}

function windowReloadQuery(query) {
    window.location.href = window.location.pathname + '?' + httpBuildQuery(query)
}

function windowRedirect(path, query) {
    window.location.href = path + '?' + httpBuildQuery(query)
}

function httpBuildQuery(query) {
    let params = new URLSearchParams("")
    Object.keys(query).forEach(k => {
        params.append(k, query[k])
    })
    return params.toString()
}

function cloneObject(data) {
    let raws = JSON.stringify(data)
    return JSON.parse(raws)
}


function saveFile(data, name) {
    //Blob为js的一个对象，表示一个不可变的, 原始数据的类似文件对象，这是创建文件中不可缺少的！
    var urlObject = window.URL || window.webkitURL || window;
    var export_blob = new Blob([data]);
    var save_link = document.createElementNS("http://www.w3.org/1999/xhtml", "a")
    save_link.href = urlObject.createObjectURL(export_blob);
    save_link.download = name;
    save_link.click();
}

//js 读取文件
function readFile(file) {
    var reader = new FileReader();//new一个FileReader实例
    if (/text+/.test(file.type)) {//判断文件类型，是不是text类型
        reader.onload = function (result) {
            console.log(result)
        }
        reader.readAsText(file);
    } else if (/image+/.test(file.type)) {//判断文件是不是imgage类型
        reader.onload = function (result) {
            console.log(result)
        }
        reader.readAsDataURL(file);
    }
}

function initJSONEditor(target, value) {
    let jsonEditor = 'jsonEditor-' + target
    if (window[jsonEditor] == undefined) {
        window[jsonEditor] = new JSONEditor(document.getElementById(target), {
            "mode": "code",
            "search": true,
            "indentation": 4
        })
    }
    try {
        let jsonValue = JSON.parse(value)
        window[jsonEditor].set(jsonValue)
    } catch (e) {
    }
    return window[jsonEditor]
}

function mountVueObject(object, element) {
    if (Vue === undefined) {
        console.log('mountVueObject, Vue not defined');
        return
    }
    var vm = Vue.createApp(object)
    vm.mount(element)
    return vm
}


function initCodeEditor(target, lang, value) {
    document.getElementById(target).style.height = getCodeEditorHeight() + 'px'
    require.config({ paths: { vs: '/assets/monaco-editor/min/vs' } });
    require(['vs/editor/editor.main'], function () {
        window.codeEditor = monaco.editor.create(document.getElementById(target), {
            value: value,
            language: lang,
            theme: "vs-dark",
            formatOnPaste: true, //是否粘贴自动格式化
            automaticLayout: true,
        });
    });
}

function formatUnix(ts) {
    if (ts == null) {
        return ''
    }
    return dayjs.unix(ts).format('YYYY-MM-DD HH:mm:ss')
}

function getNowTime() {
    return dayjs().format('YYYY-MM-DD HH:mm:ss')
}

var tagRegex = /^#([\S\s]+)/;
var hrefRegex = /^\-\s\[([\S\w\s\W]*)\]\((\S+)\)/;
function parseMarkdownBlock(text) {
    let data = text.split('\n')
    let current_tag = '未知'
    let links = []
    for (let i = 0; i < data.length; i++) {
        let tags = data[i].match(tagRegex)
        if (tags !=null && tags.length != undefined && tags.length > 1) {
            current_tag = tags[1].trim()
        }
        let href = data[i].match(hrefRegex)
        console.log(href, data[i])
        if (href != null && href.length != undefined && href.length > 2) {
            links.push({
                title : href[1].trim(),
                href : href[2].trim(),
                tag : current_tag
            })
        }
    }
    return links
}