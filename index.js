/*
Daniel Oh
Professor Jaime Canizales
CSCI 39548
Final Project
In this project, students are expected to build a website using the
Express/Node.js platform, with the Axios HTTP client, that integrates a chosen
public API from the given list: Public API Lists. The website should interact
with the chosen API, retrieve data, and present it in a user-friendly manner.

For this project, I am using the CocktailDB API to make a website that gives the user a random
cocktail recipe with images of the cocktail.
This is the .js file for the project
*/


import express from "express";
import axios from "axios";

//express server initialization
const app = express();
const port = 3000;

// app.use(express.urlencoded({ extended: true })); // no user input
app.use(express.static("public")); //for static files (CSS)

app.set('view engine', 'ejs');

// API integration, GET endpoint
app.get("/", async (req, res) => {
    try {
      const response = await axios.get("https://www.thecocktaildb.com/api/json/v1/1/random.php"); //API integration
      const result = response.data.drinks[0]; //cocktail 
      const ingredients = extractIngredients(result);
      res.render("index.ejs", { data: result, ingredients: ingredients });

      
      //Error handling for if the cocktail is not stored in result
      if(!result){
        throw new Error("Could not find a cocktail recipe.");
      }
    } catch (error) { // recipe fetching error handling
        console.log(error.response.data);
        res.status(500).send("Could not fetch the cocktail recipe.");
      }
});

//express server successful indication
app.listen(port, () => {
    console.log(`server running on port ${port}`);
});


// ingredients are provided individually
/*
Ex.
"strIngredient1" : "Vodka",
"strIngredient2" : "Lime",
"strMeasure1" : "2 oz",
etc..
*/
// helper function to extract the ingredients in a cocktail
function extractIngredients(result){ 
  const ingredients = [];
  for(let i = 1; i <= 100; i++){ 
    const ingredient = result[`strIngredient${i}`]; //ingredient Ex. Light rum
    const measurement = result[`strMeasure${i}`]; //measurements Ex. 1 tsp
    // console.log(ingredient, measurement);
    //issue with null and undefined being represented in ingredients
    if(ingredient !== null && ingredient !== undefined && measurement !== null && measurement !== undefined){
      // ingredients with no measurement Ex. ground Cayenne pepper
      let fullIngredients = ingredient; 
      // ingredients WITH measurements
      if(measurement){
        fullIngredients = `${measurement.trim()} ${ingredient.trim()}`;
      }
      ingredients.push(fullIngredients);
    }
  }
  //separation by commas
  return ingredients.join(", "); 
}