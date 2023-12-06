const express = require('express');
const app = express();

app.use(express.json());


const port = process.env.port || 3000;
app.listen(port, ()=> console.log(`Listening on port ${port}....`));
let randomElt = {"shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor":""};
let randomEltArr = []
const shapes = ["Circle", "Rectangle", "Triangle", "Diamond"];
const colors = ["#C2DEDC", "#ECE5C7", "#B3C890", "#116A7B"];
let count = 0;
let percentage =0;
let start = false;
app.get('/', (req, res) => {
    res.send(randomEltArr);
})
while (percentage != 20){
    const pTarget = 0.2
    randomEltArr = []
    count = 0
    randomElt = {"shape": "", "color": "", "prevShape": "", "prevColor": "", "nextShape": "", "nextColor":""};
    start = false
    for(let i=0; i<180; i++)
    {
    let rand = Math.random()
    let sVc = Math.random()
    if (!start) {
    start = true;
    randomElt = ({
        "shape": shapes[Math.floor(Math.random() * (shapes.length))],
        "color": colors[Math.floor(Math.random() * (colors.length))],
        "prevShape": randomElt.shape,
        "prevColor": randomElt.color
    })
    if (rand <= pTarget){
        count = count+1
        // console.log(count)
        randomElt = ({
        ...randomElt,
        "nextShape" : sVc < 0.5 ? randomElt.shape : shapes[Math.floor(Math.random() * (shapes.length))],
        "nextColor" : sVc >= 0.5 ? randomElt.color : colors[Math.floor(Math.random() * (colors.length))]
        })
    } else{
        let newShape = shapes[Math.floor(Math.random()*(shapes.length))]
        let newColor = colors[Math.floor(Math.random() * (colors.length))]
        while (newShape === randomElt.shape || newColor === randomElt.color){
        newShape = shapes[Math.floor(Math.random()*(shapes.length))]
        newColor = colors[Math.floor(Math.random() * (colors.length))]
        }
        randomElt = ({
        ...randomElt,
        "nextShape" : newShape,
        "nextColor" : newColor
        })
    }
    } else {
        randomElt = ({
        "shape": randomElt.nextShape,
        "color": randomElt.nextColor,
        "prevShape": randomElt.shape,
        "prevColor": randomElt.color
        })
        if (rand <= pTarget){
        count = count+1
        console.log(count)
        randomElt = ({
            ...randomElt,
            "nextShape" : sVc < 0.5 ? randomElt.shape : shapes[Math.floor(Math.random() * (shapes.length))],
            "nextColor" : sVc >= 0.5 ? randomElt.color : colors[Math.floor(Math.random() * (colors.length))]
        })
        } else{
        let newShape = shapes[Math.floor(Math.random()*(shapes.length))]
        let newColor = colors[Math.floor(Math.random() * (colors.length))]
        while (newShape === randomElt.shape || newColor === randomElt.color){
            newShape = shapes[Math.floor(Math.random()*(shapes.length))]
            newColor = colors[Math.floor(Math.random() * (colors.length))]
        }
        randomElt = ({
            ...randomElt,
            "nextShape" : newShape,
            "nextColor" : newColor
        })
        }
    }
    randomEltArr.push(randomElt);
}
    percentage = (count/180)*100;
}
console.log("Done!!!")