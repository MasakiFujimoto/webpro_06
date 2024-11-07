const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/luck", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';
  console.log( 'あなたの運勢は' + luck + 'です' );
  res.render( 'luck', {number:num, luck:luck} );
});

app.get("/janken", (req, res) => {
  let hand = req.query.hand;
  let win = Number( req.query.win );
  let total = Number( req.query.total );
  let secret = Number( req.query.secret);
  if (win <= 0) win = 0;
  if (total <= 0) total = 0;
  console.log( {hand, win, total});
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  if ( secret == 1) cpu = 'グー';
  else if( num==1 ) cpu = 'グー';
  else if( num==2 ) cpu = 'チョキ';
  else cpu = 'パー';
  // ここに勝敗の判定を入れる
  // 今はダミーで人間の勝ちにしておく
  let judgement = ''
  if (secret == 1){
    judgement = 'あいこ';
  }
  else if (cpu == hand) {
    judgement = 'あいこ';
    total += 1;
  }
  else if (cpu == 'グー'){
    if(hand == 'パー'){
      total += 1;
      win += 1;
      judgement = '勝ち'
    }
    else {
      total += 1;
      judgement = '負け'
    }
  }
  else if (cpu == 'チョキ'){
    if(hand == 'グー'){
      total += 1;
      win += 1;
      judgement = '勝ち'
    }
    else {
      total += 1;
      judgement = '負け'
    }
  }
  else if (cpu == 'パー'){
    if(hand == 'チョキ'){
      total += 1;
      win += 1;
      judgement = '勝ち'
    }
    else {
      total += 1;
      judgement = '負け'
    }
  }

  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total
  }
  res.render( 'janken', display );
});

app.get("/juuden",(req, res) => {
  let hand = req.query.hand;
  let total = Number( req.query.total );
  let win = Number(req.query.win);
  let secret = Number(req.query.secret);
  const num = Math.floor( Math.random() * 3 + 1 );
  let cpu = '';
  let cpuenergy = Number(req.query.cpuenergy);
  if ( secret == 1) cpu = '';
  else if( num==1 ) cpu = 'バリア';
  else if( num==2 ) {
    if(cpuenergy >=1){
      cpu = 'ハー';
      cpuenergy = cpuenergy -1;
    }
    else cpu = '充電'    
  }
  else cpu = '充電';

  let energy = Number(req.query.energy);
    
  if (cpu =='充電') cpuenergy += 1;
  if (hand == '充電') energy += 1;

  console.log("energy:",energy,"hand:",hand);
  let judgement = '';
  if (energy == 0 && hand == 'ハー') hand = 'スカしっぺ';
  if (hand == 'バリア' || cpu == 'バリア'){
    judgement = '何も起きない';
    total += 1;
  }
  else if (hand == '充電' && cpu == 'ハー'){
    judgement = '負け';
    total += 1;
  }
  else if (hand == 'ハー' && cpu == '充電'){
    judgement = '勝ち';
    total +=1;
    win += 1;
  }
  else if (hand == cpu){
    judgement = '何も起きない';
    total +=1;
  }
  else if (hand == 'スカしっぺ' && cpu == 'ハー'){
    total+=1;
    judgement ='負け';
  }
  else if (hand == 'スカしっぺ' && cpu == '充電'){
    total +=1;
    judgement = '何も起きない';
  }
  const display = {
    your: hand,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total,
    cpuenergy: cpuenergy,
    energy: energy
  }
  res.render( 'juuden', display );
}
);

app.get("/magic",(req, res) => {
  let suggest = Number(req.query.suggest);
  let total = Number(req.query.total);
  let win = Number(req.query.win);

  const cpu = Math.floor(Math.random() *10 +1);
  let judgement = ''

  if (suggest == cpu){
    win +=1;
    total +=1;
    judgement = '正解'
  }
  else {
    total += 1;
    judgement = '不正解'
  }

  let secret = Number(req.query.secret);
  let attention = '';
  if (suggest > 10){
    secret +=1;
    if(secret == 0){
      attention = '数字は1~10の間で提案してね！'
    }
    else if(secret == 1){
      attention = '......さっき1~10の間で提案してねって言ったよね'
    }
    else if(secret <5){
      attention = 'あれ，聞こえてる？バグで僕の言葉が届いてないのかな......'
    }
    else if(secret <10){
      attention = 'ねぇ，遊んでいるよね．僕で遊んでるよね．いい加減にしてくれる？人で遊ぶのは良くないって親に教わらなかった？'
    }
    else if(secret <= 10){
      attention ='ぐすん.......'
    }
  }

  const display = {
    your: suggest,
    cpu: cpu,
    judgement: judgement,
    win: win,
    total: total,
    secret: secret,
    attention: attention
  }
  res.render( 'magic', display);
});
app.listen(8080, () => console.log("Example app listening on port 8080!"));
