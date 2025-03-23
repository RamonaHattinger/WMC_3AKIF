
/* for(let i=1;i<=100;i++){
    if(i%3===0 && i%5===0){
        console.log('FizzBuzz');
    }
    else if(i%3===0){
        console.log('Fizz');
    }
    else if(i%5===0){
        console.log('Buzz');
    }
    else if (i%7===0){
        console.log('Whizz')
    }
    else if (i%11===0){
        console.log('Bang')
    }
    else{
        console.log(i);
    }
} */


for(let i=1; ; i++){
    let output = '';
    if(i%3===0){
        output += 'Fizz';}
    if(i%5===0){
        output += 'Buzz';  
    }
    if(i%7===0){
        output += 'Whizz'
    }
    if(i%11===0){
        output +='Bang'
    }
    if(output === ''){
        output = i.toString();
    }

    console.log(output);

    if(output === 'FizzBuzzWhizzBang'){
        break;
    }
}
