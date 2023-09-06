function retrieve(parent,IDs,game=false){
    let map = {}
    IDs.forEach(item => {
        map[item] = document.createElement("p")
        map[item].id = item
        if(game){
          map[item].addEventListener("click",()=>{
            game.setItem = game.setItem === item ? null : item;
          })
        }
        parent.appendChild(map[item])
    })
    return map
}

function lerp(A,B,t){
  return A+(B-A)*t
}

function p(t,a=0.00002){
  return t**2 *a
}
function pp(t){
  return -(t**2) + t*2
}
function ppp(t){
  return (-2*t)**3+t**2*3
}
function gradualCurve(x ,h=0.4, den=2, off=0) {
  const amplitude = h;    // 振幅（波の高さ）
  const frequency = den;  // 周期（波の密度）
  const offset = off;       // オフセット（y軸方向の平行移動）

  const curve = amplitude * Math.sin(frequency * (x)) + offset;

  return curve;
}

function lineCircleCollision(A,B,circle) {
    function len_vec2(vec) {
      return vec[0] * vec[0] + vec[1] * vec[1];
    }
    
    function inner_prod(vec1, vec2) {
      return vec1[0] * vec2[0] + vec1[1] * vec2[1];
    }
  
    var pos_o = [circle.x, circle.y];
    var r = circle.r;
    var pos_a = [A.x, A.y];
    var pos_b = [B.x, B.y];
  
    if (pos_a[0] === pos_b[0] && pos_a[1] === pos_b[1]) {
      return false;
    }
  
    if (r <= 0) {
      return false;
    }
  
    var vec_oa = [pos_a[0] - pos_o[0], pos_a[1] - pos_o[1]];
    var vec_ob = [pos_b[0] - pos_o[0], pos_b[1] - pos_o[1]];
  
    var len_oa2 = len_vec2(vec_oa);
    var len_ob2 = len_vec2(vec_ob);
    var inner_ab = inner_prod(vec_oa, vec_ob);
  
    var a = len_oa2 + len_ob2 - 2 * inner_ab;
    var b = -2 * len_oa2 + 2 * inner_ab;
    var c = len_oa2 - r * r;
  
    var det = b * b - 4 * a * c;
    if (det < 0) {
      return false;
    }
  
    var s1 = (-b - Math.sqrt(det)) / (2 * a);
    var s2 = (-b + Math.sqrt(det)) / (2 * a);
  
    return (s1 <= 1) && (0 <= s2);
  }

  function positionLC(A,B,C) {
    const v1 = {x:B.x-A.x,y:B.y-A.y};
    const v2 = {x:C.x-A.x,y:C.y-A.y};
  
    const crossProduct = v1.x*v2.y - v1.y*v2.x;
  
    return crossProduct>0
  }