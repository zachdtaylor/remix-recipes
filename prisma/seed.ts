import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getRecipes().map((recipe) => db.recipe.create({ data: recipe }))
  );
}

seed();

function getRecipes() {
  return [
    {
      name: "Beef Enchiladas",
      totalTime: "20 min",
      instructions:
        "Cook taco meat and add refried beans and chilies. In a separate container, combine enchilada sauce and soup. Dip tortillas in enchilada mixture and fill with beef mixture and grated cheese. Arrange tortillas in shallow baking dish and pour remaining enchilada sauce on top. Sprinkle with remaining cheese and bake at 350 for 25-30 minutes.",
      ingredients: {
        create: [
          { amount: "1 lb", name: "taco seasoned beef" },
          { amount: "1 can", name: "green chilis" },
          { amount: "1 can", name: "refried beans" },
          { amount: "8", name: "flour tortillas" },
          { amount: "1 can", name: "enchilada sauce" },
          { amount: "1 can", name: "cream of mushroom soup" },
          { amount: "", name: "grated cheddar cheese" },
        ],
      },
    },
    {
      name: "Buttermilk Pancakes",
      totalTime: "15 min",
      instructions:
        "Whisk together salt, baking powder, baking soda, four and sugar. In a separate bowl, combine eggs and butermilk and drizzle in butter. With wooden spoon, combine wet and dry ingredients until just moistened.",
      ingredients: {
        create: [
          { amount: "1 tsp", name: "salt" },
          { amount: "2 tsp", name: "baking powder" },
          { amount: "1 tsp", name: "baking soda" },
          { amount: "2 cups", name: "flour" },
          { amount: "2 tbsp", name: "sugar" },
          { amount: "2", name: "eggs" },
          { amount: "2 cups", name: "buttermilk" },
          { amount: "2 tbsp", name: "butter, melted" },
        ],
      },
    },
    {
      name: "French Dip Sandwiches",
      totalTime: "4-10 hrs (crockpot)",
      instructions:
        "Place roast in slow cooker and sprinkle onion soup mix over the roast. Add water and beef broth. Cook on high for 4-6 hours or low for 8-10. Serve on rolls with swiss cheese.",
      ingredients: {
        create: [
          { amount: "", name: "Beef roast" },
          { amount: "1 pkg", name: "dry onion soup mix" },
          { amount: "2 cans", name: "beef broth" },
          { amount: "2 cans", name: "water" },
          { amount: "", name: "Sliced swiss cheese" },
          { amount: "", name: "Hoagie buns" },
        ],
      },
    },
    {
      name: "Shepherds Pie",
      totalTime: "40 min",
      instructions:
        "Brown ground beef with onion. Add brown sugar, vinegar, tomato soup and mustard. Pour into baking dish and top with mashed potatoes. Sprinkle with grated cheese and bake at 350 for 30 minutes.",
      ingredients: {
        create: [
          { amount: "1/4 cup", name: "chopped onion" },
          { amount: "1 lb", name: "ground beef" },
          { amount: "1/3 cup", name: "brown sugar" },
          { amount: "1 tbsp", name: "vinegar" },
          { amount: "1 can", name: "tomato soup" },
          { amount: "1 tsp", name: "mustard" },
          { amount: "", name: "mashed potatoes" },
          { amount: "", name: "grated cheese" },
        ],
      },
    },
    {
      name: "Chicken Alfredo",
      totalTime: "90 min",
      instructions:
        "Melt butter in large pan. Add garlic and cook for 30 seconds. Whisk in flour and stir for another 30 seconds. Add cream cheese and stir until it starts to melt down. Pour in cream and parmesean and whisk until cream cheese is incorporated. Once the sauce has thickened, season with salt and pepper.\n\nCut chicken into thin pieces. In a shallow dish combine flour, 1 tsp salt and 1 tsp pepper. In another dish beat eggs. In a third dish combine bread crumbs and parmesean. Working with one piece at a time, dredge in flour, then egg, then bread crumb/parmesean mixture. Cover and place in a baking dish and bake at 350 for 50-60 minutes.\n\n(Sausage can also be added to this alfredo for a variation)",
      ingredients: {
        create: [
          { amount: "1 stick", name: "butter" },
          { amount: "4", name: "garlic cloves, minced" },
          { amount: "2 tbsp", name: "flour" },
          { amount: "8 oz", name: "cream cheese" },
          { amount: "2 cups", name: "heavy cream" },
          { amount: "1 1/3 cup", name: "grated parmesean cheese" },
          { amount: "", name: "salt and pepper to taste" },
          { amount: "1 pkg", name: "desired pasta" },
          { amount: "2-3", name: "chicken breasts" },
          { amount: "1 cup", name: "flour" },
          { amount: "3", name: "eggs" },
          { amount: "1 1/2 cup", name: "bread crumbs" },
          { amount: "1 1/2 cup", name: "parmesean cheese" },
        ],
      },
    },
  ];
}
