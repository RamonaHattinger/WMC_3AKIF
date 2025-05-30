

export class Frage {
  constructor(frage, optionen, antwort) {

    if(arguments.length !== 3){
      throw new Error("Error, braucht genau drei Argumente!");
    }

    if((typeof frage !== "string") || (typeof antwort !== "string")){
      throw new Error("Error, kein String!");
    }

    if((!Array.isArray(optionen)) || (optionen.length === 0)){
      throw new Error("Error, kein Array oder nicht befüllt!");
    }

    if(!optionen.includes(antwort)){
      throw new Error("Error, keine Antwortmöglichkeit!");
    }
    

    this.frage = frage;
    this.optionen = optionen;
    this.antwort = antwort;
  }
}


export class Quiz{
  constructor(data) {
    
    if(arguments.length !== 1){
      throw new Error("Fehler, muss genau 1 Argument haben");
    }
    this.fragen = data.map(f => new Frage(f.frage, f.optionen, f.antwort));
  }

  getFragenByLength(min) {
    return this.fragen.filter(f => f.frage.length >= min);
  }

  getFragenSortedByLength(){
    return this.fragen.sort((a, b) => a.frage.length - b.frage.length);
  }

  getFragenWithOption(opt){
    return this.fragen.filter(f => f.optionen.includes(opt))
  }

  getAverageOptions(){
        const sum = this.fragen.reduce((s, t) => s + t.optionen.length, 0);
    const avg = sum / this.fragen.length;
    return avg;
  }

  getAllOptions(){
    const allOptions = this.fragen.flatMap(a => a.optionen);
    const allUnique = new Set(allOptions);
    return [...allUnique];
  }
  
}
