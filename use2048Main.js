function initMyGame()
{
  game.init2048("innerbox");
  document.addEventListener("keypress",game.play);
  console.log("done");
  var el = document.getElementById("reset");
  el.addEventListener("click",game.reset);
}