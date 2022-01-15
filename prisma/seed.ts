import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function seed() {
  await Promise.all(
    getRecipies().map((recipie) => db.recipie.create({ data: recipie }))
  );
}

seed();

function getRecipies() {
  return [
    {
      name: "Beef Enchiladas",
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
      instructions:
        "Place roast in slow cooker and sprinkle onion soup mix over the roast. Add water and beef broth. Cook on high for 4-6 houts or low for 8-10. Serve on rolls with swiss cheese.",
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
  ];
}
