// Variables!
var danumber;
var guesses = [];
var higher_guesses = [];
var lower_guesses = [];


// Helper Functions
function generateDaNumber() {
    danumber = Math.round(Math.random()*100);
    // Make sure it's not 0!
    if (danumber === 0) {
        generateDaNumber(); 
    }
};

function sortGuesses(arr) {
    arr.sort(function(a,b){
        return a.num - b.num;
    });
};

function warmUp(el, colorAmounts){        
    var self = el;
    r = Math.round(255),
    g = Math.round(30 + 225*colorAmounts),
    b = Math.round(0),
    a = 1; 
    self.css({'color': 'rgba('+ r +','+ g +','+ b +','+ a +')'});
}; 
    
function coolDown(el, colorAmounts){        
    var self = el;
    r = Math.round(0),
    g = Math.round(215 - 215*colorAmounts),
    b = Math.round(255),
    a = 1; 
    self.css({'color': 'rgba('+ r +','+ g +','+ b +','+ a +')'});
}; 

// Generate our magic number!
generateDaNumber();

// Just showing that number to the console for debugging
console.log(danumber);

// Accept the guess in the form: 
$("form").submit(function(event){
    event.preventDefault();

    // This is the users guess
    var daguess = parseInt($(this).children("input").val());
    
    // Check if guess is correct
    if (daguess == danumber) {
        // Do something C R A Z Y and tell them it's correct
        $(".winner").css('display', 'flex');
        $("#reset").click(function(){
            location.reload();
        });
    }
        
    // Check if guess is a repeat
    var again = false;
    for (var i=0; i<guesses.length; i++){
        if (guesses[i].num == daguess) {
            again = true;
        }
    }
    
        // Display repeat message
        if (again) {
            $(".repeat-message").css('display', 'flex');
        };
    
        // Hide repeat message
        $("button#sorry").click(function(){
            $(".repeat-message").css('display', 'none');
        });
    
    // Determine if guess is high or low
    var direction;
    if (0 > danumber - daguess){
        direction = 'high';
    }    
    else {
        direction = 'low';
    }
    
    // Determine if new guess is hotter or colder than previous guess (not currently used)
    var last_guess = guesses[guesses.length-1];
    var hotter;
    
    if (guesses.length > 0){
        if (amount < last_guess.amt) {
            hotter = true;
        }
        else {
            hotter = false;
        }
    }   
    
    // See how far off the guess is
    var amount = Math.abs(danumber - daguess);
    
    // set color for guess
    var color;
    if (amount < 25){
        color = amount/25;
    }
    else {
        if (direction == 'high'){
            color = (daguess-danumber-25)/(100-danumber-25)
        }
        else {
             color = (danumber-daguess-25)/(danumber-25)
        }
    }

    // Create object with information about this guess
    var this_guess = {
        num: daguess,
        amt: amount, 
        dir: direction,
        clr: color,
    };
    
    // Store all guesses chronologically
    guesses.push(this_guess);
    
    // Store guesses into high and low arrays
    if (direction === 'high' && !again) {
        higher_guesses.push(this_guess);
    }
    else if (!again) {
        lower_guesses.push(this_guess);
    }
    
    // Sort guesses for displaying
    sortGuesses(higher_guesses);
    sortGuesses(lower_guesses);
    
    // Reverse high guesses for color gradients
    higher_guesses.reverse();
    
    // Empty text field after guess submitted
    $("input#guess").val('');
    
    // Empty out guess divs with every submit
    $("div.guesses > div").empty();

    // Sort & display guesses!
    for (var i=higher_guesses.length - 1; i >= 0; i--) {
        $("div#higher .hot").append("<span id='" + higher_guesses[i].num + "'>" + higher_guesses[i].num + "</span>");
        if (higher_guesses[i].amt < 25) {
            warmUp($('span#' + higher_guesses[i].num), higher_guesses[i].clr);
        }
        else {
            coolDown($('span#' + higher_guesses[i].num), higher_guesses[i].clr);
        }
    }
    
    for (var i=lower_guesses.length - 1; i >= 0; i--) {
        $("div#lower .hot").append("<span id='" + lower_guesses[i].num + "'>" + lower_guesses[i].num + "</span>");
        if (lower_guesses[i].amt < 25) {
            warmUp($('span#' + lower_guesses[i].num), lower_guesses[i].clr);
        }
        else {
            coolDown($('span#' + lower_guesses[i].num), lower_guesses[i].clr);
        }
         
    }
    
    // End game if user guesses too many times 
    if (guesses.length > 20) {
        $("div.blowingit").css('display', 'flex');
        $("#try-again").click(function(){
            location.reload();
        });
    }
});


// Create a button that shows the answer
    // eh... do we really want that???

    