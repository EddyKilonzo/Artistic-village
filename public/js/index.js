
var i=0
function read() {
  if(!i){
  document.getElementById('more').style.display="inline";
  document.getElementById('dots').style="none";
  document.getElementById('read').innerHTML="Read less";
  i=1
  } 
  else{
    document.getElementById('more').style.display="none";
    document.getElementById('dots').style="inline";
    document.getElementById('read').innerHTML="Read more";
    i=0
  }
}
   // scroll to top
let calcScrollValue = () => {
    let scrollProgress = document.getElementById("progress");
    let progressValue = document.getElementById("progress-value");
    let pos = document.documentElement.scrollTop;
    let calcHeight =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    let scrollValue = Math.round((pos * 100) / calcHeight);
    if (pos > 100) {
      scrollProgress.style.display = "grid";
    } else {
      scrollProgress.style.display = "none";
    }
    scrollProgress.addEventListener("click", () => {
      document.documentElement.scrollTop = 0;
    });
    scrollProgress.style.background = `conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%)`;
  };
  window.onscroll = calcScrollValue;
  window.onload = calcScrollValue;
  
  
