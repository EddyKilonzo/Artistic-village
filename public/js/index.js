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
// eye password
var state = false;

function toggle(){
    if(state){
        document.getElementById("password").setAttribute("type","password");
        document.getElementById("open").style.display = "block";
        state = false;
    }
    else{
        document.getElementById("password").setAttribute("type","text");
        document.getElementById("open").style.display = "block";
        state = true;
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
  
  const theme = document.querySelector(':root');
  const btns = document.querySelectorAll('.btn');
  
  btns.forEach(function(btn){
  
      btn.addEventListener("click", function(e){
  
          const color = e.currentTarget.classList;
  
          if(color.contains("btn1")){
              theme.style.setProperty("--theme-color", "#3498db");
          }
          else if(color.contains("btn2")){
              theme.style.setProperty("--theme-color", "#ff0808");
          }
          else if(color.contains("btn3")){
              theme.style.setProperty("--theme-color", "#1cb65d");
          }
          else if(color.contains("btn4")){
              theme.style.setProperty("--theme-color", "#8e44ad");
          }
          else{
              theme.style.setProperty("--theme-color", "#f4b932");
          }
      });
  });