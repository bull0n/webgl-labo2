/**
 * Generate a pseudo random number in a specify range
 * @param {float} min minimum value
 * @param {float} max maximum value
 */
function random(min, max)
{
   let range = max - min;
   return (Math.random() * range) + min;
}
