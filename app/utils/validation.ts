export function isValidEmail(email: string) {
  if (!email.includes("@") || !email.split("@")[1].includes(".")) {
    return false;
  }
  return true;
}

export function isBlank(value: string | undefined | null) {
  if (typeof value === "string" && value.length === 0) {
    return true;
  }
  return false;
}

export function validateRecipe(recipeData: {
  [key: string]: string | undefined;
}) {
  const errors: { [key: string]: string } = {};
  if (isBlank(recipeData.name)) {
    errors.name = "Name cannot be blank";
  }
  if (isBlank(recipeData.totalTime)) {
    errors.totalTime = "Time cannot be blank";
  }
  if (isBlank(recipeData.instructions)) {
    errors.instructions = "Instructions cannot be blank";
  }
  return errors;
}
