$(document).ready(function(){
	
// Giving all my characters a name & associated skill sets. This is a global object that will serve as reference and will not be change/updated in any way
	var players = {
		Names: ["Obi-Wan Kenobi","Luke Skywalker","Darth Sidious","Darth Maul"],
		attack: [5,6,4,7],
		cAttack: [10,9,11,8],
		defense : [120,100,150,180],
		id: ["char0", "char1", "char2", "char3"]};

	//A clone/copy of my object that I will update as I am "kiling" of the enemies
	var copy = jQuery.extend(true, {}, players);


	//global varibles 
	var yourChar;
	var yourInd;


	var currentEnemy;
	var enemyInd;
	var prevEnemy = [];

//writing the character's defense to the buttons div. Names too. Making this a function so I can "reset" all the stats of the character-buttons
	function charReset(){
		for (i = 0; i <4; i++){
		$("#d"+i).html(players.defense[i]);
		$("#n"+i).html(players.Names[i]);
		$("#char"+i).appendTo(".listedChars");
		};
	};
	charReset();
	
	$(".pa").hide();

	//making a function that will reset the DOM to look as it did at the start of the game

	$(".pa").click(function(){

		prevEnemy= [];
		currentEnemy = undefined;
		yourChar = undefined;
		// "resetting" my copy of the object that has all my characters info/stats
		copy = jQuery.extend(true, {}, players);

		$(".msg").html("");
		charReset();
		//hiding the "Play Again" button so that the player doesnot click on it 
		$(".pa").hide();

		});

	//on clicking any of the character-buttons, you will need to move the selected character to the ".theOne" div, the rest should move to the enemies list. This should only be done IF there is not a character yet in the div ".theOne". Using the method "find" to check for any of the characters
	$(".b").click(function(){
		//if the character is undefined & the enemy has not been picked (placed in prevEnemy array) THEN define your character, add him to the array for referencing, and find the index for the character from the array within the players-object
		if (yourChar==undefined && prevEnemy.indexOf(this.id) ==-1 ){

		yourChar = this.id; //the id of the character that was clicked on. Ex: "char1"
		yourInd = players.id.indexOf(yourChar);
		prevEnemy.push(yourChar); //adding myself to the list so character does not figth itself

		// move the selected character "#yourChar" to the div ".theOne" and all others to the div ".enemies"
		$(".listedChars").appendTo(".enemies");
		$("#" + yourChar).appendTo(".theOne");

		//write a message to let the player what to do next
		$(".msg").html("<h3>Please select an enemy to fight against.</h3>");
		}
		//if the users character is defined BUT the enemy is not...
		else if (currentEnemy == undefined) {
			//check to see if the enemy has been defeated, yourCharacter is not being clicked, and that the list of enemies is not 4 ( user character + 3 potential dead enemies) --> hide the attack button and tell the user what to do
			if (prevEnemy.indexOf(this.id) > -1 && yourChar != this.id && prevEnemy.length !=4){
				$(".msg").html("<h3>This enemy has been defeated. Please select from the available list.</h3>");
				$(".a").hide();
			}
			//if the enemy has not been defeated but the user clicked on his charater, hide the attack button and tell the user what to do
			else if (prevEnemy.indexOf(this.id) > -1 && yourChar == this.id){
				$(".msg").html("<h3>You cannot select yourself to fight against...In this game at least.</h3>");
				$(".a").hide();
			}
			//if all enemies have been defeated, tell the user how to start over
			else if (prevEnemy.length ==4) {
				$(".msg").html("<h3>All enemies have been defeated. Click 'Play Again' to play another round.</h3>");
			}
			//else, show the attack button, define your enemy, find the enemy's index from array within object, and append the enemy and user-character to the arena for figthing
			else{

				$(".msg").html("");
				$(".a").show();
				currentEnemy = this.id;
				enemyInd = players.id.indexOf(currentEnemy);
				$("#" + yourChar).appendTo(".arena");
				$("#" + currentEnemy).appendTo(".arena");
			}

		}
		

	});//stop ($".b")

	
		
	// A Way to find the id of a button that is inside a div
	//$(".theOne").find(".b" ).attr("id") 

//for clikcing on the attack button...
	$(".a").click(function(){
		//if the user has not picked a character, display instructions
		if (yourChar == undefined){
			$(".msg").html("<h2>Please select a character to fight with.</h2>");
		}
		//if the enemy has not been selected --> instructions
		else if (currentEnemy ==undefined ){
			$(".msg").html("Please choose an enemy to fight against.");
		}
		//both enemy and user-character are selected, AND the stats of both are over 0...
		else if ((copy.defense[yourInd] > 0) && (copy.defense[enemyInd] >  0)){
			$(".msg").html("");

			//in my object-copy, update my players defense after deducting the enemy's counter-att
			copy.defense[yourInd] -= Number(players.cAttack[enemyInd]);

			//in my object-copy, update my enemies defense after deducting my character's current-attack. this will change every at
			copy.defense[enemyInd] -= Number(copy.attack[yourInd]);
			
			//update the attack of my character by adding the original attack power
			copy.attack[yourInd] += Number(players.attack[yourInd]);
		
			//now update the DOM-buttons to display the current defenses
			$("#d"+yourInd).html(Number(copy.defense[yourInd]));
			$("#d"+enemyInd).html(Number(copy.defense[enemyInd]));
			
			//when the enemy has been defeated, remove you enemy from the arena, add add it to the div ".defeated" (I will look into graying it out later...maybe). also set the variable currentEnemy to undefined so that the user has to select a new enemy
				if(copy.defense[enemyInd]<=0){
					$("#" + currentEnemy).appendTo(".defeated");
					prevEnemy.push(currentEnemy); //realized I needed to keep track of previous enemy
					currentEnemy = undefined;

				}

				/// msgs for when the user is winning, losing, both, other, etc. also, calls the play again function (.pa)
				if (copy.defense[yourInd]<=0 && copy.defense[enemyInd]<=0 && prevEnemy.length ==4){
					$(".msg").html("You have defeated all your enemies at the cost of your own life.");
					
					$(".pa").show();
				}
				else if (copy.defense[yourInd] > 0 && prevEnemy.length ==4){
					$(".msg").html("All Your enemies have been defeated! Great job!");
					
					$(".pa").show();
				}
				else if (copy.defense[yourInd]<=0){
					$(".msg").html("You have been defeated! The force was not with you.");
					
					$(".pa").show();
				}
		}//else if 
	}); // Stop $(".a")


});