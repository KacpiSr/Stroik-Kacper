const model_url =
  'https://cdn.jsdelivr.net/gh/ml5js/ml5-data-and-models/models/pitch-detection/crepe/';
let pitch;
let mic;
let cnv;
let playing;
let isStringSelected=false;
let pickedNote;
let freq = 0;
let threshold = 1;
let i=1;
//tablica wybranych dźwięków
let notes = [
    {
      note: 'E',
      freq: 82.41
    },
    {
      note: 'A',
      freq: 110.00
    },
    {
      note: 'D',
      freq: 146.83
    },
    {
      note: 'G',
      freq: 196.00
    },
    {
        note: 'H',
        freq: 246.94
      },
      {
        note: 'E',
        freq: 329.63 
      }
  ];
  //odświeżanie rysowania canvasu 
  function setup() {

      cnv=createCanvas(400, 400);
      audioContext = getAudioContext();
      mic = new p5.AudioIn();
      mic.start(listening);
      osc = new p5.Oscillator('sine');
      cnv.mouseClicked(toggleSound)
    
  }
  //"puszczenie" dźwięku przy kliknięcu myszy w canvas
  function toggleSound() {
    if(playing){
        osc.stop();
        playing = false;
    }
    else{
        osc.start();
        playing = true;
    }
  }
  function listening() {
    pitch = ml5.pitchDetection(model_url, audioContext, mic.stream, modelLoaded);
  }
  
  //rysuje stroik
  function draw() {
    if(isStringSelected){
      drawTuner();
    }
   
   

  }
  
  function modelLoaded() {
    pitch.getPitch(gotPitch);
  }
  

  //funkcja sprawdzająca czy nie wystąpił błąd przy próbie pobrania inputu z mikrofonu
  function gotPitch(error, frequency) {

    if (error) {
      console.error(error);
    } else {

      if (frequency) {
        freq = frequency;
      }
      pitch.getPitch(gotPitch);
    }
  }










  function drawTuner(){
    background(0);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(32);
    text(freq.toFixed(2)+"Hz", width / 2, height - 150);
  
    let closestNote = notes[pickedNote];
    let recordDiff = Infinity;

      let diff = freq - notes[pickedNote].freq;
      if (abs(diff) < abs(recordDiff)) {
        recordDiff = diff;
      }
      
    
    //Note font i położenie
    textSize(64);

    text(closestNote.note, width / 2, height - 50);
  
    diff = recordDiff;

    let alpha = map(abs(diff), 0, 120, 255, 0);
    rectMode(CENTER);
    fill(255, alpha);
    stroke(255);
    strokeWeight(1);
    /// rysowanie odległości od poprawnego dźwięku (czerwony/zielony) w zależności od zmiennej diff (kwadraty)
    if(diff>30){
        for(let i=1;i<=3;i++){
            fill(255, 0, 0);
            rect(150+i*50, 200, 50, 50);
        }
    }
    if(diff<30&&diff>10){
        for(let i=1;i<=2;i++){
            fill(255, 0, 0);
            rect(150+i*50, 200, 50, 50);
        }
    }
    if(diff<10&&diff>2){
        for(let i=1;i<=1;i++){
            fill(255, 0, 0);
            rect(150+i*50, 200, 50, 50);
        }
    }
    if(diff>-2&&diff<2){
            fill(0, 255, 0);
            rect(200, 200, 50, 50);
    }
    if(diff<-2&&diff>-10){
            fill(255, 0, 0);
            rect(200, 200, 50, 50);
    }
    if(diff<-10&&diff>-30){
        for(let i=1;i<=2;i++){
            fill(255, 0, 0);
            rect(250-(i*50), 200, 50, 50);
        }
    }
    if(diff<-30){
        for(let i=1;i<=3;i++){
            fill(255, 0, 0);
            rect(250-(i*50), 200, 50, 50);
        }
    }
    
    if (abs(diff) < threshold) {
      fill(0, 255, 0);
      
    }
    ///rysowanie osi dużej
    rect(200, 100, 200, 50);
  
    stroke(255);
    strokeWeight(5);
    
  
    noStroke();
    fill(255, 0, 0);
    if (abs(diff) < threshold) {
      fill(0, 255, 0);
    }
    if(freq<closestNote.freq/2.4){
      rect(100, 100, 10, 75);
    }
    else if(freq>closestNote.freq*2.4){
      rect(290, 100, 10, 75);
    }
    else{
      rect(200 + diff / 2, 100, 10, 75);
    }
    ///warunek sprawdzający czy został naciśnięty przycisk myszy na stronie aby odtwarzać dany dźwięk
    if (playing) {
        osc.freq(closestNote.freq, 0.1);
        osc.amp(1, 1);
      }
      console.log(closestNote.freq);
  }