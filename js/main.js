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

function hotToWarm(container) {
    var number = $(container).children().length;
    $(container).find('span').each(function(i) {
        var self = $(this),
        r = Math.round(255),
        g = Math.round(30 + i*120/number),
        b = Math.round(0),
        a = (1); 
    self.css({'color': 'rgba('+ r +','+ g +','+ b +','+ a +')'});
    }); 
}


function warmingLower(container) {
    var number = $(container).children().length;
    $(container).find('span').each(function(i) {
        var self = $(this),
        r = Math.round(255),
        g = Math.round(150 + i*80/number),
        b = Math.round(0),
        a = (1); 
    self.css({'color': 'rgba('+ r +','+ g +','+ b +','+ a +')'});
    }); 
}


function warmToCold(container) {
    var number = $(container).children().length;
    $(container).find('span').each(function(i) {
        var self = $(this),
        r = Math.round(0),
        g = Math.round(235 - i*120/number),
        b = Math.round(255),
        a = (1); 
    self.css({'color': 'rgba('+ r +','+ g +','+ b +','+ a +')'});
    }); 
}

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
    
    // Create object with information about this guess
    var this_guess = {
        num: daguess,
        // Determine how warm/hot a guess is    
        amt: Math.abs(danumber - daguess), 
        dir: direction,
    };
    
    // Determine if new guess is hotter or colder than previous guess
    var last_guess = guesses[guesses.length-1];
    var hotter;
    
    if (guesses.length > 0){
        if (this_guess.amt < last_guess.amt) {
            hotter = true;
        }
        else {
            hotter = false;
        }
    }
    
    // Print out hotter/colder (not currently being used)...
    if (guesses.length > 0){
        if (!hotter) {
            console.log("colder!");
        }
        else {
            console.log("hotter!");
        }
    }    
    
    // Store all guess chronologically
    guesses.push(this_guess);
    
    // Store guesses into high and low arrays
    if (this_guess.dir === 'high' && !again) {
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
        if (higher_guesses[i].amt > 25) {
            $("div#higher .cold").append("<span>" + higher_guesses[i].num + "</span>");
        }
        else if (higher_guesses[i].amt > 10) {
            $("div#higher .warm").append("<span>" + higher_guesses[i].num + "</span>");
        }
        else {
            $("div#higher .hot").append("<span>" + higher_guesses[i].num + "</span>");    
        }
    }
    
    for (var i=lower_guesses.length - 1; i >= 0; i--) {
         if (lower_guesses[i].amt > 25) {
            $("div#lower .cold").append("<span>" + lower_guesses[i].num + "</span>");
         }
        else if (lower_guesses[i].amt > 10) {
              $("div#lower .warm").append("<span>" + lower_guesses[i].num + "</span>");  
        }
        else {
              $("div#lower .hot").append("<span>" + lower_guesses[i].num + "</span>");
        }
    }

    // Apply color to the past guesses
    hotToWarm($('div#higher .hot'));
    hotToWarm($('div#lower .hot')); 
    
    warmingLower($('div#higher .warm'));
    warmingLower($('div#lower .warm'));
    
    warmToCold($('div#higher .cold'));
    warmToCold($('div#lower .cold'));
    
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

    