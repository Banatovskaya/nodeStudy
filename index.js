const fs = require('fs');
const http = require('http');

let d
// const a = fs.readFile('1.txt', 'utf8', (err,data)=>{
//     if (err) throw err
//     d = data
// })

const server = http.createServer((req, res) => {
    res.write(`<h1>${d}</h1>`)
    res.end()
  
})

server.listen(3000, () => {
    console.log('server is running...')
})
// const readStream = fs.createReadStream("4.psd", {});
// const writeStream = fs.createWriteStream('newFile.txt')
// readStream.on("data", function(chunk){ 
//     let newChunkStr = '';
//     let exceptionCodes = [0,1,2,3,4,5,6,7,8,9,11,12,14,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,65533];
//     console.log('______chunk_____', );
//     let line = '';
//     let isEmptyLine = true;
//     for (let i = 0; i < (chunk.length-1); i++){
//         if (!exceptionCodes.includes(chunk.toString().charCodeAt(i))) {
//             line = line.concat(chunk.toString().charAt(i))
//             if (chunk.toString().charCodeAt(i) != 32 && chunk.toString().charCodeAt(i) != 10) {
//                 isEmptyLine = false;
//             } else if (chunk.toString().charCodeAt(i) == 32){
//                 isEmptyLine = true
//             } 
//             if (chunk.toString().charCodeAt(i) == 10  && isEmptyLine == false) {
//                 newChunkStr = newChunkStr.concat(line);
//                 line = '';    
//             } else if (chunk.toString().charCodeAt(i) == 10  && isEmptyLine == true){
//                 line = ''; 
//             }
//         }
//     }
//    console.log(newChunkStr);
//    writeStream.write(newChunkStr)
// //    console.log('newChunk', newChunk)
// // console.log(String.fromCharCode(10))
// // console.log(String.fromCodePoint(0o1,55, 0o10125, 4181))
// // console.log('  '.charCodeAt(1))
// // console.log('Adf5фф☺7ၕ'.codePointAt(8))
// });

readStream = fs.createReadStream("1.txt", {});
writeStream = fs.createWriteStream('object.txt');
readStream.on("data", function(chunk){ 
    
    let newChunk = []; //not string only array because we need change characters inside
    let isMainObject = false;
    let paragrafLengthBeforeBracketArr = [];
    
    function deletePreviousSpacesFromLastPosition(backCounterForNewChunk, backCounterForChunk){
        while (chunk.toString().charCodeAt(backCounterForChunk) == 32){ //delete spaces in newChunk before bracket
            newChunk.splice(backCounterForNewChunk, 1);
            backCounterForNewChunk--;
            backCounterForChunk--;
        }    
    }    

    function addSpaces(num){
        for (i = 0; i < num; i++){
            newChunk.push(' ');
        } 
    }


    for (let i = 0; i < (chunk.toString().length-1); i++){
        
        if (chunk.toString().charCodeAt(i) == 60 && chunk.toString().charCodeAt(i+1) == 60 ) { // if character == <<
//always use chunk.toString().charCodeAt(i) instead chunk[i] because 
//they have different arr.lenght because Cyrrilic characters consist from two code elements
            if (isMainObject == false) {  // 1-st(main) object
                isMainObject = true;
                newChunk.push('object',':','{');  
                paragrafLengthBeforeBracketArr.push(8);


            } else {
                if (paragrafLengthBeforeBracketArr.length > 0){
                    deletePreviousSpacesFromLastPosition(newChunk.length-1, i-1);
                    
                        
                    if (newChunk[newChunk.length-1] == '\n' ){ // if character == move next line
                        console.log('bfbfgfdgfdgfddgf', newChunk[newChunk.length-2])
                        newChunk.splice(newChunk.length-1, 1); //delete '/n' in newChunk before bracket
                        if (newChunk[newChunk.length-1] == '}'){ // if >> <<
                            let a = paragrafLengthBeforeBracketArr.length;
                            newChunk.push(',' , '\n');
                            addSpaces(paragrafLengthBeforeBracketArr[a-1]+1)   
                            newChunk.push('{');
                           
                        } else {                        

                        newChunk.push(':','{');
                        let paragrafLengthBeforeBracket = (newChunk.length-1) - newChunk.lastIndexOf('\n') - 1;
                        paragrafLengthBeforeBracketArr.push(paragrafLengthBeforeBracket);
                        }  
                    }
  
                }
                
            }
                i++;

        } else if (chunk.toString().charAt(i) == '/'){
            if (paragrafLengthBeforeBracketArr.length > 0){
                deletePreviousSpacesFromLastPosition(newChunk.length-1, i-1);   
                let a = paragrafLengthBeforeBracketArr.length;
                addSpaces(paragrafLengthBeforeBracketArr[a-1]+1)             
            };

        } else if (chunk.toString().charAt(i+1) == '>' && chunk.toString().charAt(i) == '>'){
            
            if (paragrafLengthBeforeBracketArr.length > 0){
                deletePreviousSpacesFromLastPosition(newChunk.length-1, i-1);   
                let a = paragrafLengthBeforeBracketArr.length;
                addSpaces(paragrafLengthBeforeBracketArr[a-1])
                paragrafLengthBeforeBracketArr.pop();
            }
            newChunk.push('}');
            i++;

        } else {
            newChunk.push(chunk.toString().charAt(i));
        }
    }
    // console.log(newChunk)
    console.log(newChunk.join(''))
    writeStream.write(newChunk.join(''))
}
)

