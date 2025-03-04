

function isPrime(number) {
    if (number < 2) return false;
    
    for (let i = 2; i <= Math.sqrt(number); i++) {
        if (number % i === 0) return false;
    }

    return true;
    
}

function checkPrime() {
    const number = document.getElementById('number').value;
    const resultElement = document.getElementById('result');
    
        if (number === "" || isNaN(number)) {
        resultElement.textContent = "What the fuck, you're  not even a number!";
        resultElement.className = "no-prime";
        return;
        }
        
        number = parseInt(number);

        if (isPrime(number)) {
            resultElement.textContent = "Yeah baby, you're prime!";
            resultElement.className = "prime";
        } 
        else {
            resultElement.textContent = "Meh, ...";
            resultElement.className = "no-prime";
        }
}
